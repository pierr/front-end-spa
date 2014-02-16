/*global Backbone, Promise*/
// Backbone model with **promise** CRUD method instead of its own methods.
var PromiseModel = Backbone.Model.extend({
	//Ovverride the save method on the model in order to Return a promise.
	save: function saveModel() {
		var model = this;
		return new Promise(
			function(resolve, reject) {
				Backbone.Model.prototype.save(model.toJSON(), {
					success: resolve,
					error: reject
				});
			}
		);
	},
	destroy: function promiseDestroyModel() {
		var model = this;
		return new Promise(
			function(resolve, reject) {
				Backbone.sync('delete', model, {
					success: resolve,
					error: reject
				});
			}
		);
	}

});

// Backbone collection with **promise** CRUD method instead of its own methods.
var PromiseCollection = Backbone.Collection.extend({
	//Override the default collection fetch method, using and returning a promise.
	//Options is the options object which is sent to the jquery method.
	fetch: function promiseFetchCollection(options) {
		options = options || {};
		var collection = this;
		return new Promise(function(resolve, reject) {
			/*Don't use underscore but could have because bacckbone has a dependency on it.*/
			options.success = resolve;
			options.error = reject;
			Backbone.sync('read', collection, options);
		});
	}
});

//Convert an existing Backbone model to a _promise_ version of it.
var ConvertModel = function ConvertBackBoneModelToPromiseModel(model) {
	if (model.url === undefined || model.urlRoot === undefined) {
		throw new Error("The model url cannot be undefined.");
	}
	var promiseModel = new PromiseModel();
	var property = model.urlRoot !== undefined ? 'urlRoot' : 'url';
	promiseModel[property] = model[property];
	return promiseModel;
};

//Convert an existing Backbone collection to a _promise_ version of it.
var ConvertCollection = function ConvertBackboneCollectionToPromiseCollection(collection) {
	if (collection.url === undefined || collection.urlRoot === null) {
		throw new Error("The collection url cannot be undefined.");
	}
	var promiseCollection = new PromiseCollection();
	promiseCollection.url = collection.url;
	return promiseCollection;
};

module.exports = {
	Model: PromiseModel,
	Collection: PromiseCollection,
	Convert: {
		Model: ConvertModel,
		Collection: ConvertCollection
	}
};