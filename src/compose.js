import {Container} from 'aurelia-dependency-injection';
import {
  CustomElement,
  ResourceCoordinator,
  Property,
  ViewSlot,
  NoView,
  UseView,
  ViewStrategy,
  ViewEngine,
  ViewResources
} from 'aurelia-templating';

export class Compose {
  static annotations() {
    return [
      new CustomElement('compose'),
      new Property('model'),
      new Property('view'),
      new Property('viewModel'),
      new NoView()
      ];
  }

  static inject(){ return [Container,ResourceCoordinator,ViewEngine,ViewSlot,ViewResources]; }
	constructor(container, resourceCoordinator, viewEngine, viewSlot, viewResources){
		this.container = container;
		this.resourceCoordinator = resourceCoordinator;
		this.viewEngine = viewEngine;
		this.viewSlot = viewSlot;		
    this.viewResources = viewResources;
	}

	bind(executionContext){
		this.executionContext = executionContext;
		processInstruction(this, {
			view:this.view,
			viewModel:this.viewModel,
			model:this.model
		});
	}

	modelChanged(newValue, oldValue){
		if(this.viewModel && typeof this.viewModel.activate === 'function'){
			this.viewModel.activate(newValue);
		}
  }

  viewChanged(newValue, oldValue){
  	processInstruction(this, { view:newValue });
  }

  viewModelChanged(newValue, oldValue){
  	processInstruction(this, { viewModel:newValue });
  }
}

function swap(composer, behavior){
	behavior.bind(behavior.executionContext);
	composer.viewSlot.swap(behavior.view);

	if(composer.current){
		composer.current.unbind();
	}

	composer.current = behavior;
}

function processBehavior(composer, instruction, behavior){
	if(instruction.model && typeof instruction.viewModel.activate === 'function') {
		var activated = instruction.viewModel.activate(instruction.model) || Promise.resolve();
		activated.then(() => swap(composer, behavior));
	}else{
		swap(composer, behavior);
	}
}

function processInstructionView(composer, instruction){
  if(typeof instruction.view === 'string'){
    instruction.view = new UseView(composer.viewResources.relativeToView(instruction.view));
  } 

  if(instruction.view && !(instruction.view instanceof ViewStrategy)){
    throw new Error('The view must be a string or an instance of ViewStrategy.');
  }
}

function processViewModel(composer, instruction, container){
  if('getViewStrategy' in instruction.viewModel && !instruction.view){
    instruction.view = instruction.viewModel.getViewStrategy();
    processInstructionView(composer, instruction);
  }

  CustomElement.anonymous(composer.container, instruction.viewModel, instruction.view).then(type => {
    var childContainer = container || composer.container.createChild();
    var behavior = type.create(childContainer, {executionContext:instruction.viewModel, suppressBind:true});
    processBehavior(composer, instruction, behavior);
  });
}

function processInstruction(composer, instruction){
	var result, options, childContainer;

  processInstructionView(composer, instruction);

	if(typeof instruction.viewModel === 'string'){
    instruction.viewModel = composer.viewResources.relativeToView(instruction.viewModel);
		
    composer.resourceCoordinator.loadViewModelType(instruction.viewModel).then(viewModelType => {
      childContainer = composer.container.createChild();
      instruction.viewModel = childContainer.get(viewModelType);
      processViewModel(composer, instruction, childContainer);
    });
	}else{
		if(instruction.viewModel){
      processViewModel(composer, instruction);
		} else if (instruction.view){
			instruction.view.loadViewFactory(composer.viewEngine).then(viewFactory => {
				childContainer = composer.container.createChild();
				result = viewFactory.create(childContainer, composer.executionContext);
				composer.viewSlot.swap(result);
			});
		}
	}
}