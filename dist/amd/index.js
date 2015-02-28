define(["exports", "./compose", "./if", "./with", "./repeat", "./show", "./selected-item", "./global-behavior", "./inner-html"], function (exports, _compose, _if, _with, _repeat, _show, _selectedItem, _globalBehavior, _innerHtml) {
  "use strict";

  var Compose = _compose.Compose;
  var If = _if.If;
  var With = _with.With;
  var Repeat = _repeat.Repeat;
  var Show = _show.Show;
  var SelectedItem = _selectedItem.SelectedItem;
  var GlobalBehavior = _globalBehavior.GlobalBehavior;
  var InnerHTML = _innerHtml.InnerHTML;

  function install(aurelia) {
    aurelia.withResources([Show, If, With, Repeat, Compose, SelectedItem, GlobalBehavior, InnerHTML]);
  }

  exports.Compose = Compose;
  exports.If = If;
  exports.With = With;
  exports.Repeat = Repeat;
  exports.Show = Show;
  exports.InnerHTML = InnerHTML;
  exports.SelectedItem = SelectedItem;
  exports.GlobalBehavior = GlobalBehavior;
  exports.install = install;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});