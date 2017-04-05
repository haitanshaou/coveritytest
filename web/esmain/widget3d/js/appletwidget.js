var AppletWidget = {REVISION: '1'};


/**
 * 钻取属性名
 * @type {string}
 */
AppletWidget.NAME_DRILL = "drill";

/**
 * 提示信息属性名
 * @type {string}
 */
AppletWidget.NAME_PROMPT = "prompt";

/**
 * 背景颜色属性名
 * @type {string}
 */
AppletWidget.NAME_BACKGROUDCOLOR = "backgroudcolor";

/**
 * 钻取前缀
 * @type {string}
 */
AppletWidget.ZB_DRILL = "$drill_";

/**
 * 提示前缀
 * @type {string}
 */
AppletWidget.ZB_PROMPT = "$prompt_";

/**
 * 背景色前缀
 * @type {string}
 */
AppletWidget.ZB_BACKGROUDCOLOR = "$backgroudcolor_";

/**
 * 轮播分组排序方式
 * @type {string}
 */
AppletWidget.STRATEGY_ORDER_ASC = "asc";

/**
 * html板块属性前缀
 * @type {string}
 */
AppletWidget.HTMLSCREEN = "htmlscreen_";

/**
 * 发布者对象
 */
AppletWidget.Publisher = function () {
	this.messageTypes = {};
};

/**
 * 订阅消息
 *
 * @param message 消息名称
 * @param subscriber 订阅者
 * @param callback 消息的监听函数
 */
AppletWidget.Publisher.prototype.subscribe = function (message, subscriber, callback) {
	var subscribers = this.messageTypes[message];
	if (subscribers) {
		if (this.findSubscriber(subscribers, subscriber) != -1) {
			return;
		}
	} else {
		subscribers = [];
		this.messageTypes[message] = subscribers;
	}

	subscribers.push({subscriber: subscriber, callback: callback});
};

/**
 * 取消对指定消息的订阅
 */
AppletWidget.Publisher.prototype.unsubscribe = function (message, subscriber) {
	if (subscriber) {
		var subscribers = this.messageTypes[message];
		if (subscribers) {
			var i = this.findSubscriber(subscribers, subscriber);
			if (i != -1) {
				this.messageTypes[message].splice(i, 1);
			}
		}
	} else {
		delete this.messageTypes[message];
	}
};

/**
 * 发布
 * @param message 消息名称
 */
AppletWidget.Publisher.prototype.publish = function (message) {
	var subscribers = this.messageTypes[message] || this._messageAll;

	if (subscribers) {
		for (var i = 0; i < subscribers.length; i++) {
			var args = [];
			for (var j = 0; j < arguments.length - 1; j++) {
				args.push(arguments[j + 1]);// 除第一个参数外的，publish方法的其它参数
			}
			subscribers[i].callback.apply(subscribers[i].subscriber, args);
		}
	}
};

AppletWidget.Publisher.prototype.findSubscriber = function (subscribers, subscriber) {
	for (var i = 0; i < subscribers.length; i++) {
		if (subscribers[i] == subscriber) {
			return i;
		}
	}

	return -1;
};


/**
 * 订阅所有消息
 *
 * @param subscriber 订阅者
 * @param callback 消息的监听函数
 */
AppletWidget.Publisher.prototype.subscribeAll = function (subscriber, callback) {
	var subscribers = [];

	subscribers.push({subscriber: subscriber, callback: callback});
	this._messageAll = subscribers;
};

/**
 * 取消对指定消息的订阅
 */
AppletWidget.Publisher.prototype.unsubscribeAll = function (subscriber) {
	if (subscriber) {
		var subscribers = this._messageAll;
		if (subscribers) {
			var i = this.findSubscriber(subscribers, subscriber);
			if (i != -1) {
				this._messageAll.splice(i, 1);
			}
		}
	} else {
		this._messageAll = null;
	}
};

/**
 * 3D组件
 * @param widgetContext 资源
 * @param container 父容器
 * @constructor
 */
AppletWidget.Widget = function (id, name, provider, container,isdebug) {
	AppletWidget.Publisher.call(this);
	// this.widgetContext = widgetContext;
	this._id = id;
	this._name = name;
	this.provider = provider;
	this.container = container;
	this.isdebugger = isdebug || false;
	this._initWidgetContainer();
};

AppletWidget.Widget.prototype = AppletWidget.Publisher.prototype;
AppletWidget.Widget.prototype.constructor = AppletWidget.Widget;

AppletWidget.Widget.prototype._initWidgetContainer = function() {
	var wcontainer = document.createElement("div");
	wcontainer.style.cssText += ';position:relative;width:100%;height:100%;overflow:hidden;';
	this.container.appendChild(wcontainer);

	this.widgetContainer = wcontainer;
};

/**
 * 组件上下文
 * @returns {*}
 */
AppletWidget.Widget.prototype.getWidgetContext = function () {
	return this.widgetContext;
};

/**
 * 设置数据供应者
 * @param dataProvider
 * @returns {*}
 */
