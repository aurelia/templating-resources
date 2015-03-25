"use strict";

var Compose = require("./compose").Compose;

var If = require("./if").If;

var With = require("./with").With;

var Repeat = require("./repeat").Repeat;

var Show = require("./show").Show;

var GlobalBehavior = require("./global-behavior").GlobalBehavior;

var SanitizeHtmlValueConverter = require("./sanitize-html").SanitizeHtmlValueConverter;

function install(aurelia) {
  aurelia.globalizeResources("./compose", "./if", "./with", "./repeat", "./show", "./global-behavior", "./sanitize-html");
}

exports.Compose = Compose;
exports.If = If;
exports.With = With;
exports.Repeat = Repeat;
exports.Show = Show;
exports.SanitizeHtmlValueConverter = SanitizeHtmlValueConverter;
exports.GlobalBehavior = GlobalBehavior;
exports.install = install;
Object.defineProperty(exports, "__esModule", {
  value: true
});