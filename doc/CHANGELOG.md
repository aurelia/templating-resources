<a name="1.8.0"></a>
# [1.8.0](https://github.com/aurelia/templating-resources/compare/1.7.2...1.8.0) (2019-01-26)

### Features

* Add ability to turn off caching for if/else

<a name="1.7.1"></a>
## [1.7.1](https://github.com/aurelia/templating-resources/compare/1.7.0...1.7.1) (2018-07-05)


### Bug Fixes

* fix missing self binding behavior ([85827d0](https://github.com/aurelia/templating-resources/commit/85827d0))



<a name="1.7.0"></a>
# [1.7.0](https://github.com/aurelia/templating-resources/compare/1.6.1...1.7.0) (2018-07-02)

* Updated resources to use new framework configuration api.

<a name="1.6.0"></a>
# [1.6.0](https://github.com/aurelia/templating-resources/compare/1.5.4...1.6.0) (2018-03-18)


### Bug Fixes

* **analyze-view-factory:** add else to lifecycleOptionalBehaviors ([5958a65](https://github.com/aurelia/templating-resources/commit/5958a65))
* **analyze-view-factory:** add hide to lifecycleOptionalBehaviors ([cd8df6d](https://github.com/aurelia/templating-resources/commit/cd8df6d)), closes [#334](https://github.com/aurelia/templating-resources/issues/334)
* **debounce:** debounce binding call instead updatesource ([e9fb62c](https://github.com/aurelia/templating-resources/commit/e9fb62c))
* **throttle-test:** remove early return ([b80ecc3](https://github.com/aurelia/templating-resources/commit/b80ecc3))
* **UpdateTrigger:** sync with binding ([3969dc6](https://github.com/aurelia/templating-resources/commit/3969dc6))



<a name="1.5.4"></a>
## [1.5.4](https://github.com/aurelia/templating-resources/compare/1.5.3...1.5.4) (2017-10-27)


### Bug Fixes

* **if:** nested ifs don't work properly ([9548e16](https://github.com/aurelia/templating-resources/commit/9548e16)), closes [#328](https://github.com/aurelia/templating-resources/issues/328) [#327](https://github.com/aurelia/templating-resources/issues/327) [#326](https://github.com/aurelia/templating-resources/issues/326) [#322](https://github.com/aurelia/templating-resources/issues/322) [#317](https://github.com/aurelia/templating-resources/issues/317) [#315](https://github.com/aurelia/templating-resources/issues/315)



<a name="1.5.3"></a>
## [1.5.3](https://github.com/aurelia/templating-resources/compare/1.5.2...1.5.3) (2017-10-24)


### Bug Fixes

* **if-else:** Fixed missing binding context when rendering else block ([e55fdf9](https://github.com/aurelia/templating-resources/commit/e55fdf9))
* **if-else:** Fixed typo and removed obsolete error ([18a4e7e](https://github.com/aurelia/templating-resources/commit/18a4e7e))
* **if-else:** Removed fit in tests ([39fb831](https://github.com/aurelia/templating-resources/commit/39fb831))
* **if-else:** Simplified initial condition check ([2103aca](https://github.com/aurelia/templating-resources/commit/2103aca))



<a name="1.5.2"></a>
## [1.5.2](https://github.com/aurelia/templating-resources/compare/1.5.1...1.5.2) (2017-10-23)


### Bug Fixes

* **if-core.js:** child view re-binding issue ([82cb331](https://github.com/aurelia/templating-resources/commit/82cb331))
* **if-core.js:** child view re-binding issue ([1c107ac](https://github.com/aurelia/templating-resources/commit/1c107ac))



<a name="1.5.1"></a>
## [1.5.1](https://github.com/aurelia/templating-resources/compare/1.5.0...1.5.1) (2017-10-02)


### Bug Fixes

* **if:** resolve if.html error ([63e8d47](https://github.com/aurelia/templating-resources/commit/63e8d47))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/aurelia/templating-resources/compare/1.4.0...1.5.0) (2017-10-02)


### Bug Fixes

* **build:** build is not compatible with Node 8 ([a5cbd4d](https://github.com/aurelia/templating-resources/commit/a5cbd4d))
* **compose:** await composition/activation ([685344e](https://github.com/aurelia/templating-resources/commit/685344e)), closes [#299](https://github.com/aurelia/templating-resources/issues/299) [#240](https://github.com/aurelia/templating-resources/issues/240)
* **css-resource:** ensure only global styles get injected globally ([5513a36](https://github.com/aurelia/templating-resources/commit/5513a36)), closes [#304](https://github.com/aurelia/templating-resources/issues/304)
* **repeat:** bug when "if.bind", "repeat.for" and animations are used in ([251a319](https://github.com/aurelia/templating-resources/commit/251a319))
* **set-repeat-strategy:** fix negative index error with empty set ([5d6a464](https://github.com/aurelia/templating-resources/commit/5d6a464)), closes [#284](https://github.com/aurelia/templating-resources/issues/284)
* **test:** failing tests after IfCustomAttribute refactoring ([c3c0990](https://github.com/aurelia/templating-resources/commit/c3c0990)), closes [#307](https://github.com/aurelia/templating-resources/issues/307)


### Features

* **templating:** else custom attribute ([8b0131a](https://github.com/aurelia/templating-resources/commit/8b0131a))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/aurelia/templating-resources/compare/1.3.1...v1.4.0) (2017-04-05)


### Features

* **templating:** support popular CSS transpiler file extensions in the require element  ([901cfd8](https://github.com/aurelia/templating-resources/commit/901cfd8))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/aurelia/templating-resources/compare/1.2.0...v1.3.0) (2017-02-26)


### Features

* **SelfBindingBehavior:** add SelfBindingBehavior ([6dee0cb](https://github.com/aurelia/templating-resources/commit/6dee0cb))
* **swapOrder:** add swaporder property for concurrent enter/leave transitions ([68b52e5](https://github.com/aurelia/templating-resources/commit/68b52e5))
* Updated dependencies



<a name="1.2.0"></a>
# [1.2.0](https://github.com/aurelia/templating-resources/compare/1.1.1...v1.2.0) (2016-12-10)



<a name="1.1.1"></a>
## [1.1.1](https://github.com/aurelia/templating-resources/compare/1.1.0...v1.1.1) (2016-10-06)


### Bug Fixes

* **package:** add attr-binding-behavior to the list of resources ([f059b8b](https://github.com/aurelia/templating-resources/commit/f059b8b))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/aurelia/templating-resources/compare/1.0.0...v1.1.0) (2016-10-05)


### Features

* **AttrBindingBehavior:** add behavior to target HTML attributes ([7a9caa1](https://github.com/aurelia/templating-resources/commit/7a9caa1)), closes [aurelia/templating-binding#94](https://github.com/aurelia/templating-binding/issues/94)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/aurelia/templating-resources/compare/1.0.0-rc.1.0.2...v1.0.0) (2016-07-27)



<a name="1.0.0-rc.1.0.2"></a>
# [1.0.0-rc.1.0.2](https://github.com/aurelia/templating-resources/compare/1.0.0-rc.1.0.1...v1.0.0-rc.1.0.2) (2016-07-25)


### Features

* **css-resource:** enable styles for no view components ([b2876a3](https://github.com/aurelia/templating-resources/commit/b2876a3))



<a name="1.0.0-rc.1.0.1"></a>
# [1.0.0-rc.1.0.1](https://github.com/aurelia/templating-resources/compare/1.0.0-rc.1.0.0...v1.0.0-rc.1.0.1) (2016-07-12)


### Bug Fixes

* **ArrayRepeatStrategy:** standard mutation processing ([34111cd](https://github.com/aurelia/templating-resources/commit/34111cd)), closes [aurelia/framework#408](https://github.com/aurelia/framework/issues/408) [aurelia/templating#349](https://github.com/aurelia/templating/issues/349)


### Performance Improvements

* **repeat:** provide skipAnimation hint to ViewSlot ([48dbc02](https://github.com/aurelia/templating-resources/commit/48dbc02))



<a name="1.0.0-rc.1.0.0"></a>
# [1.0.0-rc.1.0.0](https://github.com/aurelia/templating-resources/compare/1.0.0-beta.3.0.4...v1.0.0-rc.1.0.0) (2016-06-22)



### 1.0.0-beta.2.0.0 (2016-05-31)


#### Bug Fixes

* **replaceable:** removed replaceable ([6ac5731e](http://github.com/aurelia/templating-resources/commit/6ac5731e77099fb35606f1611d5e36073a64ee21))
* **spies:** move compile-spy and view-spy ([72c4433f](http://github.com/aurelia/templating-resources/commit/72c4433f08b4c2bdbdb06e11a69856b719cadab8))


#### Breaking Changes

* This commit removes the replaceable custom attribute.
Now that Shadow DOM v1 Slots are implemented there is no more need for
this. Replaceable parts for template controllers are still supported
for if, repeat, etc. via the part attribute.

 ([6ac5731e](http://github.com/aurelia/templating-resources/commit/6ac5731e77099fb35606f1611d5e36073a64ee21))
* The compile-spy and view-spy custom attributes have
been removed from this library. They are now part of the
aurelia-testing library.

 ([72c4433f](http://github.com/aurelia/templating-resources/commit/72c4433f08b4c2bdbdb06e11a69856b719cadab8))


### 1.0.0-beta.1.2.6 (2016-05-12)


### 1.0.0-beta.1.2.5 (2016-05-10)


### 1.0.0-beta.1.2.4 (2016-05-05)


#### Bug Fixes

* **analyze-view-factory:** prevent infinite recursion ([e9797aa1](http://github.com/aurelia/templating-resources/commit/e9797aa1eca167b9aba535f692e57f84c1b6de85), closes [#219](http://github.com/aurelia/templating-resources/issues/219))


### 1.0.0-beta.1.2.3 (2016-05-03)


#### Bug Fixes

* **Repeat:** ignore changes after unsubscribe ([96b721f9](http://github.com/aurelia/templating-resources/commit/96b721f9a2ea9662aa514481dd75271f5b4be413))
* **analyze-view-factory:** analyze type's view-factory ([3cc65d97](http://github.com/aurelia/templating-resources/commit/3cc65d974cbfc0c7930fd7766f0d4b828de70965))
* **focus:** focus on attach ([3991d999](http://github.com/aurelia/templating-resources/commit/3991d99902394bb9f692a83c857727115a6477df), closes [#199](http://github.com/aurelia/templating-resources/issues/199))
* **repeat-utilities:** remove unnecessary variable and loop evaluation ([504c8e69](http://github.com/aurelia/templating-resources/commit/504c8e6936b034bfdc3556c15817e0c8e8056bf0))


### 1.0.0-beta.1.2.2 (2016-04-13)

* fix(index): export repeat strategies

### 1.0.0-beta.1.2.1 (2016-03-29)


#### Bug Fixes

* **exports:** export RepeatStrategyLocator ([1c3c4189](http://github.com/aurelia/templating-resources/commit/1c3c4189eb983c4430d31a41e68f664116de1361))
* **html-resource-plugin:** handle query string and mixed casing ([86afdd8c](http://github.com/aurelia/templating-resources/commit/86afdd8c76192b0adcfb670482ff9ee8f40d7a03), closes [#203](http://github.com/aurelia/templating-resources/issues/203))
* **index:** add missing import to re-export ([1f9d44b3](http://github.com/aurelia/templating-resources/commit/1f9d44b3dc1d40e536ad414ec11be1811fafa565))


### 1.0.0-beta.1.2.0 (2016-03-22)


#### Bug Fixes

* **all:** replace removed file and fix lint errors ([6de4d2e6](http://github.com/aurelia/templating-resources/commit/6de4d2e6204126195499f12df20d5ba40d672fb3))
* **css:** throw on missing CSS file ([e6a2d45e](http://github.com/aurelia/templating-resources/commit/e6a2d45e53dd81c78db093d7431070dbcecd3c27), closes [#189](http://github.com/aurelia/templating-resources/issues/189))
* **if:** queue up changes when animating ([ae57e50d](http://github.com/aurelia/templating-resources/commit/ae57e50d56fde48cca0ab01fd2791edab6efd0ec))
* **repeat:** throw on non-repeatable expressions ([1d7bbccc](http://github.com/aurelia/templating-resources/commit/1d7bbcccf350d4420c996d4fa0521f9bff11a55e))


#### Features

* **abstract-repeater:** add abstract repeater base class ([949d0091](http://github.com/aurelia/templating-resources/commit/949d009164f7f42b365dae5ddf2bedafee8119af))


### 1.0.0-beta.1.1.3 (2016-03-03)


#### Bug Fixes

* **array-repeat-strategy:** prevent array being manipulated during animation ([6445cfb0](http://github.com/aurelia/templating-resources/commit/6445cfb09c4d6d2856a411d2af36431ab47a1ff2), closes [#183](http://github.com/aurelia/templating-resources/issues/183))


### 1.0.0-beta.1.1.2 (2016-03-01)


#### Bug Fixes

* **all:** remove core-js dependency ([54e09743](http://github.com/aurelia/templating-resources/commit/54e09743ab42bd98fab6d9714c169456cf681430))
* **bower:** remove core-js ([3cf2c8d9](http://github.com/aurelia/templating-resources/commit/3cf2c8d99f09c5f0ab70be8af45562157ce63e0e))
* **hide:** export hide ([e48cec4e](http://github.com/aurelia/templating-resources/commit/e48cec4e3f4f8f2f6277900f023bc019b81169c4), closes [#192](http://github.com/aurelia/templating-resources/issues/192))
* **repeat:** ensure one-time interpolation bindings update ([a280d27f](http://github.com/aurelia/templating-resources/commit/a280d27fa9eef6fbd980928ff462cdd9fbeccdab))


#### Features

* **all:** update jspm meta; core-js; aurelia deps ([f3f0ffac](http://github.com/aurelia/templating-resources/commit/f3f0ffac37121803f30306c19b23e940e2edc549))
* **signal:** allow multiple names ([620614ed](http://github.com/aurelia/templating-resources/commit/620614ed3901388039c9c66e00f5f44404b60d93), closes [#170](http://github.com/aurelia/templating-resources/issues/170), [#172](http://github.com/aurelia/templating-resources/issues/172))


### 1.0.0-beta.1.1.1 (2016-02-08)


### 1.0.0-beta.1.1.0 (2016-01-29)


#### Features

* **all:** update jspm meta; core-js; aurelia deps ([c30927e3](http://github.com/aurelia/templating-resources/commit/c30927e3c81818daaefdc47fe418ca13611bfed9))
* **hide:** add hide binding ([38760b6b](http://github.com/aurelia/templating-resources/commit/38760b6ba00774a7e75572baef0021d8c1c45096))


### 1.0.0-beta.1.0.4 (2016-01-08)


#### Bug Fixes

* **compose:** properly handle the created callback during dynamic composition ([eddec888](http://github.com/aurelia/templating-resources/commit/eddec88849aac66247d05567b20fec9a30cb572d))
* **repeat:**
  * coalesce splices delayed due to leave animation ([a08a74af](http://github.com/aurelia/templating-resources/commit/a08a74af2b181b1b80fa8b7aa67efbe3326d5228))
  * array sync issue when inserting during leave animation ([68f78707](http://github.com/aurelia/templating-resources/commit/68f78707cb36b777934c5397722bbd1a7b4b808d))
* **tests:** describe does not expect a done parameter ([3ed2b0f5](http://github.com/aurelia/templating-resources/commit/3ed2b0f5d7558b2b5b5a6ae73cca72ac03888468))


#### Features

* **repeat:** add strategy for repeating over Set objects ([dc0432a0](http://github.com/aurelia/templating-resources/commit/dc0432a00920ee2f3b9fc44a6d0955f868d679a8))
* **signal:** enable signaling one-time bindings ([24ce6720](http://github.com/aurelia/templating-resources/commit/24ce6720b561e6d81affb29e5a86a0d758c84eda), closes [#176](http://github.com/aurelia/templating-resources/issues/176))


### 1.0.0-beta.1.0.3 (2015-12-16)


#### Bug Fixes

* **plugins:**
  * revert file extentions checking ([c67adfb2](http://github.com/aurelia/templating-resources/commit/c67adfb2549e03a2a94271f20ccced1fea0adf24))
  * remove possible duplicate file extensions ([842a13e7](http://github.com/aurelia/templating-resources/commit/842a13e7baab62f4c032f6db64cc7661fb69dbf8))


## 1.0.0-beta.1.0.2 (2015-12-03)


#### Bug Fixes

* **repeat:**
  * handle pass-through converters ([b2741c9e](http://github.com/aurelia/templating-resources/commit/b2741c9e437610991b71f769ee8f171352d4ad5e))
  * fix context in getViewIndexByKey ([7f245ce3](http://github.com/aurelia/templating-resources/commit/7f245ce3b490fa82cae20103281b665a07cf3eb2), closes [#156](http://github.com/aurelia/templating-resources/issues/156))
  * obey one-time binding behavior ([5fa32e90](http://github.com/aurelia/templating-resources/commit/5fa32e90d394107d500383efa6306b5d8df43996))
* **signal:** missing this ([078087ce](http://github.com/aurelia/templating-resources/commit/078087ce375e4feb4fd34b83d8da4198527c5aa9), closes [#157](http://github.com/aurelia/templating-resources/issues/157))


## 1.0.0-beta.1.0.1 (2015-11-16)


#### Bug Fixes

* **build:** add missing requires ([88d6ac72](http://github.com/aurelia/templating-resources/commit/88d6ac72102869881f001ecdd6f50470c0bfe147))


### 0.17.4 (2015-11-15)


#### Bug Fixes

* **collection-strategy:** IE9/10 issue when injecting to base class ([cc567168](http://github.com/aurelia/templating-resources/commit/cc5671684291377ceecc06303e5c0bb661d0c492))
* **repeat:** make bind contexts consistent with the rest of aurelia ([a35eb838](http://github.com/aurelia/templating-resources/commit/a35eb838d0fcdd82464507d1681e6cd5cb525707))


### 0.17.3 (2015-11-12)


#### Bug Fixes

* **if:** rebind view ([7d1ebdde](http://github.com/aurelia/templating-resources/commit/7d1ebddec6f823b96a751afc1820059873628e02))


### 0.17.2 (2015-11-12)


#### Bug Fixes

* **sanitize-html:** change toView to return null when untrustedMarkup is undefined ([ab684b08](http://github.com/aurelia/templating-resources/commit/ab684b08b429c71e9209f836ee2632084e3bdf17))


### 0.17.1 (2015-11-11)


#### Bug Fixes

* **compose:** preserve access to parent scope ([a551ce46](http://github.com/aurelia/templating-resources/commit/a551ce46b6ef50b7aef54266e31517c357d1ce32), closes [#145](http://github.com/aurelia/templating-resources/issues/145))
* **repeat:**
  * handle evaluate causing side-effects ([7e2a2b0b](http://github.com/aurelia/templating-resources/commit/7e2a2b0bdfce17bf38b80c12d593bcc5fb8a086c))
  * handle collection instance changes ([738ea609](http://github.com/aurelia/templating-resources/commit/738ea609494c718f58d0a43b610bb9a26ff90d92), closes [#144](http://github.com/aurelia/templating-resources/issues/144))


## 0.17.0 (2015-11-10)


#### Bug Fixes

* **all:** remove the global behavior ([00e63909](http://github.com/aurelia/templating-resources/commit/00e6390978217e0bd304bb423498607675c7a767))
* **collection-strategy-locator:** correctly check for number ([265509ec](http://github.com/aurelia/templating-resources/commit/265509ec3cf593e67ea00075ef6dc7753b053050))
* **compose:** update to latest composition engine ([90ce0d4c](http://github.com/aurelia/templating-resources/commit/90ce0d4cfd22212e5c37f689c1d0f93e655cee8f))
* **map-collection-strategy:**
  * fix animation interaction ([d97d5771](http://github.com/aurelia/templating-resources/commit/d97d5771509b9929a7b3178e32150abdd80fed34))
  * correctly locate view by index ([2a16daca](http://github.com/aurelia/templating-resources/commit/2a16daca9ec7f5a2498c6232fa886d8ea83217f7))
* **number-strategy:** update binding context after processing items ([dc50b100](http://github.com/aurelia/templating-resources/commit/dc50b1002360326bcd18fd8f028aa0fae452874a))
* **repeat:**
  * various fixes ([c5c75329](http://github.com/aurelia/templating-resources/commit/c5c75329bc6d03863034b24c99e2eff9c03f21a5))
  * overrideContext should not be assigned to bindingContext ([164c361a](http://github.com/aurelia/templating-resources/commit/164c361ade46dbb6fff4939696b70ec3066e0c98))
  * return from bind if items is undefined ([4d89c0b4](http://github.com/aurelia/templating-resources/commit/4d89c0b4af529f3c2ad96680636cabc17011d6c3))
  * remove children from the view slot on unbind ([7a2bc54f](http://github.com/aurelia/templating-resources/commit/7a2bc54f37b97bd67e59a5bb5f74a48c085071ac))
* **with:** use value as bindingContext ([1436ad45](http://github.com/aurelia/templating-resources/commit/1436ad451be73bb8bb19bac56bbe3cfb03784397))


#### Features

* **UpdateTriggerBindingBehavior:** add behavior ([3784c4f2](http://github.com/aurelia/templating-resources/commit/3784c4f2cf0e9e2f9185c9b1d6e92a74c8bf14ce), closes [#137](http://github.com/aurelia/templating-resources/issues/137))
* **all:**
  * update to use override context ([494f1f59](http://github.com/aurelia/templating-resources/commit/494f1f596df1c6c7e1f1671ee7f324589407e501))
  * update to separated create/bind view pattern ([42f3ff99](http://github.com/aurelia/templating-resources/commit/42f3ff99e0418eb4dde0f146e411d321340d7040))
* **binding-behaviors:** add throttle, debounce, signal, oneTime, oneWay and twoWay behaviors ([dac5679c](http://github.com/aurelia/templating-resources/commit/dac5679cedc72fac8bdf81dbba2122606042c378))
* **collection-strategy-locator:** add strategies ([60b8067c](http://github.com/aurelia/templating-resources/commit/60b8067cbf814d416344859225945786e0014de1), closes [#95](http://github.com/aurelia/templating-resources/issues/95))
* **repeat:** handle value converters ([7c689a03](http://github.com/aurelia/templating-resources/commit/7c689a03f5e70fd1170d12103b1d4a0cfb3b4d34))


### 0.16.1 (2015-10-15)


#### Bug Fixes

* **if:** connect missing binding context during re-bind ([bd075dfd](http://github.com/aurelia/templating-resources/commit/bd075dfdae905c854b5342f55059b9a6e3a63f2e), closes [#117](http://github.com/aurelia/templating-resources/issues/117))
* **repeat:** create full bindingContext before inserting view ([ba580622](http://github.com/aurelia/templating-resources/commit/ba580622fd7e7825b2d452886e0b74abdce9cbcc), closes [#109](http://github.com/aurelia/templating-resources/issues/109))


## 0.16.0 (2015-10-13)


#### Bug Fixes

* **GlobalBehavior:**
  * improve handler-not-found message Fixes aurelia/binding#85 ([8decd4d6](http://github.com/aurelia/templating-resources/commit/8decd4d628fe722e027d832a653ff16499fbc40b))
  * throw AggregateError ([e31875a4](http://github.com/aurelia/templating-resources/commit/e31875a454afd8ef5863f0b8cfc3f3b024f789eb))
* **all:**
  * update exectionContext to bindingContext naming ([4bbcf4c2](http://github.com/aurelia/templating-resources/commit/4bbcf4c27fa2432060f418f7cabe9c66cf831862))
  * update to latest plugin api ([c3adb5e2](http://github.com/aurelia/templating-resources/commit/c3adb5e2299e8fa51568f4a31cbec47ed2dc6788))
  * update plugin to use new global resource api ([09d41036](http://github.com/aurelia/templating-resources/commit/09d41036e2b26b487a51873fad90cc80334c50d5))
  * add logging dependency ([3ca23734](http://github.com/aurelia/templating-resources/commit/3ca23734cbb652c2e4ed3e459bcd059f0cd6818e))
  * update to latest metadata api ([62d40dbe](http://github.com/aurelia/templating-resources/commit/62d40dbe8cfda472ffa87bbe08b57b503711a113))
* **build:**
  * update linting, testing and tools ([79590133](http://github.com/aurelia/templating-resources/commit/795901338065bb976aea30161d2a252578f615c8))
  * add missing bower bump ([d7b588de](http://github.com/aurelia/templating-resources/commit/d7b588de7280799b89cbe93f56da9388567d934f))
* **compose:**
  * internal variable name consistency ([769d03b6](http://github.com/aurelia/templating-resources/commit/769d03b60a0d34172123930acbcc197a355ffc7a))
  * address multi-prop update with compose ([160b4a00](http://github.com/aurelia/templating-resources/commit/160b4a00f25af71fc9c1be6c04e69988db132bc9))
  * null/undefined components should not cause error ([14d26539](http://github.com/aurelia/templating-resources/commit/14d2653986a119ac6e27c792b11c2d75bf811a0f), closes [#31](http://github.com/aurelia/templating-resources/issues/31))
  * activate not called on string vm's after initial compose ([62c19215](http://github.com/aurelia/templating-resources/commit/62c19215c78c1adbc787c522cc31be5b3cf07217), closes [#15](http://github.com/aurelia/templating-resources/issues/15))
  * all properties not responding to changes ([8c7cf24c](http://github.com/aurelia/templating-resources/commit/8c7cf24c94d8b35f8e6c2847ed427f840adff225), closes [#10](http://github.com/aurelia/templating-resources/issues/10))
  * incorrect property name ([57c40a00](http://github.com/aurelia/templating-resources/commit/57c40a001b2da551cae1e22777655606a0772d01))
  * use templating's new built-in composition engine ([9f50076d](http://github.com/aurelia/templating-resources/commit/9f50076dad42e399b4e19b74fdd4e3d3d49ec0e4))
  * align with new view model load api ([a7c65fd6](http://github.com/aurelia/templating-resources/commit/a7c65fd6dab7b80a55e9c9e2e2c5e560b265868d))
* **css-resource:**
  * ensure that urls in css files are relative to the css file ([f73849a9](http://github.com/aurelia/templating-resources/commit/f73849a91f8921eb8911f45bddb2d955f8423652), closes [#105](http://github.com/aurelia/templating-resources/issues/105))
  * enable proper style scoping based on shadow dom support ([b31dc4dd](http://github.com/aurelia/templating-resources/commit/b31dc4dd683ef33258eaa5b60324cf31f6314022))
* **global-behavior:**
  * unsafe method invocation ([6e05bb98](http://github.com/aurelia/templating-resources/commit/6e05bb9882e4372a96d58e3e384c0bc0c56040ab))
  * enforce whitelist and support standard widget destroy pattern ([c1e0ddb3](http://github.com/aurelia/templating-resources/commit/c1e0ddb3c15ee42d03388b245e330ecf5e09b987))
* **html-santizer:** extract class ([59fe7a80](http://github.com/aurelia/templating-resources/commit/59fe7a80d8ddfe9cf50ee9170296803556bc4812))
* **if:**
  * fix animation interaction; enable view cache integration ([64fde698](http://github.com/aurelia/templating-resources/commit/64fde6981603255ed14a95a1a124d7fff28bfe4d))
  * standardize on using the $parent property to store parent execution context ([82e6d135](http://github.com/aurelia/templating-resources/commit/82e6d135f3de35cf48aceff9d4d70a979288cc4e))
  * delay call to unbind via micro task ([9b62109c](http://github.com/aurelia/templating-resources/commit/9b62109c4f69dab3c2c2b2a58a908a8196409dde), closes [#84](http://github.com/aurelia/templating-resources/issues/84))
  * only remove when previously shown ([99125493](http://github.com/aurelia/templating-resources/commit/99125493304089e85509a2fd510e0a8380a293e2))
  * fix passing context binding to the view factory ([ecfa3ce4](http://github.com/aurelia/templating-resources/commit/ecfa3ce4b18ed9cd9bb32178e3fa3360e58bafbe), closes [#56](http://github.com/aurelia/templating-resources/issues/56))
  * fix multiple view.bind() call ([172bdfae](http://github.com/aurelia/templating-resources/commit/172bdfaee29f224bb14d5ee8dd981ed7c4ba9b9c))
* **index:**
  * export name incorrect ([9893d7e9](http://github.com/aurelia/templating-resources/commit/9893d7e9b80e86d9da7e8c1d3a058d6945fbde1b))
  * update to latest configuration api ([5b87410e](http://github.com/aurelia/templating-resources/commit/5b87410eab6815a6e2f0f1aa2516839431161aa6))
  * plugin now uses new id-base api for resources ([f2cf8bf7](http://github.com/aurelia/templating-resources/commit/f2cf8bf7fdb794f40d309cb3e1f4d532a30b1d14))
* **package:**
  * change jspm directories ([b6d0e5c8](http://github.com/aurelia/templating-resources/commit/b6d0e5c8ce5a4de84e1779c18df3ae9fc6f4f99e))
  * update dependencies ([3775b621](http://github.com/aurelia/templating-resources/commit/3775b6218f3d37fffbb032c3490f5a41c78b8891))
  * update deps and fix bower semver ranges ([5839f551](http://github.com/aurelia/templating-resources/commit/5839f551b7e95dad8e5f087208e87674ac3bfd1c))
  * update dependencies ([3f77813b](http://github.com/aurelia/templating-resources/commit/3f77813b7cafcc8ae81c43456dbf43bd64f943fc))
  * update Aurelia dependencies ([f121fbb1](http://github.com/aurelia/templating-resources/commit/f121fbb1b4149bb84878396d3eb6ea804eec1e47))
  * update dependencies to latest ([dac311ac](http://github.com/aurelia/templating-resources/commit/dac311acf54154a7f1022dabce3908008515b06f))
  * update templating dependency to latest version ([156def6a](http://github.com/aurelia/templating-resources/commit/156def6adb4384a10a3972bd6f46e0cedb49ed40))
  * update templating to latest version ([c754589a](http://github.com/aurelia/templating-resources/commit/c754589a1972dc7346b41e3a2558b7d574d8ad28))
  * update templating to latest version ([f0d148cb](http://github.com/aurelia/templating-resources/commit/f0d148cb3d4202bd63715b9146799c52f2ce23ec))
  * updating dependencies to latest versions ([033a97fd](http://github.com/aurelia/templating-resources/commit/033a97fd5f9237804f39a37670672f9b5f8c1daa))
  * update dependencies to latest versions ([c900f714](http://github.com/aurelia/templating-resources/commit/c900f7148cda37c87909e491f245fa12987d90bb))
  * updating dependencies to their latest versions ([173392f5](http://github.com/aurelia/templating-resources/commit/173392f599a0cc8623da69ff23b041be4c03315f))
  * add missing polyfill ([c3fe9aa4](http://github.com/aurelia/templating-resources/commit/c3fe9aa4ea00e517ceb8107dbe8ff3c3f577c44f))
* **plugins:** fixup view engine resource plugins to match the new api ([5f422cc1](http://github.com/aurelia/templating-resources/commit/5f422cc1112c6add4d2205b671e3749e20829d07))
* **repeat:**
  * check if items are instanceof Array on re-bound ([e5c000ef](http://github.com/aurelia/templating-resources/commit/e5c000ef968864cb6d7072697e61783d26b2aa4c), closes [#108](http://github.com/aurelia/templating-resources/issues/108))
  * update binding context after animations have finished ([1904ea5e](http://github.com/aurelia/templating-resources/commit/1904ea5ee60f3a3fb19aa090643d425a18a7905e), closes [#94](http://github.com/aurelia/templating-resources/issues/94))
  * handle changes for numbers ([e3084523](http://github.com/aurelia/templating-resources/commit/e30845237531756793dcda0e5c42aa7f2f9cbfed), closes [#81](http://github.com/aurelia/templating-resources/issues/81))
  * preserve lifecycle when re-using views ([7806a81b](http://github.com/aurelia/templating-resources/commit/7806a81b326d4e50e98321d6a3fe32b766aab2f5), closes [#45](http://github.com/aurelia/templating-resources/issues/45))
  * remove views when bindning new items ([fb9314cf](http://github.com/aurelia/templating-resources/commit/fb9314cfa5909c42f20b8a78f4f9226145d10c86), closes [#69](http://github.com/aurelia/templating-resources/issues/69))
  * unbind children on property change ([96a2065c](http://github.com/aurelia/templating-resources/commit/96a2065c6a82743c86827bcb56850afb9b33d4f9))
  * handle promises returned by view-slot ([28338958](http://github.com/aurelia/templating-resources/commit/28338958ccff3d4764687ae4605068aec760410b), closes [#54](http://github.com/aurelia/templating-resources/issues/54))
  * add value as bindable ([8752ecab](http://github.com/aurelia/templating-resources/commit/8752ecab51a77941c5fcd8b442582f7ade1c4da3))
  * regression with recreating view" ([1b40be47](http://github.com/aurelia/templating-resources/commit/1b40be47c646749b21bbfea9a2fafcab34302e00), closes [#37](http://github.com/aurelia/templating-resources/issues/37))
  * null/undefined should not cause error ([86f4a310](http://github.com/aurelia/templating-resources/commit/86f4a3107a4a924e6620c5c7b5386e5262543b05), closes [#35](http://github.com/aurelia/templating-resources/issues/35))
  * correctly update execution context ([e0d11cd6](http://github.com/aurelia/templating-resources/commit/e0d11cd689ce524b0f7e05f94deac191c5f4bb7c))
  * regression with missing items changed handler ([1b17a858](http://github.com/aurelia/templating-resources/commit/1b17a858c7ff1084aa76120e1c43cdb91518b603))
  * provide index not key to updateExecutionContext ([3f026d70](http://github.com/aurelia/templating-resources/commit/3f026d70350dc872ac74a1c206313738b1d6e927))
  * error when items are undefined ([11809714](http://github.com/aurelia/templating-resources/commit/118097145e3d7a936280f9110c44b6724ed51ba2))
* **replaceable:** template replacement timing ([d45b4085](http://github.com/aurelia/templating-resources/commit/d45b4085fd5531dc737bc431273f4929a6bbed0c))
* **sanitize-html:**
  * incorrect value converter name ([aec6395b](http://github.com/aurelia/templating-resources/commit/aec6395b9e7dbb01dcb2e682b4b4cb641e2ede21))
  *  use explicit metadata ([8aa3a130](http://github.com/aurelia/templating-resources/commit/8aa3a1306d8dea0d11e99a611a51029442d1a791))
* **selected-item:** remove selected-item behavior ([ef130a76](http://github.com/aurelia/templating-resources/commit/ef130a76fade7bcb2244bbb94a95d60326d1eee1))
* **show:**
  * use animator for class manipulation ([019a2062](http://github.com/aurelia/templating-resources/commit/019a2062449ecba8b8091889c358dfc425ae5424))
  * enable the show attribute to work inside shadow DOM ([81918c13](http://github.com/aurelia/templating-resources/commit/81918c135379f793db0a2788910c0634c09e00d2))
  * use bind hook to handle undefined values ([09f5d59f](http://github.com/aurelia/templating-resources/commit/09f5d59f622fd80b94a6c8f4fe809913222be49c))
  * css not inside ([d98e9a40](http://github.com/aurelia/templating-resources/commit/d98e9a40c51f75e229fa5e3caa5388301333feb7))
  * Make sure this hide overrides everything ([e7a06176](http://github.com/aurelia/templating-resources/commit/e7a06176ed24795621414a1782b33da2174bef31))
  * Add type to the node as well ([f29153b0](http://github.com/aurelia/templating-resources/commit/f29153b0657ecb0fa74fa71958d24209f020112a))
  * append aurelia-hide style to head ([0258d0df](http://github.com/aurelia/templating-resources/commit/0258d0df2cc99bfbc2b395c0146a350eec4c9ad4))
  * switch over to using a class instead of style manipulation ([f63e023d](http://github.com/aurelia/templating-resources/commit/f63e023d022fbf32a57c2fbce388f72149e3662c))
* **spec:** update executionContext to bindingContext ([d207dd22](http://github.com/aurelia/templating-resources/commit/d207dd221fa887c57c248a084cebc6f9c6d98d23))
* **view-spy:** change behavior of value-less attr to only log created ([be5b9f61](http://github.com/aurelia/templating-resources/commit/be5b9f619513201a26e6f0a086da7195c5e0381f))


#### Features

* **all:**
  * update to latest view resource pipeline; fix linting errors ([fa6b9fde](http://github.com/aurelia/templating-resources/commit/fa6b9fde5b8ac0880073becfa1107bf101da7947))
  * integrate pal ([8a3098da](http://github.com/aurelia/templating-resources/commit/8a3098dac0d2b11cb6ff1ae8acef4cccdad9bea0))
  * auto create elements from an html file; inject css into head or shadow dom ([44693a28](http://github.com/aurelia/templating-resources/commit/44693a2816722d29dcf7da24dbc6d6e86d54a5fe))
  * add focus attached behavior ([ecd300ae](http://github.com/aurelia/templating-resources/commit/ecd300ae9f0922cc393cbe9e368ec9be35e1f955))
  * update to work with latest decorators ([1c35b506](http://github.com/aurelia/templating-resources/commit/1c35b506d625474efda1c7595028c63e670dfb8b))
  * update to decorators ([3e4a3fa8](http://github.com/aurelia/templating-resources/commit/3e4a3fa8fe898151114e8de79739cbf4c170e398))
  * update to use new fluent metadata ([90af3e51](http://github.com/aurelia/templating-resources/commit/90af3e51ffb49e5adf74240c282a8f44f77603e5))
* **build:** update compile, switch to register modules, switch to core-js ([a7fe36c9](http://github.com/aurelia/templating-resources/commit/a7fe36c9a63055a3a7fbaa674b162307c3604a9b))
* **compose:**
  * suppost syncChildren ([0240d5ca](http://github.com/aurelia/templating-resources/commit/0240d5cad778555312e931813b4131c112e7950f))
  * getViewStrategy hook added ([db7e0322](http://github.com/aurelia/templating-resources/commit/db7e0322018c4b8d2115822b214e7e64af26db78))
  * view and view-model are now relative ([0b54a750](http://github.com/aurelia/templating-resources/commit/0b54a750c21211f2071723d08e767bc035dfb745))
* **debugging:** add compile-spy and view-spy ([dc7e2732](http://github.com/aurelia/templating-resources/commit/dc7e273225f74da38449f400aa767dcfda83f447))
* **docs:**
  * generate api.json from .d.ts file ([1ad220b9](http://github.com/aurelia/templating-resources/commit/1ad220b9778998d2e91902642c59523777623022))
  * Initial YUIDocs ([745131b0](http://github.com/aurelia/templating-resources/commit/745131b0201cf3a9d9aa14d66a7a68c72b784504))
* **focus:** set two-way as default binding mode ([96ef5d43](http://github.com/aurelia/templating-resources/commit/96ef5d4333a2dbbb288576cf41ce5a0ad4df99e7))
* **global-behavior:**
  * improve handler flexibility ([500633f8](http://github.com/aurelia/templating-resources/commit/500633f805e9bd02e6b5897851f64b69f25855c0))
  * flexible handlers with jQuery built-in ([298c1aeb](http://github.com/aurelia/templating-resources/commit/298c1aeb2eedf2d28e21d350435eadc5acb32d68))
  * enable automatic jQuery plugin support ([4633b7d0](http://github.com/aurelia/templating-resources/commit/4633b7d07bbc9b2814d2d50339a5f7a69b02c363))
* **if:** use the view factory caching info ([71ec71fc](http://github.com/aurelia/templating-resources/commit/71ec71fc811348435cb552ed3fb3671f115d8b61))
* **repeat:**
  * implement view caching ([d49bcaa9](http://github.com/aurelia/templating-resources/commit/d49bcaa936ca544b75fe482aeaaacdc2852b0f88), closes [#112](http://github.com/aurelia/templating-resources/issues/112), [#110](http://github.com/aurelia/templating-resources/issues/110))
  * add support for iterating numbers ([9eba93dc](http://github.com/aurelia/templating-resources/commit/9eba93dc2965d28e87315c2d9038da867bd658c4), closes [#50](http://github.com/aurelia/templating-resources/issues/50))
  * implement support for map ([15f8b0aa](http://github.com/aurelia/templating-resources/commit/15f8b0aa9554171dba01bae323f8cbde84784aaa))
* **replaceable:** add the replaceable attribute for use with replaceable parts ([a5a17bc6](http://github.com/aurelia/templating-resources/commit/a5a17bc67d08ff192b98459cdb217a0908d06b5e))
* **resources:** enable plugin model ([c78cae82](http://github.com/aurelia/templating-resources/commit/c78cae82ba38cb2f2a464394613f780b314925e5))
* **selected-item:** use default two-way binding now ([f0316e3f](http://github.com/aurelia/templating-resources/commit/f0316e3fb269d3c8bf340afce53697f7a94b1922))
* **templating-resources:**
  * add defaultSanitizer method to inner-html ([9353b477](http://github.com/aurelia/templating-resources/commit/9353b477769cae4cd2a342f5bdb9c455a7d4bbca))
  * add innerHTML attached behavior ([f6e28fe1](http://github.com/aurelia/templating-resources/commit/f6e28fe1e7e37b4f4b60ec066dddaff18dc6912b))
* **with:** Add WIP with binding ([b8de3ec4](http://github.com/aurelia/templating-resources/commit/b8de3ec44c3b29bd9b4c8cf5d42178bbd560fdc9))


#### Breaking Changes

* To change html sanitization, you now register a custom
HTMLSanitizer in the DI container to override the default
implementation. Also, the value converter name for the sanitizer
converter has changed to sanitizeHTML. This creates a case consistency
among classes.

 ([59fe7a80](http://github.com/aurelia/templating-resources/commit/59fe7a80d8ddfe9cf50ee9170296803556bc4812))


### 0.15.2 (2015-09-07)

* Greatly improved performance of the css url fixup code.

### 0.15.1 (2015-09-06)


#### Bug Fixes

* **css-resource:** ensure that urls in css files are relative to the css file ([f73849a9](http://github.com/aurelia/templating-resources/commit/f73849a91f8921eb8911f45bddb2d955f8423652), closes [#105](http://github.com/aurelia/templating-resources/issues/105))


## 0.15.0 (2015-09-05)


#### Bug Fixes

* **all:** update exectionContext to bindingContext naming ([4bbcf4c2](http://github.com/aurelia/templating-resources/commit/4bbcf4c27fa2432060f418f7cabe9c66cf831862))
* **build:** update linting, testing and tools ([79590133](http://github.com/aurelia/templating-resources/commit/795901338065bb976aea30161d2a252578f615c8))
* **css-resource:** enable proper style scoping based on shadow dom support ([b31dc4dd](http://github.com/aurelia/templating-resources/commit/b31dc4dd683ef33258eaa5b60324cf31f6314022))
* **if:** fix animation interaction; enable view cache integration ([64fde698](http://github.com/aurelia/templating-resources/commit/64fde6981603255ed14a95a1a124d7fff28bfe4d))
* **plugins:** fixup view engine resource plugins to match the new api ([5f422cc1](http://github.com/aurelia/templating-resources/commit/5f422cc1112c6add4d2205b671e3749e20829d07))
* **repeat:** update binding context after animations have finished ([1904ea5e](http://github.com/aurelia/templating-resources/commit/1904ea5ee60f3a3fb19aa090643d425a18a7905e), closes [#94](http://github.com/aurelia/templating-resources/issues/94))
* **spec:** update executionContext to bindingContext ([d207dd22](http://github.com/aurelia/templating-resources/commit/d207dd221fa887c57c248a084cebc6f9c6d98d23))
* **view-spy:** change behavior of value-less attr to only log created ([be5b9f61](http://github.com/aurelia/templating-resources/commit/be5b9f619513201a26e6f0a086da7195c5e0381f))


#### Features

* **all:** auto create elements from an html file; inject css into head or shadow dom ([44693a28](http://github.com/aurelia/templating-resources/commit/44693a2816722d29dcf7da24dbc6d6e86d54a5fe))
* **docs:** generate api.json from .d.ts file ([1ad220b9](http://github.com/aurelia/templating-resources/commit/1ad220b9778998d2e91902642c59523777623022))
* **if:** use the view factory caching info ([71ec71fc](http://github.com/aurelia/templating-resources/commit/71ec71fc811348435cb552ed3fb3671f115d8b61))


## 0.14.0 (2015-08-14)


#### Bug Fixes

* **compose:** internal variable name consistency ([769d03b6](http://github.com/aurelia/templating-resources/commit/769d03b60a0d34172123930acbcc197a355ffc7a))
* **index:** update to latest configuration api ([5b87410e](http://github.com/aurelia/templating-resources/commit/5b87410eab6815a6e2f0f1aa2516839431161aa6))


#### Features

* **debugging:** add compile-spy and view-spy ([dc7e2732](http://github.com/aurelia/templating-resources/commit/dc7e273225f74da38449f400aa767dcfda83f447))


### 0.13.4 (2015-08-05)


#### Bug Fixes

* **if:**
  * standardize on using the $parent property to store parent execution context ([82e6d135](http://github.com/aurelia/templating-resources/commit/82e6d135f3de35cf48aceff9d4d70a979288cc4e))
  * delay call to unbind via micro task ([9b62109c](http://github.com/aurelia/templating-resources/commit/9b62109c4f69dab3c2c2b2a58a908a8196409dde), closes [#84](http://github.com/aurelia/templating-resources/issues/84))


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
