import {Container,inject} from 'aurelia-dependency-injection';
import {
  CompositionEngine, ViewSlot, ViewResources,
  customElement, bindable, noView
} from 'aurelia-templating';

/**
* Used to compose a new view / view-model template or bind to an existing instance
*
* @class Compose
* @constructor
* @param {Container} container The containing container
* @param {CompositionEngine} compositionEngine The engine used when composing this view
* @param {ViewSlot} viewSlot The slot the view will be inserted in to
* @param {ViewResources} viewResources The resources available in the current viewSlot
*/
@customElement('compose')
@noView
@inject(Container, CompositionEngine, ViewSlot, ViewResources)
export class Compose {
  /**
  * Model to bind the custom element to
  *
  * @property model
  * @type {CustomElement}
  */
  @bindable model
  /**
  * View to bind the custom element to
  *
  * @property view
  * @type {HtmlElement}
  */
  @bindable view
  /**
  * View-model to bind the custom element's template to
  *
  * @property viewModel
  * @type {Class}
  */
  @bindable viewModel
	constructor(container, compositionEngine, viewSlot, viewResources){
		this.container = container;
		this.compositionEngine = compositionEngine;
		this.viewSlot = viewSlot;
    this.viewResources = viewResources;
	}

  /**
  * Used to set the executionContext
  *
  * @method bind
  * @param {ExecutionContext} executionContext The context in which the view model is executed in
  */
	bind(executionContext){
		this.executionContext = executionContext;
		processInstruction(this, { view:this.view, viewModel:this.viewModel, model:this.model });
	}

	modelChanged(newValue, oldValue){
    var vm = this.currentViewModel;

		if(vm && typeof vm.activate === 'function'){
      vm.activate(newValue);
		}
  }

  viewChanged(newValue, oldValue){
  	processInstruction(this, { view:newValue, viewModel:this.currentViewModel || this.viewModel, model:this.model });
  }

  viewModelChanged(newValue, oldValue){
  	processInstruction(this, { viewModel:newValue, view:this.view, model:this.model });
  }
}

function processInstruction(composer, instruction){
  composer.compositionEngine.compose(Object.assign(instruction, {
    executionContext:composer.executionContext,
    container:composer.container,
    viewSlot:composer.viewSlot,
    viewResources:composer.viewResources,
    currentBehavior:composer.currentBehavior
  })).then(next => {
    composer.currentBehavior = next;
    composer.currentViewModel = next ? next.executionContext : null;
  });
}
