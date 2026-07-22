const newman = require("newman");
const path = require("path");
const fs = require("fs");

// Configuration
const config = {
  collection: path.join(
    __dirname,
    "Hospital-API-TestSuite.postman_collection.json"
  ),
  environment: path.join(
    __dirname,
    "environments",
    "Hospital-API-Development.postman_environment.json"
  ),
  reporters: ["cli", "html", "json"],
  reporterHtmlExport: path.join(
    __dirname,
    "test-results",
    "newman-report.html"
  ),
  reporterJsonExport: path.join(
    __dirname,
    "test-results",
    "newman-report.json"
  ),
  insecure: true, // Allow self-signed certificates
  timeout: 30000, // 30 second timeout
  delayRequest: 1000, // 1 second delay between requests
  iterationCount: 1,
  bail: false, // Continue on failures
};

// Create test-results directory if it doesn't exist
const testResultsDir = path.join(__dirname, "test-results");
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

console.log("🚀 Starting Hospital API Test Suite...\n");

newman.run(config, (err, summary) => {
  if (err) {
    console.error("❌ Test suite execution failed:", err);
    process.exit(1);
  }

  console.log("\n📊 Test Suite Summary:");
  console.log("=".repeat(50));

  // Collection info
  console.log(`Collection: ${summary.collection.name}`);
  console.log(`Total Requests: ${summary.run.stats.requests.total}`);
  console.log(`Failed Requests: ${summary.run.stats.requests.failed}`);

  // Test results
  console.log(`\n🧪 Test Results:`);
  console.log(`Total Tests: ${summary.run.stats.tests.total}`);
  console.log(`Passed: ${summary.run.stats.tests.passed}`);
  console.log(`Failed: ${summary.run.stats.tests.failed}`);

  // Assertions
  console.log(`\n✅ Assertions:`);
  console.log(`Total: ${summary.run.stats.assertions.total}`);
  console.log(`Passed: ${summary.run.stats.assertions.passed}`);
  console.log(`Failed: ${summary.run.stats.assertions.failed}`);

  // Execution time
  const executionTime =
    summary.run.timings.completed - summary.run.timings.started;
  console.log(`\n⏱️  Execution Time: ${executionTime}ms`);

  // Failures
  if (summary.run.failures.length > 0) {
    console.log(`\n❌ Failures:`);
    summary.run.failures.forEach((failure, index) => {
      console.log(
        `${index + 1}. ${failure.error.name}: ${failure.error.message}`
      );
      if (failure.source) {
        console.log(`   Request: ${failure.source.name}`);
      }
    });
  }

  // Success rate
  const successRate = (
    (summary.run.stats.assertions.passed / summary.run.stats.assertions.total) *
    100
  ).toFixed(2);
  console.log(`\n📈 Success Rate: ${successRate}%`);

  // Report files
  console.log(`\n📄 Reports Generated:`);
  console.log(`HTML Report: ${config.reporterHtmlExport}`);
  console.log(`JSON Report: ${config.reporterJsonExport}`);

  console.log(`\n${"=".repeat(50)}`);

  if (summary.run.failures.length > 0) {
    console.log("❌ Test suite completed with failures");
    process.exit(1);
  } else {
    console.log("✅ All tests passed successfully!");
    process.exit(0);
  }
});
