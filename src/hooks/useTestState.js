import { useReducer, useCallback, useEffect, useRef, useState } from 'react';
import { parseCsv, sleep, makeRequest } from '../utils/testUtils';

const initialState = {
    csvContent: '',
    numRequests: 10,
    duration: 1,
    concurrency: 1,
    results: [],
    isLoading: false,
    progress: 0,
    error: null,
    stats: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        avgResponseTime: 0,
        minResponseTime: Infinity,
        maxResponseTime: 0,
        throughput: 0,
        errorRate: 0,
        avgTTFB: 0,
        startTime: null,
        responseTimes: [],
        percentiles: {
            p50: 0,
            p90: 0,
            p95: 0,
            p99: 0,
        },
        endpointPerformance: {},
        sla: {
            totalRequests: 0,
            successfulRequests: 0,
        },
    },
    history: [],
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_CSV_CONTENT':
            return { ...state, csvContent: action.payload };
        case 'SET_NUM_REQUESTS':
            return { ...state, numRequests: action.payload };
        case 'SET_DURATION':
            return { ...state, duration: action.payload };
        case 'SET_CONCURRENCY':
            return { ...state, concurrency: action.payload };
        case 'SET_RESULTS':
            return { ...state, results: action.payload };
        case 'ADD_RESULT':
            return { ...state, results: [action.payload, ...state.results] };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_PROGRESS':
            return { ...state, progress: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'UPDATE_STATS':
            return { ...state, stats: { ...state.stats, ...action.payload } };
        case 'SET_HISTORY':
            return { ...state, history: action.payload };
        case 'RESET_TEST':
            return {
                ...state,
                results: [],
                progress: 0,
                error: null,
                stats: {
                    ...initialState.stats,
                    startTime: Date.now(),
                },
            };
        default:
            return state;
    }
}

