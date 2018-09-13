/* jshint ignore:start */
module.exports = (() => {
  const config = {
    src_folders: ['test/e2e'],
    output_folder: 'test/reports',

    selenium: {
      start_process: true,
      server_path: 'test/libs/selenium-server-standalone.jar',
      port: 4444,
      cli_args: {
        'webdriver.chrome.driver': 'node_modules/.bin/chromedriver'
      }
    },

    test_settings: {
      default: {
        launch_url: 'http://localhost:3000/test/e2e/html',
        selenium_port: 4444,
        selenium_host: 'localhost',
        desiredCapabilities: {
          browserName: 'chrome',
          javascriptEnabled: true
        },
        filter: 'test/e2e/**/*.test.js'
      },
      ie9: {
        desiredCapabilities: {
          browserName: 'internet explorer',
          platform: 'Windows 7',
          version: '9.0',
          build: process.env.TRAVIS_BUILD_NUMBER,
          'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
        }
      },
      ie10: {
        desiredCapabilities: {
          browserName: 'internet explorer',
          platform: 'Windows 8',
          version: '10.0',
          build: process.env.TRAVIS_BUILD_NUMBER,
          'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
        }
      },
      ie11: {
        desiredCapabilities: {
          browserName: 'internet explorer',
          platform: 'Windows 8.1',
          version: '11.0',
          build: process.env.TRAVIS_BUILD_NUMBER,
          'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
        }
      },
      ie_edge: {
        desiredCapabilities: {
          browserName: 'microsoftedge',
          platform: 'Windows 10',
          version: 'latest',
          build: process.env.TRAVIS_BUILD_NUMBER,
          'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
        }
      },
      chrome: {
        desiredCapabilities: {
          browserName: 'chrome',
          platform: 'Windows 8',
          version: 'latest',
          build: process.env.TRAVIS_BUILD_NUMBER,
          'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
        }
      },
      firefox: {
        desiredCapabilities: {
          browserName: 'firefox',
          platform: 'Windows 8',
          version: 'latest',
          build: process.env.TRAVIS_BUILD_NUMBER,
          'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
        }
      },
      safari: {
        desiredCapabilities: {
          browserName: 'safari',
          platform: 'OS X 10.10',
          version: 'latest',
          build: process.env.TRAVIS_BUILD_NUMBER,
          'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
        }
      }
    }
  };

  if (process.env.TRAVIS) {
    config.test_settings.default = {
      launch_url: 'http://localhost:3000/test/e2e/html',
      silent: true,
      selenium_host: 'ondemand.saucelabs.com',
      selenium_port: 80,
      username: process.env.SAUCE_USERNAME,
      access_key: process.env.SAUCE_ACCESS_KEY,
      filter: 'test/e2e/**/*.test.js'
    };
  }

  return config;
})();
/* jshint ignore:end */
