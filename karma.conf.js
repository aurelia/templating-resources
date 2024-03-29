const path = require('path');
const { AureliaPlugin } = require('aurelia-webpack-plugin');

module.exports = function(config) {
  const browsers = config.browsers;
  config.set({

    basePath: '',
    frameworks: ["jasmine"],
    files: ["test/**/*.spec.ts"],
    preprocessors: {
      "test/**/*.spec.ts": ["webpack", "sourcemap"],
    },
    webpack: {
      mode: "development",
      entry: 'test/setup.ts',
      watch: false,
      resolve: {
        extensions: [".ts", ".js"],
        modules: ["src", 'test', "node_modules"].map(m => path.resolve(__dirname, m)),
        alias: {
          src: path.resolve(__dirname, "src"),
          test: path.resolve(__dirname, 'test'),
          'aurelia-templating-resources': path.resolve(__dirname, 'src/aurelia-templating-resources.ts')
        }
      },
      devtool: browsers.indexOf('ChromeDebugging') > -1 ? 'eval-source-map' : 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.ts$/,
            loader: "ts-loader",
            exclude: /node_modules/,
            options: {
              compilerOptions: {
                sourceMap: true
              }
            }
          },
          {
            test: /\.html$/i,
            loader: 'html-loader'
          }
        ]
      },
      plugins: [
        new AureliaPlugin({ dist: 'es2015' })
      ]
    },
    mime: {
      "text/x-typescript": ["ts"]
    },
    reporters: ["mocha"],
    webpackServer: { noInfo: config.noInfo },
    browsers: browsers && browsers.length > 0 ? browsers : ['ChromeHeadless'],
    customLaunchers: {
      ChromeDebugging: {
        base: "Chrome",
        flags: ["--remote-debugging-port=9333"],
        debug: true
      }
    },
    singleRun: false,
    mochaReporter: {
      ignoreSkipped: true
    },
    webpackMiddleware: {
      logLevel: 'silent'
    },
  });
};
