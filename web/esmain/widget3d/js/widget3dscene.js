/**
 * Created by htso on 2017/3/16.
 * 3D组件通用代码基类
 */
(function (namespace) {
	"use strict";

	function BaseScene(widget, bundleRoot) {
		if (!widget.supportWebGL()) {
			return;
		}
		this.widget = widget;
		this.bundleRoot = bundleRoot;
		this._id = this._id || ("ESENBaseScene" + Math.floor(Math.random() * 1000000));

		this.parent = widget.getContainer();
		this._bgdiv = widget.getWidgetContainer();

		require3d([bundleRoot + "js/objectparams.js"], function (main) {
			this.wdebugger = new WidgetDebugger(main.objectparams, widget.isdebugger);
			this._init();
		}.bind(this), function () {
			this.wdebugger = new WidgetDebugger({}, widget.isdebugger);
			this._init();
		}.bind(this));

	}

	/**
	 * 第一个参数是变量名，
	 * 第二个参数是值
	 * @param args
	 */
	BaseScene.prototype.setVarPro = function (args) {
		this[args[0]] = args[1];
	};

	/**
	 * 初始化参数设置
	 * @private
	 */
	BaseScene.prototype._initParam = function () {
		// 材质信息
		this._materials = {};
		// 选中的对象数组
		this._selectObjs = [];
		// 动画数组
		this._animates = [];
		// 重绘数组
		this._resizes = [];

		// 指标属性对应列
		this._zbidx = {};
		// 开启日志
		this._logOpen = parseBool(this._getProperty("logopen"));
		// 钻取方式
		this._drillmode = this._getProperty("drillmode");
		// 是否显示hint
		this._hashint = parseBool(this._getProperty("hashint"));

		// 高亮颜色
		this._hightLightColor = this._getProperty("hightLightColor");
		this._hightLightShader = this._getProperty("hightLightShader");
		this._highlights_visible = parseBool(this._getProperty("highlights_visible"));
		var hls = this._getProperty("highlights_suffix");
		if(hls) {
			this._highlights_suffixs = hls.split(',');
		}

		this._warn_shader = this._getProperty("warn_shader");
		// 警告颜色样式模型前后缀
		//this._warnColorPrefix = this._getProperty("warn_color_prefix") || '';
		this._warnColorSuffix = this._getProperty("warn_color_suffix") || '';
		// 警告图片样式模型前后缀
		//this._warnPicturePrefix = this._getProperty("warn_picture_prefix") || '';
		this._warnPictureSuffix = this._getProperty("warn_picture_suffix") || '';
		// html模型配置
		this._htmlmods = this._getProperty("htmlplane");

		// 背景样式效果
		this._bgStyle = this._getProperty("bgStyle");

		// 开场动画
		this._video = this._getProperty("startvideo");
		// 开场音乐
		this._sound = this._getProperty("startsound");

		// shader 相关
		this.uniforms = {
			time: {value: 1.0}
		};
	};

	/**
	 * TODO 如果是获取模型对象，必须在load之后用才有效，否则没有this.root
	 * 根据别名获取对应的模型对象，暂不考虑多个的情况
	 * @param alias
	 * @returns {*}
	 * @private
	 */
	BaseScene.prototype._getObjectByAlias = function (alias, isname) {
		//var objs = [];
		for (var name in this._aliases) {
			var a = this._getAliasByName(name);
			if (a === alias) {
				return isname ? name : this.root.getObjectByName(name);
				//if(isname) {
				//	objs.push(name);
				//} else {
				//	objs.push(this.root.getObjectByName(name));
				//}
			}
		}
		return isname ? alias : this.root.getObjectByName(alias);
		//return objs;
	};

	/**
	 * 取消选中状态
	 * @param object
	 * @private
	 */
	BaseScene.prototype._cancelHighLightStatus = function (o) {
		var object = this._getDataMod(o.name);
		if (object && object._oldmaterial) {
			// 有时鼠标点太快了，this.selectedObject._oldmaterial不存在，再执行会出现问题，故判断一下
			object.material = object._oldmaterial;
			object._oldmaterial.dispose();
			object._oldmaterial = null;
			/*if (!this._highlights_visible) {
				object.visible = false;
			}*/
		}
	};

	/**
	 * 设置模型高亮状态效果
	 *
	 * 默认情况，仅高亮模型本身
	 * 若有其他配置，则模型本身外其他需要高亮的模型一并高亮，
	 * @param object
	 * @private
	 */
	BaseScene.prototype._setObjectHighLightStatus = function (o) {
		var object = this._getDataMod(o.name);

		if (!object || this.hightObject === object) {
			// 如果模型已经是高亮效果了，不做处理
			return;
		}
		// 设定需要高亮的
		object._oldmaterial = object.material;
		object.material = this.getHightMaterial(object.initialMaterial);
	};

	/**
	 * 单个设置选中状态
	 * @param object
	 * @private
	 */
	BaseScene.prototype._selectObjectSingle = function (object) {
		if (!this._objIsSelect(object)) {
			while (this._selectObjs.length >= this._maxSelect) {
				// 如果达到最大数了，把前面那个顶掉
				var o = this._selectObjs[0];
				this._cancelHighLightStatus(o);
				this._selectObjs.splice(0, 1);
			}
			this._setObjectHighLightStatus(object);
			this._selectObjs.push(object);
		}
	};

	/**
	 * 判断对象是否已经被选中过，因为一个地区飞出去后再点击应当无效
	 * @param object
	 * @returns {boolean}
	 * @private
	 */
	BaseScene.prototype._objIsSelect = function (object) {
		// object要判空
		if (!object) {
			return false;
		}
		for (var i = 0, size = this._selectObjs.length; i < size; i++) {
			var o = this._selectObjs[i];
			// TODO 要考虑别名配置
			if (o.name.split("_")[0] === object.name.split("_")[0]) {
			//if (o.name === object.name) {
				return true;
			}
		}
		return false;
	};

	/**
	 * 根据属性名称，获取对应属性配置
	 * @param name
	 * @returns {*}
	 * @private
	 */
	BaseScene.prototype._getProperty = function (name) {
		return this.widget.getProperty(name);
	};

	/**
	 * 打印控制台日志信息，如果浏览器不支持console则没有任何处理
	 * @param msg
	 * @private
	 */
	BaseScene.prototype._loginfo = function (msg) {
		if (this._logOpen && console) {
			console.log(msg);
		}
	};

	/**
	 * 初始化方法，构造函数中加载objectparams.js完了之后执行，
	 * 有需要的话子类覆写，
	 * @private
	 */
	BaseScene.prototype._init = function () {
		this._initParam();
		this._initDatas();
		this._initContainer();

		// 背景的星空图
		this._initStarryCanvas();
		this.widget.showLoading();

		this._initBaseInfo();
		this._initVideo();
		this._initSound();
		this._initLight();
		this._loadImgTexture();
		if (this._htmlmods) {
			// 初始化CSSRender场景，有多个板块也都加到一块去
			this._htmlScreenHelper = new HtmlScreenHelper(this._animates, this._resizes, this.container, this.renderer, this.camera);
		}
		this._load();
		this._play();
	};

	BaseScene.prototype._initContainer = function () {
		var container = this._bgdiv;
		container.className = "esen3d_bg";

		var c = document.createElement("div");
		c.id = this._id;
		container.appendChild(c);
		this.container = c;

		// 固定宽高比
		this.container.style.cssText = "position:absolute;left:50%;top:50%;";
		var aspectration = this._getProperty("aspectration");
		if (aspectration) {
			// 目前只考虑 宽:高 的格式
			var a = aspectration.split(":");
			this._def_width = a[0];
			if (a.length === 2) {
				this._aspect = a[0] / a[1];
			}
		}
		this._resizeContainer();
	};

	BaseScene.prototype._initStarryCanvas = function () {
		if (this._bgStyle === "Starry") {
			this._starry = new Starry(this._bgdiv, this._id);
			this._animates.push(function () {
				this._starry.animation();
			}.bind(this));
			this._resizes.push(function () {
				this._starry.resize(this.container);
			}.bind(this));
		}
	};

	/**
	 * 基本信息初始化
	 * 场景、相机、渲染器等
	 * @private
	 */
	BaseScene.prototype._initBaseInfo = function () {
		this.wdebugger.clearGui();

		var rendereralpha = parseBool(this._getProperty("rendereralpha"));
		var container = this.container;
		var renderer = new THREE.WebGLRenderer({antialias: true, alpha: rendereralpha});
		var clearcolor = this._getProperty("clearcolor");
		if (clearcolor) {
			renderer.setClearColor(clearcolor);
		}
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(this._conOffWidth, this._conOffHeight);
		renderer.domElement.style.position = 'absolute';
		container.appendChild(renderer.domElement);
		this.renderer = renderer;
		this._offset = $(this.renderer.domElement).offset();

		var scene = new THREE.Scene();
		if (parseBool(this._getProperty("scene_background"))) {
			this._textureCube = new THREE.CubeTextureLoader()
				.setPath(this.bundleRoot + 'images/scene/')
				.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

			scene.background = this._textureCube
		}

		this._camera_aspect = this._conOffWidth / this._conOffHeight;
		var camera = new THREE.PerspectiveCamera(45, this._camera_aspect, 1, 10000);
		//camera.position.set(0, 0, 3.3333);
		scene.add(camera);

		//this._initControl(camera, renderer);

		//创建一个根对象，场景中要显示的对象加入到此根对象中
		var root = new THREE.Object3D();
		scene.add(root);

		this.clock = new THREE.Clock();
		this.scene = scene;
		this.camera = camera;
		this.root = root;
	};

	/**
	 * 初始化开场动画
	 * @private
	 */
	BaseScene.prototype._initVideo = function () {
		if (this._video) {
			$(this.parent).prepend(
				'<video style="position: absolute;width: 100%;height: 100%;left:0px;top:0px;display: none;'
				+ 'object-fit:fill;background-color: black;z-index:3" id="'
				+ this._id + 'video" webkit-playsinline>'
				+ '<source src="' + this.bundleRoot + 'resource/' + this._video
				+ '" type=\'video/mp4; codecs="avc1.42E01E, mp4a.40.2"\'>'
				+ '</video>');

			var video = document.getElementById(this._id + 'video');

			video.loop = false;
			this.video = video;

			this._animates.push(function () {
				if (this._video && this._playVideo) {
					this._playVideo();
				}
			}.bind(this));
		}
	};

	/**
	 * 初始化开场音乐
	 * @private
	 */
	BaseScene.prototype._initSound = function () {
		if (this._sound) {
			$(this.container).prepend('<audio id="' + this._id + 'sound" style="display:none;">'
				+ '<source src="' + this.bundleRoot + 'resource/' + this._sound
				+ '" type="audio/mp3">'
				+ '</audio>');
			var sound = document.getElementById(this._id + 'sound');
			sound.loop = parseBool(this._getProperty("startsound_loop"));
			// 音量为100%
			sound.volume = parseFloat(this._getProperty("startsound_volume")) || 1;
			this.sound = sound;
		}
	};

	/**
	 * 开始执行开场动画
	 * @private
	 */
	BaseScene.prototype._startVideo = function () {
		this.widget.hideLoading();
		this.video.style.display = '';
		this.video.play();
		this.sound.play();
		if (this._playVideo) {
			this._playVideo();
		}
	};

	/**
	 * 开场动画播放
	 * @private
	 */
	BaseScene.prototype._playVideo = function () {
		if (this.video.ended) {
			this.video.style.display = 'none';
			//this.enableAutoRotate = true;
			this._afterVideo();
			this._playVideo = null;
		}
	};

	/**
	 * 开场动画播放完成后的处理
	 * @private
	 */
	BaseScene.prototype._afterVideo = function () {
		this.widget.publish('videofinish', {
			id: 'videofinish',
			object: '',
			data: {}
		});
	};

	/**
	 * 灯光初始化
	 * @private
	 */
	BaseScene.prototype._initLight = function () {
		var scene = this.scene;
		scene.add(new THREE.AmbientLight(0xffffff));

		var hemisphere = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
		scene.add(hemisphere);
		this.wdebugger.buildGui("半球光", hemisphere);

		var light = new THREE.DirectionalLight(0xffffff, 0.85);
		light.position.set(-150, 25, 50);
		scene.add(light);
		this.wdebugger.buildGui("平行光", light);

		var light2 = new THREE.DirectionalLight(0xffffff, 0.85);
		light2.position.set(-100, 250, 50);
		scene.add(light2);
		this.wdebugger.buildGui("平行光2", light2);

		// TODO 如果加阴影麻烦的话，这个点光不开，外面再加带阴影的点光
		var spotLight = new THREE.SpotLight('white', 8, 250, 0.44, 1, 2);
		spotLight.position.set(-60, -30, 140);
		spotLight.angle = -Math.PI / 4;
		scene.add(spotLight);
		this.wdebugger.buildGui("spotLight", spotLight);
		// 阴影点光
		this._spotLight = spotLight;

		var spotLight2 = new THREE.SpotLight(0xffffff, 1);
		spotLight2.position.set(-100, 200, 20);
		spotLight2.angle = Math.PI / 4;
		spotLight2.penumbra = 0.05;
		spotLight2.decay = 1.5;
		spotLight2.distance = 1000;
		scene.add(spotLight2);
		this.wdebugger.buildGui("spotLight2", spotLight2);
	};

	/**
	 * 事件初始化
	 * @private
	 */
	BaseScene.prototype._initListener = function () {
		// 子类实现
	};

	/**
	 * 获取提示信息
	 * @param name
	 * @returns {*}
	 * @private
	 */
	BaseScene.prototype._getHint = function (name) {
		var data = this._getDataByName(name);
		if (!data) {
			// 没有数据绑定的，不是debug模式，不显示
			return this.wdebugger.isdebug ? alia : null;
		}
		var idx = this._getColIndex("prompt");
		return data[idx] || '';
	};

	BaseScene.prototype._hideHint = function () {
		if (this._symbol) {
			this._symbol.style.display = "none";
		}
	};

	BaseScene.prototype._showHint = function (name, event) {
		if (!name) {
			this._hideHint();
			return;
		}

		var hint = this._getHint(name);
		if(!hint) {
			this._hideHint();
			return;
		}
		if (this._hashint) {
			if (!this._symbol) {
				var element = document.createElement('div');
				element.className = "date_hint";
				this._symbol = element;
				this.container.appendChild(element);
			}
			this._symbol.style.display = "block";
			this._symbol.innerHTML = hint;
			$(this._symbol).css('transform', 'scale(' + this._roomscale + ')');

			var offset = $(this.renderer.domElement).offset();

			var elty = event.pageY - offset.top;
			this._symbol.style.top = elty + 'px';

			var eltx = parseInt($(this.renderer.domElement).css('width').replace("px", "")) + offset.left - event.pageX;
			eltx -= this._symbol.offsetWidth * this._roomscale;
			if (eltx > 0) {
				this._symbol.style.left = '';
				this._symbol.style.right = eltx + 'px';
				$(this._symbol).css('transform-origin', 'right top');
			} else {
				this._symbol.style.left = '';
				this._symbol.style.right = '0px';
				$(this._symbol).css('transform-origin', 'right top');
			}
		}
	};

	/**
	 * TODO 后期移除
	 * 根据当前模型名称获取对应的高亮模型名称
	 * @param name
	 * @returns {*}
	 * @private
	 */
	BaseScene.prototype._getHighLightName = function (name) {
		return name;
		/*if (!name) {
			return;
		}
		//name = this._highlights[name]
		//	|| (this._highlights_suffix ? (name + this._highlights_suffix) : name);
		if (this._highlights) {
			for (var key in this._highlights) {
				var value = this._highlights[key];
				if (value.testReg.test(name)) {
					return name.replaceAll(key + '$', value.suffix);
				}
			}
		}
		return this._highlights_suffix ? (name + this._highlights_suffix) : name;*/
	};

	/**
	 * 高亮
	 * 根据模型名称对模型进行高亮
	 * 高亮仅有一个，高亮当前需要高亮的物体同时，取消对前一个物体高亮
	 * 一个物体可能有多个模型
	 * 如：地图，北京区块，分beijing和beijing_bottom，同时需要高亮
	 * @param name
	 * @private
	 */
	BaseScene.prototype._hightLightObject = function (name) {
		name = this._getDataModName(name);
		if(!name) {
			// 与数据不相关的模型，不做高亮
			return;
		}
		//name = this._getHighLightName(name);
		var object = this.root.getObjectByName(name);
		if (!object) {
			return;
		}

		if (this.hightObject) {
			if (object == this.hightObject) {
				// 需要高亮的和当前高亮的是一样的，不做处理
				return;
			}
			if (!this._objIsSelect(this.hightObject)) {
				this._cancelHighLightStatus(this.hightObject);
				this.hightObject = null;
			}
		}

		if (this._objIsSelect(object)) {
			// 需要高亮的是当前选择的，不做处理（当前选择的就是高亮状态）
			return;
		}

		// 设定需要高亮的
		this._setObjectHighLightStatus(object);
		this.hightObject = object;
	};

	/**
	 * 获取高亮材质
	 * @returns {THREE.ShaderMaterial|*}
	 */
	BaseScene.prototype.getHightMaterial = function (material) {
		if (!this._yqMaterial) {
			//0x00f0ff
			if (this._hightLightShader && typeof (window[this._hightLightShader]) === "function") {
				this._yqMaterial = window[this._hightLightShader]({
					time: this.uniforms.time,
					color: this._hightLightColor,
					position: this.camera.position
				});
			} else {
				this._yqMaterial = material.clone();
				this._yqMaterial.color.set(this._hightLightColor);
			}
		}
		return this._yqMaterial;
	};

	BaseScene.prototype._publishDrillDown = function (name, data, event) {
		/*
		如果没有对应模型数据的，走cancelDrillDown，外部应有判断
		if (!data) {
			return;
		}
		*/
		this._drilldata = {
			id: "drilldown",
			object: name,
			data: {
				// TODO 如果是多指标的，返回当前指标的
				url : data[this._getColIndex("drill")],
				event : event
			}
		};
		this.widget.publish("drilldown", this._drilldata);
		eval(this._getProperty("afterdrilldown"));
	};

	/**
	 * 当执行钻取的效果需要取消时，没有对应钻取的执行此方法
	 * 如：机房、汽车，钻取时显示指定信息的报表模板浮动区，没有指定信息时，取消已显示的内容
	 * @private
	 */
	BaseScene.prototype._publishCancelDrillDown = function () {
		this.widget.publish("canceldrilldown", {
			id: "canceldrilldown",
			object: ''
		});
	};

	/**
	 * 根据鼠标的屏幕位置获取到对象
	 * @private
	 */
	BaseScene.prototype._objectFromMouse = function (pagex, pagey) {
		var eltx = pagex - this._offset.left;
		var elty = pagey - this._offset.top;

		// Translate client coords into viewport x,y
		var vpx = ( eltx / this._conOffWidth ) * 2 - 1;
		var vpy = -( elty / this._conOffHeight ) * 2 + 1;

		var vector = new THREE.Vector2(vpx, vpy);
		var raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(vector, this.camera);
		var intersects = raycaster.intersectObjects(this.root.children, true);

		var len = intersects.length;
		if (len > 0) {
			/*
			 * 1、第三方内部处理，有判断不可见的不能被选中，故无需再加判断
			 * 2、选中部分不对是否与模型对应做判断，
			 * 如地图，如果我没有台湾的数据，而射线穿过台湾到达广东广西，显示广东广西并不合适
			 */
			return intersects[0];
			/*
			 * 是与数据对应的相关模型部分才可操控
			 */
			/*for (var i = 0; i < len; i++) {
				var object = intersects[i].object;
				if (this._isDataModel(object.name)) {
					return intersects[i];
				}
			}*/
		}
		return {object: null, point: null, face: null};
	};

	/**
	 * 重绘
	 * @private
	 */
	BaseScene.prototype._onWindowResize = function () {
		//if (this._aspect) {
		this._resizeContainer();
		//}

		this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
		this._offset = $(this.renderer.domElement).offset();

		this.camera.aspect = this._camera_aspect;
		this.camera.updateProjectionMatrix();

		if (this._resizes) {
			for (var i = 0, size = this._resizes.length; i < size; i++) {
				this._resizes[i](this.container);
			}
		}
	};

	/**
	 * 模型加载
	 * @private
	 */
	BaseScene.prototype._load = function () {
		var self = this;
		var name = this._getProperty('modelname') || "model";
		var manager = new THREE.LoadingManager();
		manager.onProgress = function (item, loaded, total) {
			self._loginfo([item, loaded, total]);
		};
		this._loadingManager = manager;

		var onProgress = function (xhr) {
			if (xhr.lengthComputable) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				self._loginfo(Math.round(percentComplete) + '% downloaded');
			}
		};
		var onError = function (xhr) {
			var element = document.createElement('div');
			element.style.textAlign = "center";
			element.innerHTML = I18N.getString('',
				'模型加载失败！');
			self.container.appendChild(element);
			//showError(xhr);
		};

		var mtlLoader = new THREE.MTLLoader(manager);
		mtlLoader.load(self.bundleRoot + "model/" + name + ".mtl", function (materials) {
			self._dealMaterials(materials);
			var objLoader = new THREE.OBJLoader(manager);
			objLoader.setMaterials(materials);
			objLoader.load(self.bundleRoot + "model/" + name + ".obj",
				function (object) {
					self._onLoad(object);
				}
				, onProgress, onError);
		});
	};

	/**
	 * 加载时修改材质图片的路径
	 *
	 * @param materials
	 * @private
	 */
	BaseScene.prototype._dealMaterials = function (materials) {
		var self = this;
		var mis = materials.materialsInfo;
		for (var key in mis) {
			if (mis[key] && mis[key].map_ka) {
				mis[key].map_ka = self.bundleRoot + 'images/texture/' + mis[key].map_ka;
				mis[key].map_kd = self.bundleRoot + 'images/texture/' + mis[key].map_kd;
				if (mis[key].map_bump) {
					mis[key].map_bump = self.bundleRoot + 'images/texture/' + mis[key].map_bump;
				}
			}
		}
		materials.preload();
	};

	BaseScene.prototype._onLoad = function (object) {
		var self = this;
		object.traverse(function (child) {
			self._dealObjectInLoadCircul(child, object);
		});

		self.root.add(object);

		// 调整摄像机
		var camera = self.camera;
		//camera.position.z = modelHelper.getSuitableCameraZValue() / 0.9;
		self.wdebugger.buildGui("摄像机", camera);
		camera.updateProjectionMatrix();

		self._createHtmlScreen();

		self.wdebugger.buildAxis(object, this.camera.position.z / 2);
		self._getGroups();
		self._afterLoad(object);

		if (self._video) {
			self._startVideo();
		} else {
			self.widget.hideLoading();
			self._afterVideo();
		}
	};

	/**
	 * 子类实现
	 * load加载完后，开始之前做的处理
	 * @private
	 */
	BaseScene.prototype._afterLoad = function (object) {
	};

	/**
	 * 模型加载时对模型的处理
	 * @param child
	 * @private
	 */
	BaseScene.prototype._dealObjectInLoadCircul = function (child, object) {
		var self = this;
		if(child instanceof THREE.Group) {
			return;
		}

		if (child instanceof THREE.Mesh) {
			child.geometry = new THREE.Geometry()
				.fromBufferGeometry(child.geometry);
		} else if (child instanceof THREE.Line) {
			child.material.lights = false;
		}

		self._dealObjectInLoadCirculStart(child, object);

		var name = child.name;
		/*if (!self._highlights_visible) {
			// 如果配置了模型高亮不显示，对高亮模型进行隐藏（机房例子）
			var dmName = this._getDataModName(name);
			if (name === dmName) {
				debugger
				child.material.opacity = 0;
				//child.material.reflectivity = 0.3;
				//child.visible = false;
			} else {
				if (self._highlights_suffixs) {
					for (var i = 0, len = self._highlights_suffixs.length; i < len; i++) {
						var hsuf = self._highlights_suffixs[i];
						if (name === (dmName + hsuf)) {
							child.material.opacity = 0;
							//child.visible = false;
							break;
						}
					}
				}
			}
		}*/

		/*// 模型名称满足高亮后缀，高亮模型不显示，则隐藏
		if (!self._highlights_visible && self._highlights_suffix) {
			if (name.substr(name.length - self._highlights_suffix.length)
				=== self._highlights_suffix) {
				child.visible = false;
			}
		}*/

		// 警告对应图片模型，默认隐藏
		if(self._warnPictureSuffix) {
			if(name.substr(name.length - self._warnPictureSuffix.length) === self._warnPictureSuffix) {
				//child.visible = false;
				child.material.opacity = 0;
			}
		}

		if (child.material) {
			// 设置初始颜色
			// child.initialColor = child.material.color;
			child.initialMaterial = child.material.clone();
		}

		// 处理背景色
		self._dealBackgroundColor(child);
		// 处理警告
		self._dealWarn(child, object);

		self._dealObjectInLoadCirculEnd(child, object);
	};

	/**
	 * 子类有需要则实现，在load模型时循环内部开始，处理模型
	 * @private
	 */
	BaseScene.prototype._dealObjectInLoadCirculStart = function (child) {
	};

	/**
	 * 子类有需要则实现，在load模型时循环内部结束，处理模型
	 * @private
	 */
	BaseScene.prototype._dealObjectInLoadCirculEnd = function (child) {
	};

	BaseScene.prototype._createHtmlScreen = function () {
		if (!this._htmlmods) {
			return;
		}
		var mods = this._htmlmods.split(";");
		for (var i = 0, size = mods.length; i < size; i++) {
			var ms = mods[i].split(",");
			var name = ms[0];
			var html = this._getProperty(AppletWidget.HTMLSCREEN + name);
			if(html) {
				var daping = this.root.getObjectByName(ms[1]);
				var euler = new THREE.Euler();
				euler.set(ms[2], ms[3], ms[4], "XYZ");
				this._htmlScreenHelper.createHtmlPlane(daping, this.scene, euler, html);
			}
		}
	};

	/**
	 * 加载贴图
	 * 警告的材质贴图
	 * @private
	 */
	BaseScene.prototype._loadImgTexture = function () {
		var loader = new THREE.ImageLoader(this._loadingManager);

		this._textures = {};

		var warnpic = this._getProperty("warnpic");
		if (!warnpic) {
			return;
		}
		var pics = warnpic.split(",");
		for (var i = 0, size = pics.length; i < size; i++) {
			//var pics = JSON.parse(warnpic);
			//for (var pickey in pics) {
			loader.load(this.bundleRoot + 'images/texture/' + pics[i], function (pickey, image) {
				var texture = new THREE.Texture();
				texture.image = image;
				texture.needsUpdate = true;

				this._textures[pickey] = texture;
			}.bind(this, pics[i]));
		}
	};

	/**
	 * 设置对象颜色
	 * @param object
	 * @param color
	 * @private
	 */
	BaseScene.prototype._setColor = function (object, color) {
		if (object) {
			/*
			 之前要clone是因为地区用的同一个，不clone会所有地区一起改动。
			 但每次设置颜色都把material去clone一遍不好。
			 故相同name的材质信息，每种颜色持有一个即可。
			 object.material = object.material.clone();
			 object.material.color.setHex(hex);
			 */
			var mname = object.material.name;
			var material = this._materials[mname + color];
			if (!material) {
				material = object.material.clone();
				//material.color.setHex(hex);
				material.color.set(color);
				this._materials[mname + color] = material;
			}
			object.material = material;
		}
	};

	/**
	 * 对象设置材质贴图
	 * @param object
	 * @param color
	 * @private
	 */
	BaseScene.prototype._setTexture = function (object, pic) {
		if (object) {
			var mname = object.material.name;
			var material = this._materials[mname + pic];
			if (!material) {
				material = object.material.clone();
				//material.color.set(color);
				material.map = this._textures[pic];
				this._materials[mname + pic] = material;
			}
			object.material = material;
		}
	};

	/**
	 * 背景色设置
	 * @param child
	 * @param needreset
	 * @private
	 */
	BaseScene.prototype._dealBackgroundColor = function (child, needreset) {
		var self = this;
		// 处理背景色
		var alias = self._getAliasByName(child.name);
		if (alias) {
			if (!self._bgColIdx) {
				self._bgColIdx = self._getColIndex("backgroudcolor");
			}
			if (self._bgColIdx !== -1) {
				var data = self._datas[alias];
				if (data) {
					var color = data[self._bgColIdx];
					self._setColor(child, color);
					needreset = false;
				}
			}
		}

		if (needreset && !self._objIsSelect(child)) {
			// 选中状态的高亮效果不重置
			child.material.dispose();
			child.material = child.initialMaterial;
		}
	};

	/**
	 * 警告设置
	 * @param child
	 * @param root
	 * @param needreset 是否需要重置
	 * @private
	 */
	BaseScene.prototype._dealWarn = function (child, root, needreset) {
		if (child instanceof THREE.Group) {
			return;
		}
		var name = child.name;
		// 与数据对应的模型名称
		var datamodname = this._getDataModName(name);
		if(!datamodname) {
			// 如果是与数据无关的模型，直接返回，无需再判断
			return;
		}
		var warncolor = false;
		var warnpic = false;

		/**
		 * 判断当前模型是否是对应的警告图片模型或警告颜色模型
		 * 是则修改，不是则不处理。
		 *
		 * 不是判断是否是数据对应模型，找到相关警告信息再去找警告对应的模型
		 * 原因1：这个已经是在循环里面调用的方法了，再在方法里用查找，效率低些
		 * 原因2：循环的时候，可能是先处理的数据对应的模型，找到了相关警告对应的模型进行了处理，
		 *        如设置了警告图片模型显示，再后面遍历到警告图片模式时，又给设置成不显示了，达不到效果
		 */
		if(this._warnColorSuffix) {
			var wcsl = name.length - this._warnColorSuffix.length;
			warncolor = name.substr(wcsl) === this._warnColorSuffix;
		} else {
			warncolor = name === datamodname;
		}
		if(this._warnPictureSuffix) {
			var wpsl = name.length - this._warnPictureSuffix.length;
			warnpic = name.substr(wpsl) === this._warnPictureSuffix;
		} else {
			warnpic = name === datamodname;
		}
		/*if (name.substr(wcsl) === this._warnColorSuffix) {
			warncolor = true;
			if (this._warnColorSuffix === this._warnPictureSuffix) {
				warnpic = true;
			}
		} else if (name.substr(wpsl) === this._warnPictureSuffix) {
			warnpic = true;
		}*/
		if (!warncolor && !warnpic) {
			// 即不是警告颜色对应的模型，也不是警告图片对应的模型，则不处理
			return;
		}

		var alias = this._aliases[datamodname] || datamodname;
		if (alias) {
			var warn = this._warn[alias];
			if (warn) {
				if (warn.color) {
					// 与数据对应的模型无后缀，其他模型加后缀处理
					//var obj = root.getObjectByName(name + this._warnColorSuffix);
					//if(obj) {
					//if(name.substr(name.length - this._warnColorSuffix.length) === this._warnColorSuffix) {
					if (warncolor) {
						if (this._warn_shader && typeof (window[this._warn_shader]) === "function") {
							this._setShaderColor(child, warn.color);
						} else {
							this._setColor(child, warn.color);
						}
						/*if (!this._highlights_visible) {
							child.visible = true;
						}*/
						needreset = false;
					}
				}
				// 给模型对应的警告模型设置
				if (warn.picture) {
					// 与数据对应的模型无后缀，其他模型加后缀处理
					//var obj = root.getObjectByName(name + this._warnPictureSuffix);
					//if(obj) {
					//if(name.substr(name.length - this._warnPictureSuffix.length) === this._warnPictureSuffix) {
					if (warnpic) {
						//child.visible = true;
						child.material.opacity = 1;
						this._setTexture(child, warn.picture);
						needreset = false;
					}
				}
			}
		}

		if (needreset) {
			//if(name.substr(name.length - this._warnColorSuffix.length) === this._warnColorSuffix) {
			if (warncolor) {
				/*if (!self._highlights_visible) {
					child.visible = false;
				}*/
			}
			//if(name.substr(name.length - this._warnPictureSuffix.length) === this._warnPictureSuffix) {
			if (this._warnPictureSuffix && warnpic) {
				//child.visible = false;
				child.material.opacity = 0;
			}
			if(!this._objIsSelect(child)) {
				// 选中的高亮效果不重置
				child.material.dispose();
				child.material = child.initialMaterial;
			}
		}
	};

	BaseScene.prototype._setShaderColor = function (object, color) {
		var mname = this._warn_shader + color;
		var material = this._materials[mname];
		if (!material) {
			var material = window[this._warn_shader]({
				time: this.uniforms.time,
				color: color
			});
			this._materials[mname] = material;
		}
		object.material = material;
	};

	BaseScene.prototype._play = function () {
		var _animate = function () {
			requestAnimationFrame(_animate);
			if (this.widget.needRenderer()) {
				if (this._animates) {
					for (var i = 0, size = this._animates.length; i < size; i++) {
						this._animates[i]();
					}
				}
				//this._autoRatation();
				this.renderer.render(this.scene, this.camera);
			}
		}.bind(this);
		_animate();
	};

	/**
	 * container重绘
	 * @private
	 */
	BaseScene.prototype._resizeContainer = function () {
		var container = this._bgdiv.offsetHeight === 0 ? this.parent : this._bgdiv;
		var c = this.container;
		// 计算宽高
		if (this._aspect) {
			var asp = container.offsetWidth / container.offsetHeight;
			if (asp > this._aspect) {
				// 宽了，按高来算宽度
				c.style.height = container.offsetHeight + "px";
				c.style.width = this._aspect * container.offsetHeight + "px";
				c.style.marginLeft = "-" + this._aspect * container.offsetHeight / 2 + "px";
				c.style.marginTop = "-" + container.offsetHeight / 2 + "px";
			} else {
				// 高了，按宽来算高度
				c.style.width = container.offsetWidth + "px";
				c.style.height = 1 / this._aspect * container.offsetWidth + "px";
				c.style.marginLeft = "-" + container.offsetWidth / 2 + "px";
				c.style.marginTop = "-" + 1 / this._aspect * container.offsetWidth / 2 + "px";
			}
		} else {
			c.style.height = container.offsetHeight + "px";
			c.style.width = container.offsetWidth + "px";
			c.style.marginTop = "-" + container.offsetHeight / 2 + "px";
			c.style.marginLeft = "-" + container.offsetWidth / 2 + "px";
		}
		this._roomscale = this.container.offsetWidth / this._def_width || 1;

		this._conOffWidth = this.container.offsetWidth;
		this._conOffHeight = this.container.offsetHeight;
	};

	/**
	 * 根据属性名获取属性所在列的index，便于取数
	 * @param proname
	 * @returns {*}
	 * @private
	 */
	BaseScene.prototype._getColIndex = function (proname) {
		var idx = this._zbidx[proname];
		if (idx) {
			return idx;
		}
		var colvalue = this._getProperty(proname);
		var cols = this.widget.getProvider().getColumns();
		if (cols) {
			for (var i = 0, size = cols.length; i < size; i++) {
				if (colvalue == cols[i]) {
					this._zbidx[proname] = i;
					return i;
				}
			}
		}
		return -1;
	};

	/**
	 * 根据属性名获取属性所在列的index，便于取数
	 * 多指标的情况
	 * @param proname
	 * @returns {*}
	 * @private
	 */
	BaseScene.prototype._getColIndexs = function (proname) {
		var idx = this._zbidx[proname];
		if (idx) {
			return idx;
		}
		var colIdx = [];
		var colvalue = this._getProperty(proname);
		var cols = this.widget.getProvider().getColumns();
		var zbs = WidgetUtil.splitZbs(colvalue);
		if(zbs && cols) {
			for(var j = 0, len = zbs.length; j<len;j++) {
				var zb = zbs[j];
				for (var i = 0, size = cols.length; i < size; i++) {
					if (zb == cols[i]) {
						colIdx.push(i);
						break;
						//this._zbidx[proname] = i;
						//return i;
					}
				}
			}
		}
		this._zbidx[proname] = colIdx;
		return colIdx;
	};

	/**
	 * 根据警告数值，获取对应警告颜色配置、图片配置
	 * @param warndata
	 * @private
	 */
	BaseScene.prototype._getWarn = function (warndata) {
		if (!this._ws) {
			this._ws = [];
			/**
			 * 初始化警告设置
			 */
			var warnset = this._getProperty("warningset");
			if (warnset) {
				for (var i = 0, size = warnset.length; i < size; i++) {
					var w = warnset[i];
					var rangevalue = w.value;
					var scopes = WidgetUtil.getScopes(rangevalue);
					this._ws.push({
						warnset: w,
						scopes: scopes
					});
				}
			}
		}

		/**
		 * 判断数值是否在警告范围内
		 */
		for (var i = 0, size = this._ws.length; i < size; i++) {
			var w = this._ws[i];
			var scopes = w.scopes;
			if (!scopes) {
				continue;
			}
			for (var j = 0, len = scopes.length; j < len; j++) {
				if (scopes[j].check(warndata)) {
					return w.warnset;
				}
			}
		}
	};

	var firstNameSplit = function (name) {
		return name ? name.split("_")[0] : '';
	};

	/**
	 * 判断是否是与数据相关的模型。
	 * 如汽车的模型，轮胎和引擎盖与数据相关
	 * luntai01 luntai01_scp luntai01_lg 等等，都是与数据相关的模型，返回true
	 * cheshen与数据不相关，返回false
	 * 如果cheshen也与数据绑定了，那么cheshen也返回true
	 *
	 * @param name
	 * @returns {boolean}
	 * @private
	 */
	BaseScene.prototype._isDataModel = function (name) {
		var data = this._getDataByName(name);
		return data ? true: false;
	};

	/**
	 * 根据模型名称，获取对应的数据
	 * @param name
	 * @returns {*}
	 * @private
	 */
	BaseScene.prototype._getDataByName = function (name) {
		//name = this._getDataModName(name);
		name = firstNameSplit(name);
		var alia = this._getAliasByName(name);
		return this._datas[alia];
	};

	/**
	 * 根据模型名称，获取对应的别名，如未配置，别名就是其本身
	 * @param name
	 * @returns {*}
	 * @private
	 */
	BaseScene.prototype._getAliasByName = function (name) {
		return this._aliases[name] || name;
	};

	/**
	 * 根据模型名称，获取与数据对应的模型名称.如果模型与数据不对应，返回空
	 * 如：与数据对应的模型名称为beijing。
	 * 与北京相关功能的，会带后缀，例beijing_bottom，beijing_pillar等，
	 * 根据beijing_bottom，beijing_pillar模型名称，获取与数据对应的模型名称为beijing
	 * 模型命名规则，与数据相关的模型，命名xxx，其他与该模型相关的，加后缀xxx_houzhui等等，
	 * @param name
	 * @returns {*}
	 * @private
	 */
	BaseScene.prototype._getDataModName = function (name) {
		name = firstNameSplit(name);
		var alia = this._getAliasByName(name);
		var data = this._datas[alia];
		return data ? name : '';
	};

	BaseScene.prototype._getDataMod = function (name) {
		if(!name) {
			return null;
		}
		name = firstNameSplit(name);
		var alia = this._getAliasByName(name);
		var data = this._datas[alia];
		return data ? this.root.getObjectByName(name) : null;
	};

	/**
	 * 初始化数据
	 * @param datas
	 * @private
	 */
	BaseScene.prototype._initDatas = function (datas) {
		this._aliases = JSON.parse(this._getProperty("aliases") || '{}');
		//this._highlights = JSON.parse(this._getProperty("highlights") || '{}');
		this._highlights = {};
		var h = this._getProperty("highlights");
		if (h) {
			this._highlights = {};
			// 多个对应逗号分割
			var hs = h.split(',');
			for (var i = 0, size = hs.length; i < size; i++) {
				var hmod = hs[i];
				// 冒号对应
				var hms = hmod.split(':');
				var key = hms[0].trim();
				var value = hms[1].trim();
				this._highlights[key] = {
					suffix: value,
					testReg: new RegExp(key + '$')
				};
			}
		}

		this._datas = {};
		this._warn = {};

		if (!datas) {
			datas = this.widget.getProvider().getDatas();
		}
		if (datas) {
			var idx = this._getColIndex("name");
			var warnidx = this._getColIndex("warningzb");

			for (var i = 0, len = datas.length; i < len; i++) {
				var data = datas[i];
				var name = data[idx];
				this._datas[name] = data;

				//0也会被判断为false，但有第0列 if(warnidx && -1 !== warnidx) {
				if (-1 !== warnidx) {
					var warn = this._getWarn(data[warnidx]);
					if (warn) {
						this._warn[name] = warn;
					}
				}
				//if(this.root) {
				//	this._processData(data);
				//}
			}

			if(this.root) {
				this._getGroups(datas);
			}
		}
	};

	/**
	 * 对数据的处理
	 * 子类有需要覆写
	 * @param data
	 * @private
	 */
	BaseScene.prototype._processData = function (data) {

	};

	/**
	 * 数据清理
	 * @private
	 */
	BaseScene.prototype._dataClear = function () {
		// 材质信息
		this._materials = {};

		this._zbidx = {};
		this._datas = {};
		this._aliases = {};
		this._warn = {};
		this._ws = null;
		this._highlights = null;
	};

	/**
	 * 重新设置数据，相关内容刷新
	 * @param datas
	 * @private
	 */
	BaseScene.prototype.dataRefresh = function (datas) {
		var _this = this;
		this._dataClear();

		this._initDatas(datas);
		// 如果是轮播状态，刷新时处理和轮播可能会冲突
		this.root.traverse(function (child) {
			_this._changeModel4DataRefresh(child, _this.root);
			_this._dealBackgroundColor(child);
			_this._dealWarn(child, _this.root, true);
		});
	};

	/**
	 * 数据刷新时需要对模型的处理
	 * 子类有需要时覆写
	 * @param datas
	 */
	BaseScene.prototype._changeModel4DataRefresh = function (child, object) {

	};

	/**
	 * 选择指定的模型对象
	 * @param alias
	 BaseScene.prototype.selectObjByAlias = function(alias) {
		// TODO 要考虑一个别名对应多个部件的情况
		var object = this._getObjectsByAlias(alias)[0];
		this._selectObjectSingle(object);
	};
	 */

	/**
	 * 供外部调用的重绘，因为可能并不是窗口改变了，而是dom改变了，
	 * 这时不会自动触发window的resize事件，故提供此方法
	 */
	BaseScene.prototype.resize = function () {
		this._onWindowResize();
	};

	/**
	 * 组件销毁方法
	 */
	BaseScene.prototype.dispose = function () {
		// 子类实现
	};

	BaseScene.prototype._getGroups = function (data) {

	};

	function FixedScene(widget, bundleRoot) {
		BaseScene.call(this, widget, bundleRoot);
	}

	_extendClass(FixedScene, BaseScene, "FixedScene");

	FixedScene.prototype._initParam = function () {
		BaseScene.prototype._initParam.call(this);

		this._fullscreen = parseBool(this._getProperty("fullscreenbutton"));
		this._autoR = parseBool(this._getProperty("autorotationbutton"));
		// 自动旋转
		this._autoRotate = parseBool(this._getProperty("autorotation"));

		// 轮播设置
		// 轮播个数，也是最大选择数
		this._maxSelect = parseInt(this._getProperty("carouselcount")) || 1;
		this._carouselDuration = parseInt(this._getProperty("carouselDuration")) || 1000;
		this._autoCarousel = parseBool(this._getProperty("autoCarousel"));
		//this._autoCarousel = false;
		this._carouselZbOrder = this._getProperty("carouselZbOrder");
		if (this._carouselZbOrder) {
			this._animates.push(function () {
				TWEEN.update();
			});
		}
		this._animates.push(this._autoRatation.bind(this));
		this._groupIndex = 0;
	};

	FixedScene.prototype._initBaseInfo = function() {
		BaseScene.prototype._initBaseInfo.call(this);

		this._initControl(this.camera, this.renderer);
	};

	FixedScene.prototype._afterLoad = function () {
		BaseScene.prototype._afterLoad.call(this);
		if(this.controls) {
			this.wdebugger.buildOrbitControl("轨道控制器", this.controls);
			this._setControlParam();
		}
	};

	FixedScene.prototype._afterVideo = function () {
		BaseScene.prototype._afterVideo.call(this);

		this._initListener();
		this.enableAutoRotate = this._autoRotate;
		this._addButton();
		if (this._autoCarousel) {
			this._CarsouselPlay();
		}
	};

	FixedScene.prototype._initListener = function () {
		$(window).bind('resize', this._onWindowResize.bind(this));

		var dom = $(this.container);
		dom.bind("mousedown.fixedscene", this._onMouseDown.bind(this));
		dom.bind("mouseup.fixedscene", this._onMouseUp.bind(this));
		dom.bind("mousemove.fixedscene", this._onMouseMove.bind(this));

		//this.controls.addEventListener('change', this._onControlChange.bind(this));
		$(this.controls).bind("change.fixedscenecontrol", this._onControlChange.bind(this));
	};

	FixedScene.prototype.dispose = function () {
		$(window).unbind('resize', this._onWindowResize.bind(this));

		var dom = $(this.container);
		dom.unbind("mousedown.fixedscene", this._onMouseDown.bind(this));
		dom.unbind("mouseup.fixedscene", this._onMouseUp.bind(this));
		dom.unbind("mousemove.fixedscene", this._onMouseMove.bind(this));
		$(this.controls).unbind("change.fixedscenecontrol", this._onControlChange.bind(this));

		this.controls.dispose();
		this.controls = null;

		this._dataClear();
	};

	FixedScene.prototype._publishDrillDown = function (name, data, event) {
		BaseScene.prototype._publishDrillDown.call(this, name, data, event);
		if(this.enableAutoRotate) {
			// 如果是正在旋转,停掉
			$("#" + this._id + "button2").click();
		}
		/*if(!this._paused) {
			// 如果正在轮播，暂停掉
			$("#" + this._id + "button3").click();
		}*/

	};

	FixedScene.prototype._CarsouselPlay = function () {
		this._paused = false;
		this._playGroup();
	};

	FixedScene.prototype._CarsouselPaused = function () {
		this._paused = true;
		if (this._gt) {
			this._gt.stop();
			this._gt = null;
		}
	};

	FixedScene.prototype._playGroup = function () {
		var self = this;
		if (self._paused) {
			//self._groupIndex = groupIndex;
			return;
		}
		// 如果根本就没有数据，不可能播放，直接返回
		if (!self._groups || self._groups.length === 0) {
			return;
		}
		//if (self._groupIndex >= self._groups.length) {
		//	// 如果超出了，从头开始
		//	self._groupIndex = 0;
		//}
		var group = self._groups[self._groupIndex];

		//var time = groupIndex === 0 ? this.DURATION : this.DURATION * 3;
		var time = this._carouselDuration;
		var gt = new TWEEN.Tween({x: 0})
			.to({x: 1}, time)
			.easing(TWEEN.Easing.Linear.None)
			.onComplete(function (group) {
				// 在里面没有必要判断是否暂停，因为参数是执行前传的
				self._selectAreaGroup(group);
				if (group) {
					self._groupIndex++;
					self._playGroup();
				} else {
					self._groupIndex = 0;
					self._playBbq(++self._bbqIndex);
				}
			}.bind(self, group));

		self._gt = gt;
		if (!self._paused) {
			gt.start();
		}
	};

	FixedScene.prototype._selectAreaGroup = function (group) {
		// 清除已选的
		if (this._selectObjs) {
			for (var i = 0, size = this._selectObjs.length; i < size; i++) {
				var object = this._selectObjs[i];
				this._cancelHighLightStatus(object);
			}
			this._selectObjs = [];
		}

		// 选择新加的
		if (group) {
			for (var j = 0, s = group.length; j < s; j++) {
				var alias = group[j].alias;
				var name = this._getObjectByAlias(alias, true);
				/*
				name = this._getHighLightName(name);
				var object = this.root.getObjectByName(name);
				*/
				var object = this._getDataMod(name);
				if (object) {
					this._selectObjs.push(object);
					this._setObjectHighLightStatus(object);

					var dmName = this._getDataModName(name);
					if(dmName) {
						this._publishDrillDown(dmName, this._datas[this._getAliasByName(dmName)]);
					} else {
						this._publishCancelDrillDown();
					}
				}
			}
		}
	};

	/**
	 * 根据数据和配置处理分组
	 * @param datas
	 * @private
	 */
	FixedScene.prototype._getGroups = function (data) {
		// 轮播依据指标
		var carZbidx = this._getColIndex("carouselZb");
		if (-1 === carZbidx) {
			return;
		}
		if(!data) {
			data = this.widget.getProvider().getDatas();
		}
		if(!data) {
			return;
		}
		var nameidx = this._getColIndex("name");

		this._groups = [];
		var gdata = [];
		var d = data.slice(0);
		d.sort(function (order, keyid, x, y) {
			var a = parseFloat(x[keyid]);
			var b = parseFloat(y[keyid]);
			if (order === this.STRATEGY_ORDER_ASC) {
				return a > b ? 1 : (a < b ? -1 : 0)
			} else {
				return a > b ? -1 : (a < b ? 1 : 0)
			}
		}.bind(this, this._carouselZbOrder, carZbidx));

		for (var i = 0, len = d.length; i < len; i++) {
			var alias = d[i][nameidx];
			var obj = this._getObjectByAlias(alias);
			// 有找到对应的模型才加进去
			if(obj) {
				// 避免以后有需要加内容，所以直接弄成对象的
				gdata.push({alias: alias});
				this._processData(d[i])
			}
		}
		for (var i = 0, len = gdata.length; i < len; i += this._maxSelect) {
			this._groups.push(gdata.slice(i, i + this._maxSelect));
		}
		return this._groups;
	};

	/**
	 * 初始化控制器
	 * @param camera
	 * @param renderer
	 * @private
	 */
	FixedScene.prototype._initControl = function (camera, renderer) {
		var controls = new THREE.OrbitControls(camera, renderer.domElement);
		this.controls = controls;
	};

	/**
	 * 设置控制器参数，因为用户配置最大，故放在debug的build之后
	 * @private
	 */
	FixedScene.prototype._setControlParam = function () {
		var controls = this.controls;

		// 设置平面自动旋转
		//controls.autoRotate = this._autoRotate;
		controls.autoRotate = true;
		this.enableAutoRotate = this._autoRotate;

		//默认值为2，默认速度为 30 seconds per round when fps is 60
		var autoRotateSpeed = parseFloat(this._getProperty("rotationspeed"));
		if (!isNaN(autoRotateSpeed)) {
			controls.autoRotateSpeed = autoRotateSpeed;
		}

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		var minPolarAngle = parseFloat(this._getProperty("minPolarAngle"));
		if (!isNaN(minPolarAngle)) {
			controls.minPolarAngle = minPolarAngle;
		}
		var maxPolarAngle = parseFloat(this._getProperty("maxPolarAngle"));
		if (!isNaN(maxPolarAngle)) {
			controls.maxPolarAngle = maxPolarAngle;
		}
		// How far you can orbit horizontally, upper and lower limits.
		// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
		var minAzimuthAngle = parseFloat(this._getProperty("minAzimuthAngle"));
		if (!isNaN(minAzimuthAngle)) {
			controls.minAzimuthAngle = minAzimuthAngle;
		}
		var maxAzimuthAngle = parseFloat(this._getProperty("maxAzimuthAngle"));
		if (!isNaN(maxAzimuthAngle)) {
			controls.maxAzimuthAngle = maxAzimuthAngle;
		}

		// 最大最小距离
		var minDistance = parseFloat(this._getProperty("minDistance"));
		if (!isNaN(minDistance)) {
			controls.minDistance = minDistance;
		}
		var maxDistance = parseFloat(this._getProperty("maxDistance"));
		if (!isNaN(maxDistance)) {
			controls.maxDistance = maxDistance;
		}

		// 平移
		controls.enablePan = false;
		// 键盘控制
		controls.enableKeys = false;
	};

	/**
	 * 添加组件按钮
	 * @private
	 */
	FixedScene.prototype._addButton = function () {
		var _this = this;
		var left = 10;

		// TODO 鼠标点击样式是好的，但键盘操控不对
		if (this._fullscreen) {
			$(this.container).bind(
				'fullscreenchange webkitfullscreenchange mozfullscreenchange',
				//this._fullScreenChange.bind(this)
				WidgetUtil.fullScreenChange.bind(this, this._onWindowResize.bind(this))
			);
			//最大化按钮
			var b1 = '<div id="' + this._id +
				'button1" style="cursor: pointer;position:absolute;width:40px;height:40px;top:10px;left:' + left + 'px;background:url('
				+ this.bundleRoot + 'images/widget/enlarge.png) no-repeat left top;background-size:40px;z-index:3;"></div>';
			$(this.parent).prepend(b1);

			$("#" + this._id + "button1").click(function () {
				if (WidgetUtil.isFullscreen()) {
					$(this).css("background-image", "url(" + _this.bundleRoot + "images/widget/enlarge.png)");
					WidgetUtil.exitFullScreen();
				} else {
					$(this).css("background-image", "url(" + _this.bundleRoot + "images/widget/narrow.png)");
					_this._bgdiv.requestFullScreen();
				}
			});
			left += 50;
		}

		//停止旋转按钮
		if (this._autoR) {
			var b2 = '<div id="' + this._id +
				'button2"  style="cursor: pointer;position:absolute;width:40px;height:40px;top:10px;left:' + left + 'px;background:url('
				+ this.bundleRoot + 'images/widget/'
				+ (this._autoRotate ? 'play_to.png' : 'play.png') + ') no-repeat left top;background-size:40px;z-index:3;"></div>';
			$(this.parent).prepend(b2);
			$("#" + this._id + "button2").click(function () {
				if (_this.enableAutoRotate) {
					$(this).css("background-image", "url(" + _this.bundleRoot + "images/widget/play.png)");
					_this.enableAutoRotate = !_this.enableAutoRotate;
				} else {
					$(this).css("background-image", "url(" + _this.bundleRoot + "images/widget/play_to.png)");
					_this.enableAutoRotate = !_this.enableAutoRotate;
				}
			});
			left += 50;
		}

		// 轮播按钮
		if (this._carouselZbOrder) {
			var b3 = '<div id="' + this._id +
				'button3"  style="cursor: pointer;position:absolute;width:40px;height:40px;top:10px;left:' + left + 'px;background:url('
				+ this.bundleRoot + 'images/widget/'
				+ (this._autoCarousel ? 'carousepause.png' : 'carouseplay.png') + ') no-repeat left top;background-size:40px;z-index:3;"></div>';
			$(this.parent).prepend(b3);
			$("#" + this._id + "button3").click(function () {
				if (_this._paused) {
					$(this).css("background-image", "url(" + _this.bundleRoot + "images/widget/carousepause.png)");
					_this._CarsouselPlay();
				} else {
					$(this).css("background-image", "url(" + _this.bundleRoot + "images/widget/carouseplay.png)");
					_this._CarsouselPaused();
				}
			});
			left += 50;
		}
	};

	/**
	 * 自动旋转
	 * @private
	 */
	FixedScene.prototype._autoRatation = function () {
		if (this.controls && this.enableAutoRotate) {
			var delta = this.clock.getDelta();
			this.controls.update(delta);
		}
	};


	FixedScene.prototype._onMouseDown = function () {
		this.moved = false;
	};

	FixedScene.prototype._onControlChange = function () {
		this.moved = true;
	};

	FixedScene.prototype._onMouseMove = function (event) {
		//if (!this.moved) {
		event.preventDefault();
		var intersected = this._objectFromMouse(event.pageX, event.pageY);
		var object = intersected.object;
		if (object) {
			var name = object.name;
			if (this._isDataModel(name)) {
				// 是数据模型才进行高亮和显示hint
				this._hightLightObject(name);
				this._showHint(name, event);
				if (this._drillmode === "mouseover") {
					// 如果钻取模式是鼠标晃动，则分发钻取
					var dmName = this._getDataModName(name);
					this._publishDrillDown(dmName, this._datas[this._getAliasByName(dmName)], event);
				}
				return;
			}
		}
		this.container.style.cursor = 'auto';
		if (this.hightObject && !this._objIsSelect(this.hightObject)) {
			this._cancelHighLightStatus(this.hightObject);
			this.hightObject = null;
		}
		this._showHint();
		if (this._drillmode === "mouseover") {
			this._publishCancelDrillDown();
		}
	};

	FixedScene.prototype._onMouseUp = function (event) {
		if (!this.moved) {
			event.preventDefault();

			var intersected = this._objectFromMouse(event.pageX, event.pageY);
			var object = intersected.object;
			if (object) {
				// 发布onObjClick
				var name = object.name;
				name = this._getHighLightName(name);
				//name = this._highlights[name]
				//	|| (this._highlights_suffix ? (name + this._highlights_suffix) : name);
				var object = this.root.getObjectByName(name);
				if (!object) {
					return;
				}
				this._selectObjectSingle(object);

				if (this._drillmode === "click") {
					name = this._getDataModName(name);
					if(name) {
						this._publishDrillDown(name, this._datas[this._getAliasByName(name)], event);
					} else {
						this._publishCancelDrillDown();
					}
				}
			}
		}
	};

	function MoveScene(widget, bundleRoot) {
		BaseScene.call(this, widget, bundleRoot);
	}

	_extendClass(MoveScene, BaseScene, "MoveScene");

	MoveScene.prototype.dispose = function () {
		var dom = $(document);
		dom.unbind("keydown.movescene", this._onKeyDown.bind(this));
		dom.unbind("keyup.movescene", this._onKeyUp.bind(this));
		$(window).unbind('resize', this._onWindowResize.bind(this));
		$(this.container).unbind('fullscreenchange webkitfullscreenchange mozfullscreenchange',
			WidgetUtil.fullScreenChange.bind(this, this._onWindowResize.bind(this)));

		this._dataClear();
	};

	MoveScene.prototype._initParam = function () {
		BaseScene.prototype._initParam.call(this);

		var self = this;
		// 移动步距
		this._movestep = parseFloat(this._getProperty("movestep"));
		// 碰撞距离
		this._hitdistance = parseFloat(this._getProperty("hitdistance"));
		// 提示显示距离
		this._showdistance = parseFloat(this._getProperty("showdistance"));

		this._animates.push(function(){
			self._move();

			if (self.uniforms) {
				var delta = self.clock.getDelta();
				self.uniforms.time.value += delta * 5;
			}
		});
		this._initMoveParam();
	};

	MoveScene.prototype._afterLoad = function (object) {
		this.wdebugger.buildPositionGui("起始位置", this.controls.getObject());
		this.wdebugger.buildRotationGui("起始方向", this.controls.getObject());

		this._initInstruction();
	};

	MoveScene.prototype._showHint = function (name) {
		if(!name) return;
		// 相同的情况只执行一次
		if(this._selectname === name) return;
		this._selectname = name;

		BaseScene.prototype._showHint.call(this, name, {
			pageX : this._conOffWidth / 2,
			pageY : this._conOffHeight / 2
		});

		/*if (!name || !(/^zhujigui_[0-9]{3}$/.test(name))) {
			this.widget.publish("canceldrilldown", {
				id: "canceldrilldown",
				object: ''
			});
			return;
		}*/
		name = this._getDataModName(name);
		if(name) {
			this._publishDrillDown(name, this._datas[this._getAliasByName(name)]);
		} else {
			this._publishCancelDrillDown();
		}
		/*this.widget.publish("drilldown", {
			id: "drilldown",
			object: name,
			data : {
				name : name,
				isbad : isbad
			}
		});*/
	};

	// TODO 基类的这个方法处理一下，不完全直接覆盖
	MoveScene.prototype._initBaseInfo = function () {
		this.wdebugger.clearGui();

		var rendereralpha = parseBool(this._getProperty("rendereralpha"));
		var container = this.container;
		var renderer = new THREE.WebGLRenderer({antialias: true, alpha: rendereralpha});
		var clearcolor = this._getProperty("clearcolor");
		if(clearcolor) {
			renderer.setClearColor(clearcolor);
		}
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(container.offsetWidth, container.offsetHeight);
		//renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.domElement.style.position = 'absolute';
		container.appendChild(renderer.domElement);
		this.renderer = renderer;

		var scene = new THREE.Scene();
		if(this._getProperty("scene_background") === true) {
			scene.background = new THREE.CubeTextureLoader()
				.setPath(this.bundleRoot + 'images/scene/')
				.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
		}

		this._camera_aspect = this._conOffWidth / this._conOffHeight;
		var camera = new THREE.PerspectiveCamera(60, this._camera_aspect, 1, 500000);
		scene.add(camera);

		var controls = new THREE.PointerLockControls(camera);
		scene.add(controls.getObject());
		this.controls = controls;

		//创建一个根对象，场景中要显示的对象加入到此根对象中
		var root = new THREE.Object3D();
		scene.add(root);

		this.scene = scene;
		this.camera = camera;
		this.root = root;
		this.clock = new THREE.Clock();
	};

	MoveScene.prototype._afterVideo = function () {
		BaseScene.prototype._afterVideo.call(this);

		this._initListener();
	};

	MoveScene.prototype._initListener = function () {
		//var dom = $(this.container);
		var dom = $(document);
		dom.bind("keydown.motorroom", this._onKeyDown.bind(this));
		dom.bind("keyup.motorroom", this._onKeyUp.bind(this));
		$(window).bind('resize', this._onWindowResize.bind(this));

		$(this.container).bind('fullscreenchange webkitfullscreenchange mozfullscreenchange',
			WidgetUtil.fullScreenChange.bind(this, this._onWindowResize.bind(this)));
	};

	MoveScene.prototype._initInstruction = function () {
		var _this = this;
		$(this.container).prepend('<img id="' + this._id
			+ 'img" style="width:80px;height:80px;display:none;position: absolute;margin: -40px 0 0 -40px;left: 50%;top: 50%;z-index: 3;" src="'
			+ this.bundleRoot + 'images/widget/zx.png" ondragstart="return false;"/>');
		_this._cross = document.getElementById(this._id + 'img');

		this._controlsEnabled = false;
		var havePointerLock = 'pointerLockElement' in document
			|| 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
		if(this.widget.isdebugger) {
			// 如果是调试模式不处理移动的事件，有冲突
			return ;
		}
		if (havePointerLock) {

			$(this.container).prepend('<div class="blocker" id="' + this._id
				+ 'blocker" style="display: -webkit-box;z-index: 3;">'
				+ '<div class="instructions" id="' + this._id + 'instructions">'
				+ '<span style="font-size:40px">'
				+ I18N.getString("ebi.com.esen.irpt.rp.chart.esen.module.motorroom.main.js.start","点击开始")+'</span>'
					//+ '<br/>(W, A, S, D = Move, X = FullScence, R = Respawn, MOUSE = Look around)'
				+ '</div>' +
				'</div>');

			var blocker = document.getElementById(this._id + 'blocker');
			var instructions = document.getElementById(this._id + 'instructions');
			_this.instructions = instructions;

			var element = document.body;
			var pointerlockchange = function (event) {
				if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
					_this._controlsEnabled = true;
					_this.controls.enabled = true;
					blocker.style.display = 'none';
				} else {
					_this.controls.enabled = false;
					blocker.style.display = '-webkit-box';
					blocker.style.display = '-moz-box';
					blocker.style.display = 'box';
					instructions.style.display = '';
					_this._cross.style.display = 'none';
				}
			};

			var pointerlockerror = function (event) {
				instructions.style.display = '';
				_this._cross.style.display = 'none';
			};

			// Hook pointer lock state change events
			document.addEventListener('pointerlockchange', pointerlockchange, false);
			document.addEventListener('mozpointerlockchange', pointerlockchange, false);
			document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

			document.addEventListener('pointerlockerror', pointerlockerror, false);
			document.addEventListener('mozpointerlockerror', pointerlockerror, false);
			document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

			instructions.addEventListener('click', function (event) {
				instructions.style.display = 'none';
				_this._cross.style.display = '';

				// Ask the browser to lock the pointer
				element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
				element.requestPointerLock();
			}, false);
		} else {
			this._controlsEnabled = true;
			_this._cross.style.display = '';
			// 绑定鼠标事件
			$(document).bind("mousedown.motorroom", this._onMouseDown.bind(this));
			$(document).bind("mouseup.motorroom", this._onMouseUp.bind(this));
			$(document).bind("mouseleave.motorroom", this._onMouseLeave.bind(this));
		}
	};

	MoveScene.prototype._onMouseLeave = function () {
		this.controls.enabled = false;
	};

	MoveScene.prototype._onMouseDown = function () {
		event.stopPropagation();
		this.controls.enabled = true;
	};

	MoveScene.prototype._onMouseUp = function () {
		event.stopPropagation();
		this.controls.enabled = false;
	};

	MoveScene.prototype._initMoveParam = function () {
		this._moveForward = false;
		this._moveBackward = false;
		this._moveLeft = false;
		this._moveRight = false;

		this._lockMoveForward = false;
		this._lockMoveBackward = false;
		this._lockMoveLeft = false;
		this._lockMoveRight = false;

		this._rotationMatrices = [];
		var rotationMatrixF = new THREE.Matrix4();
		rotationMatrixF.makeRotationY(0);
		this._rotationMatrices.push(rotationMatrixF); // forward direction.

		var rotationMatrixB = new THREE.Matrix4();
		rotationMatrixB.makeRotationY(180 * Math.PI / 180);
		this._rotationMatrices.push(rotationMatrixB);

		var rotationMatrixL = new THREE.Matrix4();
		rotationMatrixL.makeRotationY(90 * Math.PI / 180);
		this._rotationMatrices.push(rotationMatrixL);

		var rotationMatrixR = new THREE.Matrix4();
		rotationMatrixR.makeRotationY((360 - 90) * Math.PI / 180);
		this._rotationMatrices.push(rotationMatrixR);

		this._prevTime = performance.now();
		this._velocity = new THREE.Vector3();
	};

	MoveScene.prototype.lockMoveForward = function (lock) {
		// 消除高亮
		if(this.hightObject){
			this.hightObject.material = this.hightObject._oldmaterial;
			this.hightObject._oldmaterial.dispose();
			this.hightObject._oldmaterial = null;
			/*if(!this._highlights_visible) {
				this.hightObject.visible = false;
			}*/
			this.hightObject = null;
		}
		this._lockMoveForward = lock;
	};

	MoveScene.prototype.lockMoveBackward = function (lock) {
		this._lockMoveBackward = lock;
	};

	MoveScene.prototype.lockMoveLeft = function (lock) {
		this._lockMoveLeft = lock;
	};

	MoveScene.prototype.lockMoveRight = function (lock) {
		this._lockMoveRight = lock;
	};

	MoveScene.prototype.unlockAllDirections = function (lock) {
		this.lockMoveForward(false);
		this.lockMoveBackward(false);
		this.lockMoveLeft(false);
		this.lockMoveRight(false);
	};

	MoveScene.prototype.lockDirectionByIndex = function (index) {
		if (index == 0) {
			this.lockMoveForward(true);
		} else if (index == 1) {
			this.lockMoveBackward(true);
		} else if (index == 2) {
			this.lockMoveLeft(true);
		} else if (index == 3) {
			this.lockMoveRight(true);
		}
	};
	MoveScene.prototype._onKeyDown = function (event) {
		switch (event.keyCode) {
			case 38: // up
			case 87: // w
				event.preventDefault();
				this._moveForward = true;
				break;

			case 37: // left
			case 65: // a
				event.preventDefault();
				this._moveLeft = true;
				break;

			case 40: // down
			case 83: // s
				event.preventDefault();
				this._moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				event.preventDefault();
				this._moveRight = true;
				break;

			case 82: // r
				this.wdebugger.buildPositionGui("起始位置", this.controls.getObject());
				this.wdebugger.buildRotationGui("起始方向", this.controls.getObject());
				break;
			/*case 88: // x
			 this._bgdiv.requestFullScreen();
			 this.instructions.click();
			 //this._onWindowResize();
			 break;*/
		}
	};

	MoveScene.prototype._onKeyUp = function (event) {
		switch (event.keyCode) {
			case 38: // up
			case 87: // w
				this._moveForward = false;
				break;

			case 37: // left
			case 65: // a
				this._moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				this._moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				this._moveRight = false;
				break;
		}
	};

	MoveScene.prototype._hitDetection = function () {
		this.unlockAllDirections();
		var hitObjects = [];
		var cameraDirection = this.controls.getDirection(new THREE.Vector3(0, 0, 0)).clone();

		for (var i = 0; i < 4; i++) {
			// Applying rotation for each direction:
			var direction = cameraDirection.clone();
			direction.applyMatrix4(this._rotationMatrices[i]);

			var rayCaster = new THREE.Raycaster(this.controls.getObject().position, direction);
			var intersects = rayCaster.intersectObject(this.scene, true);
			// 1000是碰撞距离
			if (intersects.length > 0) {
				var distance = intersects[0].distance;
				if(distance < this._hitdistance) {
					this.lockDirectionByIndex(i);
					hitObjects.push(intersects[0]);
				}
				if (i === 0 && distance < this._showdistance) {
					// 前方有碰撞的时候显示
					var object = intersects[0].object;
					this._showHint(object.name);
					this._hightLightObj(object.name);
				} else if (i === 0) {
					this._showHint();
				}
			}
		}

		return hitObjects;
	};

	MoveScene.prototype._move = function () {
		//collision-detection
		this._hitDetection();

		var velocity = this._velocity;
		if (this._controlsEnabled) {
			var time = performance.now();
			var delta = ( time - this._prevTime ) / 1000;

			velocity.x -= velocity.x * 10.0 * delta;
			velocity.z -= velocity.z * 10.0 * delta;

			velocity.y -= 5 * 100.0 * delta; // 100.0 = mass

			var step = this._movestep;
			if (this._moveForward && !this._lockMoveForward) {
				velocity.z -= step * delta;
			}
			if (this._moveBackward && !this._lockMoveBackward) {
				velocity.z += step * delta;
			}

			if (this._moveLeft && !this._lockMoveLeft) {
				velocity.x -= step * delta;
			}
			if (this._moveRight && !this._lockMoveRight) {
				velocity.x += step * delta;
			}

			this.controls.getObject().translateX(velocity.x * delta);
			this.controls.getObject().translateZ(velocity.z * delta);

			this._prevTime = time;
		}
	};

	MoveScene.prototype._hightLightObj = function (name){
		name = this._getDataModName(name);
		if(!name) {
			// 与数据不相关的模型，不做高亮
			return;
		}

		//name = this._getHighLightName(name);
		var object = this.root.getObjectByName(name);
		if(!object) {
			return;
		}

		if(object._oldmaterial) {
			// 已设置高亮状态的不处理
			return;
		}
		/*if(object.visible) {
			// 例如警告状态已设置高亮状态，不处理
			return;
		}
		object.visible = true;*/
		if(this.hightObject){
			if(object == this.hightObject){
				return;
			}
			this.hightObject.material = this.hightObject._oldmaterial;
			this.hightObject._oldmaterial = null;
			this.hightObject = null;
		}

		object._oldmaterial = object.material;
		object.material = this.getHightMaterial(object.material);
		this.hightObject = object;
		return;
	};

	namespace["BaseScene"] = BaseScene;
	namespace["FixedScene"] = FixedScene;
	namespace["MoveScene"] = MoveScene;
})(window);