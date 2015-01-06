"use strict";

var Compose = require("./compose").Compose;
var If = require("./if").If;
var Repeat = require("./repeat").Repeat;
var Show = require("./show").Show;
var SelectedItem = require("./selected-item").SelectedItem;


function install(aurelia) {
  aurelia.withResources([Show, If, Repeat, Compose, SelectedItem]);
}

exports.Compose = Compose;
exports.If = If;
exports.Repeat = Repeat;
exports.Show = Show;
exports.SelectedItem = SelectedItem;
exports.install = install;