import 'aurelia-polyfills';
import 'aurelia-loader-webpack';
import {initialize} from 'aurelia-pal-browser';
import { PLATFORM } from 'aurelia-pal';

initialize();

PLATFORM.moduleName('test/resources/view-model-1');
PLATFORM.moduleName('test/resources/view-model-1.html');