const useTestState = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [, forceUpdate] = useState({});
    const statsRef = useRef(initialState.stats);

    useEffect(() => {
        const savedHistory = localStorage.getItem('testHistory');
        if (savedHistory) {
            dispatch({ type: 'SET_HISTORY', payload: JSON.parse(savedHistory) });
        }
    }, []);

    const saveHistory = useCallback((newRun) => {
        const updatedHistory = [...state.history, newRun];
        dispatch({ type: 'SET_HISTORY', payload: updatedHistory });
        localStorage.setItem('testHistory', JSON.stringify(updatedHistory));
        console.log('New run saved to history:', newRun);
    }, [state.history]);

    const clearHistory = useCallback(() => {
        dispatch({ type: 'SET_HISTORY', payload: [] });
        localStorage.removeItem('testHistory');
    }, []);

    const loadTestRun = useCallback((run) => {
        dispatch({ type: 'SET_CSV_CONTENT', payload: run.csvContent });
        dispatch({ type: 'SET_NUM_REQUESTS', payload: run.numRequests });
        dispatch({ type: 'SET_DURATION', payload: run.duration });
        dispatch({ type: 'SET_CONCURRENCY', payload: run.concurrency });
        dispatch({ type: 'SET_RESULTS', payload: run.results });
        dispatch({ type: 'UPDATE_STATS', payload: run.stats });
        dispatch({ type: 'SET_ERROR', payload: run.error });
        dispatch({ type: 'SET_PROGRESS', payload: 100 });
        dispatch({ type: 'SET_LOADING', payload: false });
    }, []);

    const updateStats = useCallback((newResult) => {
        const stats = statsRef.current;
        const totalRequests = stats.totalRequests + 1;
        const successfulRequests = (newResult.status === 200)
            ? stats.successfulRequests + 1
            : stats.successfulRequests;
        const failedRequests = totalRequests - successfulRequests;
        const totalResponseTime = (stats.avgResponseTime * stats.totalRequests) + (newResult.responseTime || 0);
        const avgResponseTime = totalResponseTime / totalRequests;
        const minResponseTime = Math.min(stats.minResponseTime, newResult.responseTime || Infinity);
        const maxResponseTime = Math.max(stats.maxResponseTime, newResult.responseTime || 0);
        const errorRate = (failedRequests / totalRequests) * 100;
        const throughput = totalRequests / ((Date.now() - stats.startTime) / 1000); // requests per second
        const totalTTFB = (stats.avgTTFB * stats.totalRequests) + (newResult.ttfb || 0);
        const avgTTFB = totalTTFB / totalRequests;

        // Update response times array
        const responseTimes = [...stats.responseTimes, newResult.responseTime];

        // Calculate percentiles
        const sortedResponseTimes = [...responseTimes].sort((a, b) => a - b);
        const calculatePercentile = (p) => {
            const index = Math.ceil((p / 100) * sortedResponseTimes.length) - 1;
            return sortedResponseTimes[index] || 0;
        };

        const percentiles = {
            p50: calculatePercentile(50),
            p90: calculatePercentile(90),
            p95: calculatePercentile(95),
            p99: calculatePercentile(99),
        };

        // Update endpoint performance
        const endpointPerformance = { ...stats.endpointPerformance };
        if (!endpointPerformance[newResult.url]) {
            endpointPerformance[newResult.url] = {
                totalRequests: 0,
                successfulRequests: 0,
                totalResponseTime: 0,
                totalTTFB: 0,
            };
        }
        const ep = endpointPerformance[newResult.url];
        ep.totalRequests++;
        ep.successfulRequests += newResult.status === 200 ? 1 : 0;
        ep.totalResponseTime += newResult.responseTime || 0;
        ep.totalTTFB += newResult.ttfb || 0;
        ep.avgResponseTime = ep.totalResponseTime / ep.totalRequests;
        ep.avgTTFB = ep.totalTTFB / ep.totalRequests;
        ep.successRate = (ep.successfulRequests / ep.totalRequests) * 100;

        // Update SLA
        const sla = {
            totalRequests: stats.sla.totalRequests + 1,
            successfulRequests: stats.sla.successfulRequests + (newResult.status === 200 ? 1 : 0),
        };

        const updatedStats = {
            totalRequests,
            successfulRequests,
            failedRequests,
            avgResponseTime,
            minResponseTime,
            maxResponseTime,
            errorRate,
            throughput,
            avgTTFB,
            startTime: stats.startTime,
            responseTimes,
            percentiles,
            endpointPerformance,
            sla,
        };

        statsRef.current = updatedStats;
        dispatch({ type: 'UPDATE_STATS', payload: updatedStats });
        forceUpdate({});

        console.log('Updated stats:', updatedStats);
        console.log('Percentiles:', percentiles);
    }, []);

    const runTest = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'RESET_TEST' });
        statsRef.current = { ...initialState.stats, startTime: Date.now() };

        const errors = [];
        const testStartTime = new Date();

        try {
            const urls = parseCsv(state.csvContent);
            if (urls.length === 0) {
                throw new Error("No valid URLs found in the CSV file.");
            }

            const durationMs = state.duration * 60 * 1000;
            const intervalMs = durationMs / state.numRequests;

            const startTime = Date.now();
            let requestCount = 0;

            const runBatch = async () => {
                const batchPromises = [];
                for (let i = 0; i < state.concurrency && requestCount < state.numRequests; i++) {
                    const url = urls[requestCount % urls.length].URL;
                    batchPromises.push(makeRequest(url).then(result => {
                        dispatch({ type: 'ADD_RESULT', payload: result });
                        updateStats(result);
                        if (result.error) {
                            errors.push(`Request ${requestCount + 1} (${url}): ${result.error.name} - ${result.error.message}`);
                        }
                        requestCount++;
                    }));
                }
                await Promise.all(batchPromises);
            };

            while (Date.now() - startTime < durationMs && requestCount < state.numRequests) {
                await runBatch();

                const elapsedTime = Date.now() - startTime;
                const progressPercentage = Math.min((elapsedTime / durationMs) * 100, 100);
                dispatch({ type: 'SET_PROGRESS', payload: progressPercentage });

                const expectedElapsedTime = requestCount * intervalMs;
                if (expectedElapsedTime > elapsedTime) {
                    await sleep(expectedElapsedTime - elapsedTime);
                }
            }
        } catch (error) {
            console.error("Test execution error:", error);
            let errorMessage = `Test execution error: ${error.name} - ${error.message}`;
            if (error.code === 'ECONNREFUSED') {
                errorMessage += "\nUnable to connect to the proxy server. Please ensure the server is running.";
            }
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
            dispatch({ type: 'SET_PROGRESS', payload: 100 });
            if (errors.length > 0) {
                dispatch({ type: 'SET_ERROR', payload: errors.join('\n') });
            }

            // Save the test run to history
            const testEndTime = new Date();
            const newRun = {
                id: Date.now(),
                startTime: testStartTime,
                endTime: testEndTime,
                duration: state.duration,
                numRequests: state.numRequests,
                concurrency: state.concurrency,
                results: state.results,
                stats: statsRef.current,
                error: state.error,
                csvContent: state.csvContent
            };
            saveHistory(newRun);
        }
    }, [state.csvContent, state.numRequests, state.duration, state.concurrency, updateStats, saveHistory]);

    return {
        ...state,
        stats: statsRef.current,
        setCsvContent: (content) => dispatch({ type: 'SET_CSV_CONTENT', payload: content }),
        setNumRequests: (num) => dispatch({ type: 'SET_NUM_REQUESTS', payload: num }),
        setDuration: (dur) => dispatch({ type: 'SET_DURATION', payload: dur }),
        setConcurrency: (con) => dispatch({ type: 'SET_CONCURRENCY', payload: con }),
        clearHistory,
        loadTestRun,
        runTest
    };
};

export default useTestState;