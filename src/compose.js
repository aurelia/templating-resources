import {Container} from 'aurelia-dependency-injection';
import {
  CustomElement,
  ResourceCoordinator,
  Property,
  ViewSlot,
  NoView,
  UseView,
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
		if(this.viewModel && this.viewModel.activate){
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
	if(instruction.model && 'activate' in instruction.viewModel) {
		var activated = instruction.viewModel.activate(instruction.model) || Promise.resolve();
		activated.then(() => swap(composer, behavior));
	}else{
		swap(composer, behavior);
	}
}

function processInstruction(composer, instruction){
	var useView, result, options, childContainer;

  if(instruction.view){
    instruction.view = composer.viewResources.relativeToView(instruction.view);
  }

	if(typeof instruction.viewModel === 'string'){
    instruction.viewModel = composer.viewResources.relativeToView(instruction.viewModel);
		composer.resourceCoordinator.loadAnonymousElement(instruction.viewModel, null, instruction.view).then(type => {
			childContainer= composer.container.createChild();
			options = {suppressBind:true};
			result = type.create(childContainer, options);
			instruction.viewModel = result.executionContext;
			processBehavior(composer, instruction, result);
		});
	}else{
		if(instruction.view) {
			useView = new UseView(instruction.view);
		}

		if(instruction.viewModel){
			CustomElement.anonymous(composer.container, instruction.viewModel, useView).then(type => {
				childContainer = composer.container.createChild();
				options = {executionContext:instruction.viewModel, suppressBind:true};
				result = type.create(childContainer, options);
				processBehavior(composer, instruction, result);
			});
		} else if (useView){
			useView.loadViewFactory(composer.viewEngine).then(viewFactory => {
				childContainer = composer.container.createChild();
				result = viewFactory.create(childContainer, composer.executionContext);
				composer.viewSlot.swap(result);
			});
		}
	}
}