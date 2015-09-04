define([], function () {

	// implement inherit
	// reference : https://gist.github.com/easylogic/324bffc8145cfb43934f#file-class-extend-js
	var Class = {
		extend : function (Child, Parent) {
			Child.prototype = new Parent();
			Child.prototype.constructor = Child;
			Child.parent = Parent;

			Child.prototype._super = function (method, args) {

				if (this.constructor.prototype[method]) {
					this.constructor.prototype[method].apply(this, args || []);
				} else {
					this.constructor.parent.call(this, method, args);
				}
			};
		}
	};

	/**
	 * Sample Code : https://gist.github.com/easylogic/324bffc8145cfb43934f#file-sample-code-md
	 */

	return Class;
});

