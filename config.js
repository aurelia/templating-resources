System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "aurelia-templating-resources/*": "dist/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "aurelia-binding": "npm:aurelia-binding@2.2.0",
    "aurelia-bootstrapper": "npm:aurelia-bootstrapper@2.3.1",
    "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
    "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.2",
    "aurelia-framework": "npm:aurelia-framework@1.3.1",
    "aurelia-history-browser": "npm:aurelia-history-browser@1.3.0",
    "aurelia-loader": "npm:aurelia-loader@1.0.1",
    "aurelia-loader-default": "npm:aurelia-loader-default@1.2.0",
    "aurelia-logging": "npm:aurelia-logging@1.5.1",
    "aurelia-metadata": "npm:aurelia-metadata@1.0.5",
    "aurelia-pal": "npm:aurelia-pal@1.8.1",
    "aurelia-pal-browser": "npm:aurelia-pal-browser@1.8.1",
    "aurelia-path": "npm:aurelia-path@1.1.2",
    "aurelia-polyfills": "npm:aurelia-polyfills@1.3.0",
    "aurelia-task-queue": "npm:aurelia-task-queue@1.3.2",
    "aurelia-templating": "npm:aurelia-templating@1.10.1",
    "aurelia-templating-binding": "npm:aurelia-templating-binding@1.5.2",
    "aurelia-templating-resources": "npm:aurelia-templating-resources@1.7.2",
    "aurelia-templating-router": "npm:aurelia-templating-router@1.3.3",
    "aurelia-testing": "npm:aurelia-testing@0.5.0",
    "babel": "npm:babel-core@6.26.3",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "core-js": "npm:core-js@2.6.2",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.1": {
      "buffer": "npm:buffer@5.2.1"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.10"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:aurelia-binding@2.2.0": {
      "aurelia-logging": "npm:aurelia-logging@1.5.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.5",
      "aurelia-pal": "npm:aurelia-pal@1.8.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.3.2"
    },
    "npm:aurelia-bootstrapper@2.3.1": {
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.2",
      "aurelia-framework": "npm:aurelia-framework@1.3.1",
      "aurelia-history": "npm:aurelia-history@1.2.0",
      "aurelia-history-browser": "npm:aurelia-history-browser@1.3.0",
      "aurelia-loader-default": "npm:aurelia-loader-default@1.2.0",
      "aurelia-logging-console": "npm:aurelia-logging-console@1.1.0",
      "aurelia-pal": "npm:aurelia-pal@1.8.1",
      "aurelia-pal-browser": "npm:aurelia-pal-browser@1.8.1",
      "aurelia-polyfills": "npm:aurelia-polyfills@1.3.0",
      "aurelia-router": "npm:aurelia-router@1.6.3",
      "aurelia-templating": "npm:aurelia-templating@1.10.1",
      "aurelia-templating-binding": "npm:aurelia-templating-binding@1.5.2",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.7.2",
      "aurelia-templating-router": "npm:aurelia-templating-router@1.3.3"
    },
    "npm:aurelia-dependency-injection@1.4.2": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.5",
      "aurelia-pal": "npm:aurelia-pal@1.8.1"
    },
    "npm:aurelia-event-aggregator@1.0.2": {
      "aurelia-logging": "npm:aurelia-logging@1.5.1"
    },
    "npm:aurelia-framework@1.3.1": {
      "aurelia-binding": "npm:aurelia-binding@2.2.0",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-loader": "npm:aurelia-loader@1.0.1",
      "aurelia-logging": "npm:aurelia-logging@1.5.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.5",
      "aurelia-pal": "npm:aurelia-pal@1.8.1",
      "aurelia-path": "npm:aurelia-path@1.1.2",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.3.2",
      "aurelia-templating": "npm:aurelia-templating@1.10.1"
    },
    "npm:aurelia-history-browser@1.3.0": {
      "aurelia-history": "npm:aurelia-history@1.2.0",
      "aurelia-pal": "npm:aurelia-pal@1.8.1"
    },
    "npm:aurelia-loader-default@1.2.0": {
      "aurelia-loader": "npm:aurelia-loader@1.0.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.5",
      "aurelia-pal": "npm:aurelia-pal@1.8.1"
    },
    "npm:aurelia-loader@1.0.1": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.5",
      "aurelia-path": "npm:aurelia-path@1.1.2"
    },
    "npm:aurelia-logging-console@1.1.0": {
      "aurelia-logging": "npm:aurelia-logging@1.5.1"
    },
    "npm:aurelia-metadata@1.0.5": {
      "aurelia-pal": "npm:aurelia-pal@1.8.1"
    },
    "npm:aurelia-pal-browser@1.8.1": {
      "aurelia-pal": "npm:aurelia-pal@1.8.1"
    },
    "npm:aurelia-polyfills@1.3.0": {
      "aurelia-pal": "npm:aurelia-pal@1.8.1"
    },
    "npm:aurelia-route-recognizer@1.3.1": {
      "aurelia-path": "npm:aurelia-path@1.1.2"
    },
    "npm:aurelia-router@1.6.3": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.2",
      "aurelia-history": "npm:aurelia-history@1.2.0",
      "aurelia-logging": "npm:aurelia-logging@1.5.1",
      "aurelia-path": "npm:aurelia-path@1.1.2",
      "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.3.1"
    },
    "npm:aurelia-task-queue@1.3.2": {
      "aurelia-pal": "npm:aurelia-pal@1.8.1"
    },
    "npm:aurelia-templating-binding@1.5.2": {
      "aurelia-binding": "npm:aurelia-binding@2.2.0",
      "aurelia-logging": "npm:aurelia-logging@1.5.1",
      "aurelia-templating": "npm:aurelia-templating@1.10.1"
    },
    "npm:aurelia-templating-resources@1.7.2": {
      "aurelia-binding": "npm:aurelia-binding@2.2.0",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-loader": "npm:aurelia-loader@1.0.1",
      "aurelia-logging": "npm:aurelia-logging@1.5.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.5",
      "aurelia-pal": "npm:aurelia-pal@1.8.1",
      "aurelia-path": "npm:aurelia-path@1.1.2",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.3.2",
      "aurelia-templating": "npm:aurelia-templating@1.10.1"
    },
    "npm:aurelia-templating-router@1.3.3": {
      "aurelia-binding": "npm:aurelia-binding@2.2.0",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-logging": "npm:aurelia-logging@1.5.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.5",
      "aurelia-pal": "npm:aurelia-pal@1.8.1",
      "aurelia-path": "npm:aurelia-path@1.1.2",
      "aurelia-router": "npm:aurelia-router@1.6.3",
      "aurelia-templating": "npm:aurelia-templating@1.10.1"
    },
    "npm:aurelia-templating@1.10.1": {
      "aurelia-binding": "npm:aurelia-binding@2.2.0",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-loader": "npm:aurelia-loader@1.0.1",
      "aurelia-logging": "npm:aurelia-logging@1.5.1",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.5",
      "aurelia-pal": "npm:aurelia-pal@1.8.1",
      "aurelia-path": "npm:aurelia-path@1.1.2",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.3.2"
    },
    "npm:aurelia-testing@0.5.0": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.4.2",
      "aurelia-framework": "npm:aurelia-framework@1.3.1",
      "aurelia-logging": "npm:aurelia-logging@1.5.1",
      "aurelia-pal": "npm:aurelia-pal@1.8.1",
      "aurelia-templating": "npm:aurelia-templating@1.10.1"
    },
    "npm:babel-code-frame@6.26.0": {
      "chalk": "npm:chalk@1.1.3",
      "esutils": "npm:esutils@2.0.2",
      "js-tokens": "npm:js-tokens@3.0.2"
    },
    "npm:babel-core@6.26.3": {
      "babel-code-frame": "npm:babel-code-frame@6.26.0",
      "babel-generator": "npm:babel-generator@6.26.1",
      "babel-helpers": "npm:babel-helpers@6.24.1",
      "babel-messages": "npm:babel-messages@6.23.0",
      "babel-register": "npm:babel-register@6.26.0",
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "babel-template": "npm:babel-template@6.26.0",
      "babel-traverse": "npm:babel-traverse@6.26.0",
      "babel-types": "npm:babel-types@6.26.0",
      "babylon": "npm:babylon@6.18.0",
      "convert-source-map": "npm:convert-source-map@1.6.0",
      "debug": "npm:debug@2.6.9",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "json5": "npm:json5@0.5.1",
      "lodash": "npm:lodash@4.17.11",
      "minimatch": "npm:minimatch@3.0.4",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "path-is-absolute": "npm:path-is-absolute@1.0.1",
      "private": "npm:private@0.1.8",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "slash": "npm:slash@1.0.0",
      "source-map": "npm:source-map@0.5.7",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:babel-generator@6.26.1": {
      "babel-messages": "npm:babel-messages@6.23.0",
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "babel-types": "npm:babel-types@6.26.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "detect-indent": "npm:detect-indent@4.0.0",
      "jsesc": "npm:jsesc@1.3.0",
      "lodash": "npm:lodash@4.17.11",
      "source-map": "npm:source-map@0.5.7",
      "trim-right": "npm:trim-right@1.0.1"
    },
    "npm:babel-helpers@6.24.1": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "babel-template": "npm:babel-template@6.26.0"
    },
    "npm:babel-messages@6.23.0": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:babel-register@6.26.0": {
      "babel-core": "npm:babel-core@6.26.3",
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "core-js": "npm:core-js@2.6.2",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "home-or-tmp": "npm:home-or-tmp@2.0.0",
      "lodash": "npm:lodash@4.17.11",
      "mkdirp": "npm:mkdirp@0.5.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "source-map-support": "npm:source-map-support@0.4.18"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:babel-runtime@6.26.0": {
      "core-js": "npm:core-js@2.6.2",
      "regenerator-runtime": "npm:regenerator-runtime@0.11.1"
    },
    "npm:babel-template@6.26.0": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "babel-traverse": "npm:babel-traverse@6.26.0",
      "babel-types": "npm:babel-types@6.26.0",
      "babylon": "npm:babylon@6.18.0",
      "lodash": "npm:lodash@4.17.11"
    },
    "npm:babel-traverse@6.26.0": {
      "babel-code-frame": "npm:babel-code-frame@6.26.0",
      "babel-messages": "npm:babel-messages@6.23.0",
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "babel-types": "npm:babel-types@6.26.0",
      "babylon": "npm:babylon@6.18.0",
      "debug": "npm:debug@2.6.9",
      "globals": "npm:globals@9.18.0",
      "invariant": "npm:invariant@2.2.4",
      "lodash": "npm:lodash@4.17.11",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:babel-types@6.26.0": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "esutils": "npm:esutils@2.0.2",
      "lodash": "npm:lodash@4.17.11",
      "to-fast-properties": "npm:to-fast-properties@1.0.3"
    },
    "npm:babylon@6.18.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:brace-expansion@1.1.11": {
      "balanced-match": "npm:balanced-match@1.0.0",
      "concat-map": "npm:concat-map@0.0.1"
    },
    "npm:buffer@5.2.1": {
      "base64-js": "npm:base64-js@1.3.0",
      "ieee754": "npm:ieee754@1.1.12"
    },
    "npm:chalk@1.1.3": {
      "ansi-styles": "npm:ansi-styles@2.2.1",
      "escape-string-regexp": "npm:escape-string-regexp@1.0.5",
      "has-ansi": "npm:has-ansi@2.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "strip-ansi": "npm:strip-ansi@3.0.1",
      "supports-color": "npm:supports-color@2.0.0"
    },
    "npm:convert-source-map@1.6.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "safe-buffer": "npm:safe-buffer@5.1.2"
    },
    "npm:core-js@2.6.2": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:debug@2.6.9": {
      "ms": "npm:ms@2.0.0"
    },
    "npm:detect-indent@4.0.0": {
      "repeating": "npm:repeating@2.0.1"
    },
    "npm:globals@9.18.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:has-ansi@2.0.0": {
      "ansi-regex": "npm:ansi-regex@2.1.1"
    },
    "npm:home-or-tmp@2.0.0": {
      "os-homedir": "npm:os-homedir@1.0.2",
      "os-tmpdir": "npm:os-tmpdir@1.0.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:invariant@2.2.4": {
      "loose-envify": "npm:loose-envify@1.4.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:is-finite@1.0.2": {
      "number-is-nan": "npm:number-is-nan@1.0.1"
    },
    "npm:json5@0.5.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:loose-envify@1.4.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "js-tokens": "npm:js-tokens@4.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:minimatch@3.0.4": {
      "brace-expansion": "npm:brace-expansion@1.1.11",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:mkdirp@0.5.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "minimist": "npm:minimist@0.0.8",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:os-homedir@1.0.2": {
      "os": "github:jspm/nodelibs-os@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:os-tmpdir@1.0.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-is-absolute@1.0.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.10": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:readable-stream@1.1.14": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:regenerator-runtime@0.11.1": {
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:repeating@2.0.1": {
      "is-finite": "npm:is-finite@1.0.2"
    },
    "npm:safe-buffer@5.1.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:source-map-support@0.4.18": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "source-map": "npm:source-map@0.5.7"
    },
    "npm:source-map@0.5.7": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.14"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:strip-ansi@3.0.1": {
      "ansi-regex": "npm:ansi-regex@2.1.1"
    },
    "npm:supports-color@2.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    }
  }
});
