### 0.13.3 (2015-07-30)


#### Bug Fixes

* **if:** only remove when previously shown ([99125493](http://github.com/aurelia/templating-resources/commit/99125493304089e85509a2fd510e0a8380a293e2))


### 0.13.2 (2015-07-29)


#### Bug Fixes

* **repeat:** handle changes for numbers ([e3084523](http://github.com/aurelia/templating-resources/commit/e30845237531756793dcda0e5c42aa7f2f9cbfed), closes [#81](http://github.com/aurelia/templating-resources/issues/81))


### 0.13.1 (2015-07-13)


#### Bug Fixes

* **show:** enable the show attribute to work inside shadow DOM ([81918c13](http://github.com/aurelia/templating-resources/commit/81918c135379f793db0a2788910c0634c09e00d2))


## 0.13.0 (2015-07-02)


#### Bug Fixes

* **repeat:** preserve lifecycle when re-using views ([7806a81b](http://github.com/aurelia/templating-resources/commit/7806a81b326d4e50e98321d6a3fe32b766aab2f5), closes [#45](http://github.com/aurelia/templating-resources/issues/45))
* **show:** use bind hook to handle undefined values ([09f5d59f](http://github.com/aurelia/templating-resources/commit/09f5d59f622fd80b94a6c8f4fe809913222be49c))


### 0.12.1 (2015-06-09)


#### Bug Fixes

* **repeat:** remove views when bindning new items ([fb9314cf](http://github.com/aurelia/templating-resources/commit/fb9314cfa5909c42f20b8a78f4f9226145d10c86), closes [#69](http://github.com/aurelia/templating-resources/issues/69))


## 0.12.0 (2015-06-08)


#### Bug Fixes

* **if:**
  * fix passing context binding to the view factory ([ecfa3ce4](http://github.com/aurelia/templating-resources/commit/ecfa3ce4b18ed9cd9bb32178e3fa3360e58bafbe), closes [#56](http://github.com/aurelia/templating-resources/issues/56))
  * fix multiple view.bind() call ([172bdfae](http://github.com/aurelia/templating-resources/commit/172bdfaee29f224bb14d5ee8dd981ed7c4ba9b9c))
* **repeat:**
  * unbind children on property change ([96a2065c](http://github.com/aurelia/templating-resources/commit/96a2065c6a82743c86827bcb56850afb9b33d4f9))
  * handle promises returned by view-slot ([28338958](http://github.com/aurelia/templating-resources/commit/28338958ccff3d4764687ae4605068aec760410b), closes [#54](http://github.com/aurelia/templating-resources/issues/54))


#### Features

* **all:** add focus attached behavior ([ecd300ae](http://github.com/aurelia/templating-resources/commit/ecd300ae9f0922cc393cbe9e368ec9be35e1f955))
* **compose:** suppost syncChildren ([0240d5ca](http://github.com/aurelia/templating-resources/commit/0240d5cad778555312e931813b4131c112e7950f))
* **docs:** Initial YUIDocs ([745131b0](http://github.com/aurelia/templating-resources/commit/745131b0201cf3a9d9aa14d66a7a68c72b784504))
* **focus:** set two-way as default binding mode ([96ef5d43](http://github.com/aurelia/templating-resources/commit/96ef5d4333a2dbbb288576cf41ce5a0ad4df99e7))
* **replaceable:** add the replaceable attribute for use with replaceable parts ([a5a17bc6](http://github.com/aurelia/templating-resources/commit/a5a17bc67d08ff192b98459cdb217a0908d06b5e))


### 0.11.1 (2015-05-06)


#### Bug Fixes

* **compose:** address multi-prop update with compose ([160b4a00](http://github.com/aurelia/templating-resources/commit/160b4a00f25af71fc9c1be6c04e69988db132bc9))


#### Features

* **repeat:** add support for iterating numbers ([9eba93dc](http://github.com/aurelia/templating-resources/commit/9eba93dc2965d28e87315c2d9038da867bd658c4), closes [#50](http://github.com/aurelia/templating-resources/issues/50))


## 0.11.0 (2015-05-01)


#### Bug Fixes

* **GlobalBehavior:** improve handler-not-found message Fixes aurelia/binding#85 ([8decd4d6](http://github.com/aurelia/templating-resources/commit/8decd4d628fe722e027d832a653ff16499fbc40b))
* **all:** update to latest plugin api ([c3adb5e2](http://github.com/aurelia/templating-resources/commit/c3adb5e2299e8fa51568f4a31cbec47ed2dc6788))
* **repeat:**
  * add value as bindable ([8752ecab](http://github.com/aurelia/templating-resources/commit/8752ecab51a77941c5fcd8b442582f7ade1c4da3))
  * regression with recreating view" ([1b40be47](http://github.com/aurelia/templating-resources/commit/1b40be47c646749b21bbfea9a2fafcab34302e00), closes [#37](http://github.com/aurelia/templating-resources/issues/37))
  * null/undefined should not cause error ([86f4a310](http://github.com/aurelia/templating-resources/commit/86f4a3107a4a924e6620c5c7b5386e5262543b05), closes [#35](http://github.com/aurelia/templating-resources/issues/35))


## 0.10.0 (2015-04-09)


#### Bug Fixes

* **GlobalBehavior:** throw AggregateError ([e31875a4](http://github.com/aurelia/templating-resources/commit/e31875a454afd8ef5863f0b8cfc3f3b024f789eb))
* **repeat:** correctly update execution context ([e0d11cd6](http://github.com/aurelia/templating-resources/commit/e0d11cd689ce524b0f7e05f94deac191c5f4bb7c))


#### Features

* **all:**
  * update to work with latest decorators ([1c35b506](http://github.com/aurelia/templating-resources/commit/1c35b506d625474efda1c7595028c63e670dfb8b))
  * update to decorators ([3e4a3fa8](http://github.com/aurelia/templating-resources/commit/3e4a3fa8fe898151114e8de79739cbf4c170e398))


### 0.9.2 (2015-03-27)


#### Bug Fixes

* **compose:** null/undefined components should not cause error ([14d26539](http://github.com/aurelia/templating-resources/commit/14d2653986a119ac6e27c792b11c2d75bf811a0f), closes [#31](http://github.com/aurelia/templating-resources/issues/31))


### 0.9.1 (2015-03-25)


#### Bug Fixes

* **sanitize-html:** incorrect value converter name ([aec6395b](http://github.com/aurelia/templating-resources/commit/aec6395b9e7dbb01dcb2e682b4b4cb641e2ede21))


## 0.9.0 (2015-03-25)

#### Features

* **SanitizeHtmlValueConverter:** switched html sanitization to converter

#### Bug Fixes

* **all:** update plugin to use new global resource api ([09d41036](http://github.com/aurelia/templating-resources/commit/09d41036e2b26b487a51873fad90cc80334c50d5))
* **compose:** activate not called on string vm's after initial compose ([62c19215](http://github.com/aurelia/templating-resources/commit/62c19215c78c1adbc787c522cc31be5b3cf07217), closes [#15](http://github.com/aurelia/templating-resources/issues/15))
* **index:** plugin now uses new id-base api for resources ([f2cf8bf7](http://github.com/aurelia/templating-resources/commit/f2cf8bf7fdb794f40d309cb3e1f4d532a30b1d14))
* **sanitize-html:**  use explicit metadata ([8aa3a130](http://github.com/aurelia/templating-resources/commit/8aa3a1306d8dea0d11e99a611a51029442d1a791))
* **selected-item:** remove selected-item behavior ([ef130a76](http://github.com/aurelia/templating-resources/commit/ef130a76fade7bcb2244bbb94a95d60326d1eee1))


### 0.8.10 (2015-02-28)


#### Bug Fixes

* **package:** change jspm directories ([b6d0e5c8](http://github.com/aurelia/templating-resources/commit/b6d0e5c8ce5a4de84e1779c18df3ae9fc6f4f99e))


### 0.8.9 (2015-02-28)


#### Bug Fixes

* **package:** update dependencies ([3775b621](http://github.com/aurelia/templating-resources/commit/3775b6218f3d37fffbb032c3490f5a41c78b8891))


### 0.8.8 (2015-02-19)


#### Bug Fixes

* **all:** add logging dependency ([3ca23734](http://github.com/aurelia/templating-resources/commit/3ca23734cbb652c2e4ed3e459bcd059f0cd6818e))
* **build:** add missing bower bump ([d7b588de](http://github.com/aurelia/templating-resources/commit/d7b588de7280799b89cbe93f56da9388567d934f))
* **repeat:**
  * regression with missing items changed handler ([1b17a858](http://github.com/aurelia/templating-resources/commit/1b17a858c7ff1084aa76120e1c43cdb91518b603))
  * provide index not key to updateExecutionContext ([3f026d70](http://github.com/aurelia/templating-resources/commit/3f026d70350dc872ac74a1c206313738b1d6e927))


#### Features

* **repeat:** implement support for map ([15f8b0aa](http://github.com/aurelia/templating-resources/commit/15f8b0aa9554171dba01bae323f8cbde84784aaa))
* **templating-resources:**
  * add defaultSanitizer method to inner-html ([9353b477](http://github.com/aurelia/templating-resources/commit/9353b477769cae4cd2a342f5bdb9c455a7d4bbca))
  * add innerHTML attached behavior ([f6e28fe1](http://github.com/aurelia/templating-resources/commit/f6e28fe1e7e37b4f4b60ec066dddaff18dc6912b))
* **with:** Add WIP with binding ([b8de3ec4](http://github.com/aurelia/templating-resources/commit/b8de3ec44c3b29bd9b4c8cf5d42178bbd560fdc9))


### 0.8.7 (2015-02-06)


#### Bug Fixes

* **repeat:** error when items are undefined ([11809714](http://github.com/aurelia/templating-resources/commit/118097145e3d7a936280f9110c44b6724ed51ba2))


### 0.8.6 (2015-02-06)


#### Bug Fixes

* **compose:** all properties not responding to changes ([8c7cf24c](http://github.com/aurelia/templating-resources/commit/8c7cf24c94d8b35f8e6c2847ed427f840adff225), closes [#10](http://github.com/aurelia/templating-resources/issues/10))


### 0.8.5 (2015-02-03)


#### Bug Fixes

* **global-behavior:** unsafe method invocation ([6e05bb98](http://github.com/aurelia/templating-resources/commit/6e05bb9882e4372a96d58e3e384c0bc0c56040ab))
* **show:**
  * css not inside ([d98e9a40](http://github.com/aurelia/templating-resources/commit/d98e9a40c51f75e229fa5e3caa5388301333feb7))
  * Make sure this hide overrides everything ([e7a06176](http://github.com/aurelia/templating-resources/commit/e7a06176ed24795621414a1782b33da2174bef31))


### 0.8.4 (2015-01-29)


#### Bug Fixes

* **show:**
  * Add type to the node as well ([f29153b0](http://github.com/aurelia/templating-resources/commit/f29153b0657ecb0fa74fa71958d24209f020112a))
  * append aurelia-hide style to head ([0258d0df](http://github.com/aurelia/templating-resources/commit/0258d0df2cc99bfbc2b395c0146a350eec4c9ad4))


### 0.8.3 (2015-01-24)


#### Bug Fixes

* **package:** update deps and fix bower semver ranges ([5839f551](http://github.com/aurelia/templating-resources/commit/5839f551b7e95dad8e5f087208e87674ac3bfd1c))


#### Features

* **global-behavior:**
  * improve handler flexibility ([500633f8](http://github.com/aurelia/templating-resources/commit/500633f805e9bd02e6b5897851f64b69f25855c0))
  * flexible handlers with jQuery built-in ([298c1aeb](http://github.com/aurelia/templating-resources/commit/298c1aeb2eedf2d28e21d350435eadc5acb32d68))


### 0.8.2 (2015-01-24)


#### Bug Fixes

* **package:** update deps and fix bower semver ranges ([5839f551](http://github.com/aurelia/templating-resources/commit/5839f551b7e95dad8e5f087208e87674ac3bfd1c))


#### Features

* **global-behavior:** flexible handlers with jQuery built-in ([298c1aeb](http://github.com/aurelia/templating-resources/commit/298c1aeb2eedf2d28e21d350435eadc5acb32d68))


### 0.8.1 (2015-01-22)


#### Bug Fixes

* **compose:** incorrect property name ([57c40a00](http://github.com/aurelia/templating-resources/commit/57c40a001b2da551cae1e22777655606a0772d01))


## 0.8.0 (2015-01-22)


#### Bug Fixes

* **all:** update to latest metadata api ([62d40dbe](http://github.com/aurelia/templating-resources/commit/62d40dbe8cfda472ffa87bbe08b57b503711a113))
* **global-behavior:** enforce whitelist and support standard widget destroy pattern ([c1e0ddb3](http://github.com/aurelia/templating-resources/commit/c1e0ddb3c15ee42d03388b245e330ecf5e09b987))
* **package:** update dependencies ([3f77813b](http://github.com/aurelia/templating-resources/commit/3f77813b7cafcc8ae81c43456dbf43bd64f943fc))
* **show:** switch over to using a class instead of style manipulation ([f63e023d](http://github.com/aurelia/templating-resources/commit/f63e023d022fbf32a57c2fbce388f72149e3662c))


#### Features

* **all:** update to use new fluent metadata ([90af3e51](http://github.com/aurelia/templating-resources/commit/90af3e51ffb49e5adf74240c282a8f44f77603e5))
* **global-behavior:** enable automatic jQuery plugin support ([4633b7d0](http://github.com/aurelia/templating-resources/commit/4633b7d07bbc9b2814d2d50339a5f7a69b02c363))
* **selected-item:** use default two-way binding now ([f0316e3f](http://github.com/aurelia/templating-resources/commit/f0316e3fb269d3c8bf340afce53697f7a94b1922))


## 0.7.0 (2015-01-12)


#### Bug Fixes

* **package:** update Aurelia dependencies ([f121fbb1](http://github.com/aurelia/templating-resources/commit/f121fbb1b4149bb84878396d3eb6ea804eec1e47))


## 0.6.0 (2015-01-07)


#### Bug Fixes

* **package:** update dependencies to latest ([dac311ac](http://github.com/aurelia/templating-resources/commit/dac311acf54154a7f1022dabce3908008515b06f))


## 0.5.0 (2015-01-06)


#### Bug Fixes

* **compose:**
  * use templating's new built-in composition engine ([9f50076d](http://github.com/aurelia/templating-resources/commit/9f50076dad42e399b4e19b74fdd4e3d3d49ec0e4))
  * align with new view model load api ([a7c65fd6](http://github.com/aurelia/templating-resources/commit/a7c65fd6dab7b80a55e9c9e2e2c5e560b265868d))


#### Features

* **build:** update compile, switch to register modules, switch to core-js ([a7fe36c9](http://github.com/aurelia/templating-resources/commit/a7fe36c9a63055a3a7fbaa674b162307c3604a9b))
* **resources:** enable plugin model ([c78cae82](http://github.com/aurelia/templating-resources/commit/c78cae82ba38cb2f2a464394613f780b314925e5))


## 0.4.0 (2014-12-22)


#### Bug Fixes

* **package:** update templating dependency to latest version ([156def6a](http://github.com/aurelia/templating-resources/commit/156def6adb4384a10a3972bd6f46e0cedb49ed40))


#### Features

* **compose:** getViewStrategy hook added ([db7e0322](http://github.com/aurelia/templating-resources/commit/db7e0322018c4b8d2115822b214e7e64af26db78))


### 0.3.2 (2014-12-18)


#### Bug Fixes

* **package:** update templating to latest version ([c754589a](http://github.com/aurelia/templating-resources/commit/c754589a1972dc7346b41e3a2558b7d574d8ad28))


#### Features

* **compose:** view and view-model are now relative ([0b54a750](http://github.com/aurelia/templating-resources/commit/0b54a750c21211f2071723d08e767bc035dfb745))


### 0.3.1 (2014-12-18)


#### Bug Fixes

* **package:** update templating to latest version ([f0d148cb](http://github.com/aurelia/templating-resources/commit/f0d148cb3d4202bd63715b9146799c52f2ce23ec))


## 0.3.0 (2014-12-17)


#### Bug Fixes

* **package:** updating dependencies to latest versions ([033a97fd](http://github.com/aurelia/templating-resources/commit/033a97fd5f9237804f39a37670672f9b5f8c1daa))


### 0.2.1 (2014-12-12)


#### Bug Fixes

* **package:** update dependencies to latest versions ([c900f714](http://github.com/aurelia/templating-resources/commit/c900f7148cda37c87909e491f245fa12987d90bb))


## 0.2.0 (2014-12-11)


#### Bug Fixes

* **package:** updating dependencies to their latest versions ([173392f5](http://github.com/aurelia/templating-resources/commit/173392f599a0cc8623da69ff23b041be4c03315f))


## 0.1.0 (2014-12-11)


#### Bug Fixes

* **package:** add missing polyfill ([c3fe9aa4](http://github.com/aurelia/templating-resources/commit/c3fe9aa4ea00e517ceb8107dbe8ff3c3f577c44f))
