"use strict";

var Compose = require("./compose").Compose;
var If = require("./if").If;
var With = require("./with").With;
var Repeat = require("./repeat").Repeat;
var Show = require("./show").Show;
var SelectedItem = require("./selected-item").SelectedItem;
var GlobalBehavior = require("./global-behavior").GlobalBehavior;


function install(aurelia) {
  aurelia.withResources([Show, If, With, Repeat, Compose, SelectedItem, GlobalBehavior]);
}

exports.Compose = Compose;
exports.If = If;
exports.With = With;
exports.Repeat = Repeat;
exports.Show = Show;
exports.SelectedItem = SelectedItem;
exports.GlobalBehavior = GlobalBehavior;
exports.install = install;
exports.__esModule = true;