AppletWidget.Widget.prototype.setProvider = function (provider) {
	return this.provider = provider;
};

/**
 * 获取数据供应者
 * @returns {*}
 */
AppletWidget.Widget.prototype.getProvider = function () {
	return this.provider;
};

/**
 * 获取container
 * @returns {*}
 */
AppletWidget.Widget.prototype.getContainer = function () {
	return this.container;
};

/**
 * widget的container，为了保证每次的内容都在父容器里，且不应调整外部的容器样式，特加了一层div
 * @returns {Element|*}
 */
AppletWidget.Widget.prototype.getWidgetContainer = function () {
	return this.widgetContainer;
};

/**
 * 判断浏览器是否支持webgl
 */
AppletWidget.Widget.prototype.supportWebGL = function(nowebglerr) {
	// 判断浏览器是否支持webgl
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage({parent:this.widgetContainer});
		var element = document.createElement('div');
		element.style.textAlign = "center";
		element.id = this._id + "errdiv";
		element.innerHTML = nowebglerr
			|| I18N.getString('ebi.com.esen.irpt.rp.chart.esen.module.3dobjmap.main.js.browsersuggest',
				'建议使用chrome浏览器54及以上版本，IE11浏览器11.0.9600及以上版本，Firefox浏览器50及以上版本，chrome效果最优。');
		this.widgetContainer.appendChild(element);
	}
	return Detector.webgl;
};

/**
 * 判断是否需要进行渲染（用标签页的形式，切换到了其他标签也，应该不予执行渲染，避免内存小号）
 * @returns {boolean}
 * @private
 */
AppletWidget.Widget.prototype.needRenderer = function () {
	if(typeof(getWorkspace) !== "function") return true;
	if(!getWorkspace()) return true;
	var cfwindow = getWorkspace().getCurrentFrameWindow();
	var w = window;
	while(true) {
		if(cfwindow === w) return true;
		if(w.parent === w) break;
		w = w.parent;
	}
	return false;
};

/**
 * 加载的loading动画
 */
AppletWidget.Widget.prototype.showLoading = function() {
	var loading = document.createElement("div");
	loading.id = 'appletwidgetloading' + Math.floor(Math.random() * 1000000);
	loading.className = 'loading';
	this.widgetContainer.appendChild(loading);

	var d = document.createElement("div");
	loading.appendChild(d);
	this._loading = loading;
};

/**
 * 加载完成，移除loading
 */
AppletWidget.Widget.prototype.hideLoading = function() {
	/**
	 * edit by chenlan 20161228
	 * ESENBI-7948 IE11浏览器，3D汽车计算后就报错：对象不支持“remove”方法
	 */
	$(this._loading).remove();
};

/**
 * 加载定制应用
 * @param bundleId
 * @param appContext
 */
AppletWidget.Widget.prototype.loadApplet = function (bundleId, appContext) {
	var bundleRoot = sys.getContextPath() + "esmain/widget3d/model/" + bundleId + "/";
	var url = bundleRoot + "js/main.js";

	require3d([url], function (main) {
		this.closeApplet();
		//this.container.appendChild(this.widgetContainer);
		this._initWidgetContainer();
		main.start(this, bundleRoot, appContext);
	}.bind(this));
};

/**
 * @param methodName 方法名
 * @param args 参数
 */
AppletWidget.Widget.prototype.callApplet = function (methodName, args) {
	var timer = setInterval(function(){
		if(this.app){
			if(typeof(this.app[methodName]) === 'function') {
				this.app[methodName](args);
			}
			clearInterval(timer);
		}
	}.bind(this),500)
};

/**
 * 清除所有內容
 */
AppletWidget.Widget.prototype.closeApplet = function () {
	if(this.app) {
		this.app.dispose();
		this.app = null;
	}
	var childs = this.container.children;
	for (var i = 0; i < childs.length;) {
		this.container.removeChild(childs[0]);
	}
};

AppletWidget.Widget.prototype.getProperty = function (name) {
	if (!this._properties) {
		this._properties = {};
		var ps = this.provider.getProperties();
		if (ps) {
			for (var i = 0, size = ps.length; i < size; i++) {
				var p = ps[i];
				var name = p.name;
				if(AppletWidget.NAME_DRILL === name) {
					this._properties[name] = AppletWidget.ZB_DRILL + p.value;
				} else if(AppletWidget.NAME_PROMPT === name) {
					this._properties[name] = AppletWidget.ZB_PROMPT + p.value;
				} else if(AppletWidget.NAME_BACKGROUDCOLOR === name) {
					this._properties[name] = AppletWidget.ZB_BACKGROUDCOLOR + p.value;
				} else {
					this._properties[name] = p.value;
				}
			}
		}
	}
	return this._properties[name];
};

/**
 * 銷毀
 */
AppletWidget.Widget.prototype.dispose = function () {
	this.closeApplet();
	this.provider = null;
	this._loading = null;
	this.widgetContainer = null;
	this.container = null;
	this._properties = {};
};