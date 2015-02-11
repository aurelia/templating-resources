define(["exports", "./compose", "./if", "./with", "./repeat", "./show", "./selected-item", "./global-behavior"], function (exports, _compose, _if, _with, _repeat, _show, _selectedItem, _globalBehavior) {
  "use strict";

  var Compose = _compose.Compose;
  var If = _if.If;
  var With = _with.With;
  var Repeat = _repeat.Repeat;
  var Show = _show.Show;
  var SelectedItem = _selectedItem.SelectedItem;
  var GlobalBehavior = _globalBehavior.GlobalBehavior;


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
});