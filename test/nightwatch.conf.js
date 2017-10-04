/* jshint ignore:start */
module.exports = (() => {
  return {
    src_folders: ['test/e2e'],
    output_folder: 'test/reports',

    selenium: {
      start_process: true,
      server_path: 'test/libs/selenium-server-standalone.jar',
      port: 4444,
      cli_args: {
        'webdriver.chrome.driver': 'node_modules/.bin/chromedriver',
      }
    },

    test_settings: {
      default: {
        launch_url: 'http://localhost:3000/test/e2e/html',
        selenium_port: 4444,
        selenium_host: 'localhost',
        desiredCapabilities: {
          browserName: 'chrome',
          javascriptEnabled: true,
        },
        filter: 'test/e2e/**/*.test.js',
      },
    },
  };
})();
/* jshint ignore:end */
