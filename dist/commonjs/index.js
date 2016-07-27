'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaTemplatingResources = require('./aurelia-templating-resources');

Object.keys(_aureliaTemplatingResources).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaTemplatingResources[key];
    }
  });
});