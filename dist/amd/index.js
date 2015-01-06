define(["exports", "./compose", "./if", "./repeat", "./show", "./selected-item"], function (exports, _compose, _if, _repeat, _show, _selectedItem) {
  "use strict";

  var Compose = _compose.Compose;
  var If = _if.If;
  var Repeat = _repeat.Repeat;
  var Show = _show.Show;
  var SelectedItem = _selectedItem.SelectedItem;


  function install(aurelia) {
    aurelia.withResources([Show, If, Repeat, Compose, SelectedItem]);
  }

  exports.Compose = Compose;
  exports.If = If;
  exports.Repeat = Repeat;
  exports.Show = Show;
  exports.SelectedItem = SelectedItem;
  exports.install = install;
});