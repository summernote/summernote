define(['jquery', 'class'], function ($, Class) {

	/** VirtualClass **/
	function VirtualClass(opt) {
		this.instance = null;
		this.opt = opt;
	}

	VirtualClass.prototype.create = function () {
	};

	VirtualClass.prototype.initialize = function () {
		this.instance = this.create();
	};

	/** VirtualEvent **/
	function VirtualEvent() {
		this._super();
		this.initialize();
	}

	VirtualEvent.prototype.initialize = function () {
		this._super('initialize');

		var self = this;

		var eventList = ['click', 'dblclick',
			'keydown', 'keypress', 'keyup',
			'mouseover', 'mousemove', 'mousedown', 'mouseup',
			'dragstart', 'drag', 'dragend', 'drop'];

		for (var i = 0, len = eventList.length; i < len; i++) {
			var event = eventList[i];
			if (self.opt[event]) {
				self[event].call(self, self.opt[event]);
			}
		}
	};

	var funcList = ['css', 'addClass', 'hasClass', 'removeClass', 'on', 'off', 'trigger', 'click',
		'dblclick', 'keydown', 'keypress', 'keyup', 'mouseover', 'mousemove', 'mousedown',
		'mouseup', 'dragstart', 'drag', 'dragend', 'drop'];

	var createMethod = (function () {
		return function (key) {
			VirtualEvent.prototype[key] = function () {
				this.instance[key].apply(this, arguments);
			};
		};
	})();

	for (var i = 0, len = funcList.length; i < len; i++) {
		createMethod(funcList[i]);
	}

	Class.extend(VirtualEvent, VirtualClass);

	/** VirtualUI **/
	function VirtualUI(opt) {
		this._super(opt);
		this.children = [];
	}

	VirtualUI.prototype.create = function () {
		return $('<div />');
	};

	VirtualUI.prototype.initialize = function ()
	{
		this._super('initialize');

		if (this.opt.id) {
			this.instance.attr('id', this.opt.id);
		}
		if (this.opt.name) {
			this.instance.attr('name', this.opt.name);
		}
	};

	VirtualUI.prototype.destroy = function () {
		this.instance.remove();
	};

	VirtualUI.prototype.render = function () {
		var self = this;
		this.instance.empty();
		this.children.forEach(function (child) {
			var result = child;

			if (typeof child !== 'string') {
				result = child.render().instance;
			}

			self.instance.append(result);
		});

		return this;
	};

	VirtualUI.prototype.add = function (child) {
		this.children.push(child);
	};

	VirtualUI.prototype.actived = function (isActivated) {
		this.instance.toggleClass('active', isActivated);
	};

	VirtualUI.prototype.disabled = function (isDisabled) {
		this.instance.attr('disabled', isDisabled);
	};

	Class.extend(VirtualUI, VirtualEvent);

	/** VirtualButton **/
	function VirtualButton(opt) {
		this._super(opt);
	}

	VirtualButton.prototype.create = function () {
		return $('<button />');
	};

	VirtualButton.prototype.initialize = function () {
		this._super('initialize');

		if (this.opt.title) {
			this.add(this.opt.title);
		}
	};

	VirtualButton.prototype.actived = function (isActivated) {
		this.instance.toggleClass('active', isActivated);
	};

	VirtualButton.prototype.diabled = function (isDisabled) {
		this.instance.attr('disabled', isDisabled);
	};

	Class.extend(VirtualButton, VirtualUI);

	/** VirtualButtonGroup **/
	function VirtualButtonGroup(opt) {
		this._super(opt);
	}

	VirtualButtonGroup.prototype.create = function () {
		return $('<div class="button-group" />').css({
			display: 'inline-block'
		});
	};

	Class.extend(VirtualButtonGroup, VirtualUI);

	/** VirtualDropdown **/
	function VirtualDropdown(opt) {
		this._super(opt);
	}

	VirtualDropdown.prototype.create = function () {
		return $('<div class="button-group" />').css({
			display: 'inline-block'
		});
	};

	Class.extend(VirtualDropdown, VirtualUI);

	/** VirtualSplitDropdown **/
	function VirtualSplitDropdown(opt) {
		this._super(opt);
	}

	VirtualSplitDropdown.prototype.create = function () {
		return $('<div class="button-group" />').css({
			display: 'inline-block'
		});
	};

	Class.extend(VirtualSplitDropdown, VirtualUI);

	/** VirtualToolbar **/
	function VirtualToolbar(opt) {
		this._super(opt);
	}

	VirtualToolbar.prototype.create = function () {
		return $('<div class="button-toolbar" />');
	};

	Class.extend(VirtualToolbar, VirtualUI);

	/** VirtualWindow **/
	function VirtualWindow(opt) {
		this._super(opt);
	}

	VirtualWindow.prototype.create = function () {
		return $('<div class="window" />');
	};

	Class.extend(VirtualWindow, VirtualUI);

	var ui = {
		Class: Class,
		BaseUI: VirtualUI,
		Event: VirtualEvent,
		Toolbar: VirtualToolbar,
		Button: VirtualButton,
		ButtonGroup: VirtualButtonGroup,
		Dropdown: VirtualDropdown,
		SplitDropdown: VirtualSplitDropdown,
		Window: VirtualWindow
	};

	return ui;
});

