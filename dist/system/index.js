System.register(["./compose", "./if", "./with", "./repeat", "./show", "./selected-item", "./global-behavior", "./inner-html"], function (_export) {
  var Compose, If, With, Repeat, Show, SelectedItem, GlobalBehavior, InnerHTML;

  function install(aurelia) {
    aurelia.withResources([Show, If, With, Repeat, Compose, SelectedItem, GlobalBehavior, InnerHTML]);
  }

  return {
    setters: [function (_compose) {
      Compose = _compose.Compose;
    }, function (_if) {
      If = _if.If;
    }, function (_with) {
      With = _with.With;
    }, function (_repeat) {
      Repeat = _repeat.Repeat;
    }, function (_show) {
      Show = _show.Show;
    }, function (_selectedItem) {
      SelectedItem = _selectedItem.SelectedItem;
    }, function (_globalBehavior) {
      GlobalBehavior = _globalBehavior.GlobalBehavior;
    }, function (_innerHtml) {
      InnerHTML = _innerHtml.InnerHTML;
    }],
    execute: function () {
      "use strict";

      _export("Compose", Compose);

      _export("If", If);

      _export("With", With);

      _export("Repeat", Repeat);

      _export("Show", Show);

      _export("InnerHTML", InnerHTML);

      _export("SelectedItem", SelectedItem);

      _export("GlobalBehavior", GlobalBehavior);

      _export("install", install);
    }
  };
});