module.exports = config=>{
  config.set({
    frameworks: ["mocha", "chai"],
    files: [
      {pattern: "src/**/*.js", type: "module"}
    ],
    reporters: ["mocha"],
    port: 9876,  // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ["ChromeHeadless"],
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity
  })
}
