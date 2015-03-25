define(["exports", "./compose", "./if", "./with", "./repeat", "./show", "./global-behavior", "./sanitize-html"], function (exports, _compose, _if, _with, _repeat, _show, _globalBehavior, _sanitizeHtml) {
  "use strict";

  var Compose = _compose.Compose;
  var If = _if.If;
  var With = _with.With;
  var Repeat = _repeat.Repeat;
  var Show = _show.Show;
  var GlobalBehavior = _globalBehavior.GlobalBehavior;
  var SanitizeHtmlValueConverter = _sanitizeHtml.SanitizeHtmlValueConverter;

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
});