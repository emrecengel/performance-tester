const newman = require('newman');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const collectionFile = path.join(__dirname, 'test_collection.json');
const urlsFile = path.join(__dirname, 'urls.csv');
const urls = [];

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => readline.question(query, resolve));
}

async function getUserInput() {
    const totalRequests = parseInt(await askQuestion("Enter the total number of requests: "), 10);
    const durationMinutes = parseInt(await askQuestion("Enter the total duration in minutes: "), 10);
    readline.close();
    return { totalRequests, durationMinutes };
}

console.log('Starting CSV read process...');
console.log('CSV file path:', urlsFile);

fs.createReadStream(urlsFile)
    .pipe(csv())
    .on('data', (row) => {
        const urlKey = Object.keys(row).find(key => key.toLowerCase().includes('url'));
        if (urlKey && row[urlKey]) {
            urls.push(row[urlKey].trim());
        }
    })
    .on('end', async () => {
        console.log(`Loaded ${urls.length} URLs from CSV`);
        if (urls.length === 0) {
            console.error('No valid URLs found in the CSV file. Please check the file format.');
            process.exit(1);
        }
        const { totalRequests, durationMinutes } = await getUserInput();
        runTests(totalRequests, durationMinutes);
    });

function runTests(totalRequests, durationMinutes) {
    const startTime = Date.now();
    const endTime = startTime + (durationMinutes * 60 * 1000);
    let sentRequests = 0;
    let completedRequests = 0;
    let currentUrlIndex = 0;
    const results = [];

    const intervalMs = (durationMinutes * 60 * 1000) / totalRequests;

    function sendRequest() {
        if (sentRequests >= totalRequests || Date.now() >= endTime) {
            if (completedRequests >= totalRequests) {
                finishTests();
            }
            return;
        }

        const url = urls[currentUrlIndex];
        currentUrlIndex = (currentUrlIndex + 1) % urls.length;
        sentRequests++;

        newman.run({
            collection: require(collectionFile),
            iterationData: [{ url }],
            iterationCount: 1,
            reporters: ['cli'],
            reporter: {
                cli: {
                    silent: true
                }
            }
        }, function (err, summary) {
            completedRequests++;
            
            if (err) {
                console.error(`Error in request ${completedRequests}:`, err);
            } else {
                const execution = summary.run.executions[0];
                const result = {
                    url: url,
                    responseTime: execution.response.responseTime,
                    status: execution.response.status,
                    code: execution.response.code
                };
                results.push(result);
                console.log(`Request ${completedRequests}/${totalRequests}: ${result.url} - Status: ${result.status}, Time: ${result.responseTime}ms`);
            }

            const elapsedTime = (Date.now() - startTime) / 1000;
            const requestsPerSecond = completedRequests / elapsedTime;
            console.log(`Progress: ${completedRequests}/${totalRequests}. Rate: ${requestsPerSecond.toFixed(2)} req/s`);

            if (completedRequests >= totalRequests) {
                finishTests();
            }
        });

        const nextRequestTime = startTime + (sentRequests * intervalMs);
        const delay = Math.max(0, nextRequestTime - Date.now());
        setTimeout(sendRequest, delay);
    }

    function finishTests() {
        const actualDuration = (Date.now() - startTime) / 1000;
        console.log(`\nTest completed.`);
        console.log(`Total requests: ${completedRequests}`);
        console.log(`Actual duration: ${actualDuration.toFixed(2)} seconds`);
        
        fs.writeFileSync('performance_results.json', JSON.stringify(results, null, 2));
        console.log('Results exported to performance_results.json');
    }

    sendRequest();
}