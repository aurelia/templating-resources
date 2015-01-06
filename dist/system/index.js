System.register(["./compose", "./if", "./repeat", "./show", "./selected-item"], function (_export) {
  "use strict";

  var Compose, If, Repeat, Show, SelectedItem;


  function install(aurelia) {
    aurelia.withResources([Show, If, Repeat, Compose, SelectedItem]);
  }

  return {
    setters: [function (_compose) {
      Compose = _compose.Compose;
    }, function (_if) {
      If = _if.If;
    }, function (_repeat) {
      Repeat = _repeat.Repeat;
    }, function (_show) {
      Show = _show.Show;
    }, function (_selectedItem) {
      SelectedItem = _selectedItem.SelectedItem;
    }],
    execute: function () {
      _export("Compose", Compose);

      _export("If", If);

      _export("Repeat", Repeat);

      _export("Show", Show);

      _export("SelectedItem", SelectedItem);

      _export("install", install);
    }
  };
});