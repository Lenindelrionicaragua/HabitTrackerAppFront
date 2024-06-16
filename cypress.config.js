module.exports = {
  projectId: "6wf3k2",

  e2e: {
    setupNodeEvents: false,
    supportFile: false,
    baseUrl: "http://192.168.178.182:8081",
    specPattern: "__test__/cypress/e2e/**/*.spec.js",
    chromeOptions: {
      headless: false,
      showChromiumWindow: true
    }
  }
};
