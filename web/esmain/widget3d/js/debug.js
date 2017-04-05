/**
 * 调试界面
 */
(function (namespace) {
	"use strict";

	function WidgetDebugger(objectparams, isdebug) {
		if (typeof(isdebug) == 'undefined') {
			isdebug = false;
		}
		this.objectparams = objectparams;
		this.isdebug = isdebug;
		this.gui = null;
		this.param = {};
	}
	
	WidgetDebugger.prototype.clearGui = function() {
		if (!this.isdebug) {
			return;
		}
	
		if (this.gui) {
			this.gui.destroy();
		}
	
		this.gui = new dat.GUI();
	
		this.gui.open();
	
		var obj = {save: this.saveParams.bind(this)};
	
		this.gui.add(obj, 'save');
	
	};
	
	WidgetDebugger.prototype.buildGui = function(name, object) {
		this.initObjectParams(name, object);

		if (!this.isdebug) {
			return;
		}
	
		if (object instanceof THREE.PerspectiveCamera) {
			this.buildPerspectiveCamera(name, object);
		} else if (object instanceof THREE.AmbientLight) {
			this.buildAmbientLight(name, object);
		} else if (object instanceof THREE.SpotLight) {
			this.buildSpotLightGui(name, object);
		} else if (object instanceof THREE.PointLight) {
			this.buildPointLightGui(name, object);
		} else if (object instanceof THREE.HemisphereLight) {
			this.buildHemisphereLight(name, object);
		} else if (object instanceof THREE.DirectionalLight) {
			this.buildDirectionalLight(name, object);
		} else if (object instanceof THREE.MeshPhongMaterial) {
			this.buildMeshPhongMaterial(name, object);
		}
	};
	
	/**
	 * 添加一个坐标轴，辅助用
	 */
	WidgetDebugger.prototype.buildAxis = function(object,scale) {
		if (!this.isdebug) {
			return;
		}
		var axisHelper = new THREE.AxisHelper( scale );
		object.add( axisHelper );
	};
	
	WidgetDebugger.prototype.buildRotationGui = function(name, object) {
		this.initObjectParams(name, object);
		if (!this.isdebug) {
			return;
		}
		var folder = this.gui.addFolder(name);
		this.addRotationGui(folder, name, object);
	};
	
	WidgetDebugger.prototype.buildPositionGui = function(name, object) {
		this.initObjectParams(name, object);
		if (!this.isdebug) {
			return;
		}
		var folder = this.gui.addFolder(name);
		this.addPositionGui(folder, name, object);
	};
	
	/**
	 * 应确保在摄像机设置好位置后再加入
	 * 控制器因为有的没有OrbitControl，如机房，故单独弄方法，不加到buildGui里
	 * @param name
	 * @param object
	 */
	WidgetDebugger.prototype.buildOrbitControl = function(name, object) {
		this.initObjectParams(name, object);

		var params = this.objectparams[name];
		if (params) {
			var saveval = params['minPolarAngle'];
			if(saveval){
				object.minPolarAngle = saveval / 180 * Math.PI ;
			}
			saveval = params['maxPolarAngle'];
			if(saveval){
				object.maxPolarAngle = saveval / 180 * Math.PI ;
			}
			saveval = params['minAzimuthAngle'];
			if(saveval){
				object.minAzimuthAngle = saveval / 180 * Math.PI ;
			}
			saveval = params['maxAzimuthAngle'];
			if(saveval){
				object.maxAzimuthAngle = saveval / 180 * Math.PI ;
			}
		}

		if (!this.isdebug) {
			return;
		}

		var folder = this.gui.addFolder(name);
		/**
		 * // How far you can dolly in and out ( PerspectiveCamera only )
			this.minDistance = 0;
			this.maxDistance = Infinity;
		 */
		var cobject = object.object;//一般为camera对象
		//minDistance越小，摄像头可以拉的越近，则物体越大
		this.addGui(folder, name, 'minDistance', object.minDistance, function (val) {
			object.minDistance = val;
		}, false , Math.min(cobject.position.z /10 ,10) , Math.max(cobject.position.z ,1000));
		//maxDistance越大，摄像头可以拉的越远，则物体越小
		this.addGui(folder, name, 'maxDistance', object.maxDistance, function (val) {
			object.maxDistance = val;
		}, false , Math.min(cobject.position.z ,1000) , Math.max(cobject.position.z * 10 ,1000));
		
		/**
		 * // How far you can orbit vertically, upper and lower limits.
			// Range is 0 to Math.PI radians.
			this.minPolarAngle = 0; // radians
			this.maxPolarAngle = Math.PI; // radians
			只需要限制垂直方向的控制角度，水平方向不需要限制
		*/
		this.addGui(folder, name, 'minPolarAngle', object.minPolarAngle / Math.PI * 180, function (val) {
			object.minPolarAngle = val / 180 * Math.PI ;
		}, false, 0, 180);

		this.addGui(folder, name, 'maxPolarAngle', object.maxPolarAngle / Math.PI * 180, function (val) {
			object.maxPolarAngle = val / 180 * Math.PI;
		}, false, 0, 180);
	};
	
	
	WidgetDebugger.prototype.initObjectParams = function(name, object) {
		if (!this.objectparams) {
			return;
		}
		var params = this.objectparams[name];
		if (!params) {
			return;
		}
		for (var key in params) {
			if (key.indexOf(".") > -1) {
				var keys = key.split(".");
				object[keys[0]][keys[1]] = params[key];
			} else {
				var val = object[key];
				if (val instanceof THREE.Color) {
					val.setHex(params[key]);
				} else {
					object[key] = params[key];
				}
			}
		}
	};
	
	WidgetDebugger.prototype.buildAmbientLight = function(name, object) {
		var folder = this.gui.addFolder(name);
	
		this.addGui(folder, name, 'color', object.color.getHex(), function (val) {
			object.color.setHex(val);
		}, true);
	
		//光照强度
		this.addGui(folder, name, 'intensity', object.intensity, function (val) {
			object.intensity = val;
		}, false, 0, 2);
	};
	
	WidgetDebugger.prototype.buildPointLightGui = function(name, object) {
		var folder = this.gui.addFolder(name);
	
		var obj = {};
		obj["助手"] = function () {
			var helper = object.helper;
			if (!helper) {
				helper = new THREE.PointLightHelper(object);
				object.parent.add(helper);
				object.helper = helper;
				return;
			}
			helper.visible = !helper.visible;
		};
		folder.add(obj, "助手");
	
		this.addGui(folder, name, 'color', object.color.getHex(), function (val) {
			object.color.setHex(val);
		}, true);
		//光照强度
		this.addGui(folder, name, 'intensity', object.intensity, function (val) {
			object.intensity = val;
		}, false, 0, 2);
	
		//光源能照到的距离
		this.addGui(folder, name, 'distance', object.distance, function (val) {
			object.distance = val;
		}, false, 0, 2000);
	
		//衰退
		this.addGui(folder, name, 'decay', object.decay, function (val) {
			object.decay = val;
		}, false, 1, 2);
	
		//光强
		this.addGui(folder, name, 'power', object.power, function (val) {
			object.power = val;
		}, false, 0, 4 * Math.PI);
	
		this.addPositionGui(folder, name, object);
	};
	
	WidgetDebugger.prototype.buildSpotLightGui = function(name, object) {
		var folder = this.gui.addFolder(name);
		var obj = {};
		obj["助手"] = function () {
			var helper = object.helper;
			if (!helper) {
				helper = new THREE.SpotLightHelper(object);
				object.parent.add(helper);
				object.helper = helper;
				return;
			}
			helper.visible = !helper.visible;
		};
		folder.add(obj, "助手");
	
		this.addGui(folder, name, 'color', object.color.getHex(), function (val) {
			object.color.setHex(val);
		}, true);
		//光照强度
		this.addGui(folder, name, 'intensity', object.intensity, function (val) {
			object.intensity = val;
		}, false, 0, 2);
	
		//光源能照到的距离
		this.addGui(folder, name, 'distance', object.distance, function (val) {
			object.distance = val;
		}, false, 0, 2000);
	
		this.addGui(folder, name, 'angle', object.angle, function (val) {
			object.angle = val;
		}, false, 0, Math.PI / 3);
	
		//光照区域中的半黑影，0为没有，接近1时，黑影越来越大
		this.addGui(folder, name, 'penumbra', object.penumbra, function (val) {
			object.penumbra = val;
		}, false, 0, 1);
		//衰退
		this.addGui(folder, name, 'decay', object.decay, function (val) {
			object.decay = val;
		}, false, 1, 2);
	
		this.addPositionGui(folder, name, object);
	};
	
	WidgetDebugger.prototype.buildDirectionalLight = function(name, object) {
		var folder = this.gui.addFolder(name);
	
		this.addGui(folder, name, 'color', object.color.getHex(), function (val) {
			object.color.setHex(val);
		}, true);
	
		//光照强度
		this.addGui(folder, name, 'intensity', object.intensity, function (val) {
			object.intensity = val;
		}, false, 0, 2);
	
		this.addPositionGui(folder, name, object);
	};
	
	WidgetDebugger.prototype.buildHemisphereLight = function(name, object) {
		var folder = this.gui.addFolder(name);
	
		this.addGui(folder, name, 'color', object.color.getHex(), function (val) {
			object.color.setHex(val);
		}, true);
	
		this.addGui(folder, name, 'groundColor', object.groundColor.getHex(), function (val) {
			object.groundColor.setHex(val);
		}, true);
	
		//光照强度
		this.addGui(folder, name, 'intensity', object.intensity, function (val) {
			object.intensity = val;
		}, false, 0, 2);
	};
	
	WidgetDebugger.prototype.buildPerspectiveCamera = function(name, object) {
		var folder = this.gui.addFolder(name);
	
		this.addGui(folder, name, 'fov', object.fov, function (val) {
			object.fov = val;
			object.updateProjectionMatrix();
		}, false, 30, 90);
	
		this.addGui(folder, name, 'near', object.near, function (val) {
			object.near = val;
			object.updateProjectionMatrix();
		}, false, 1, 1000);
	
		this.addGui(folder, name, 'far', object.far, function (val) {
			object.far = val;
			object.updateProjectionMatrix();
		}, false, 1000, 10000);
	
		this.addPositionGui(folder, name, object);
		/**
		 *  fov — Camera frustum vertical field of view.
		 aspect — Camera frustum aspect ratio.
		 near — Camera frustum near plane.
		 far — Camera frustum far plane.
		 */
	};
	
	WidgetDebugger.prototype.buildMeshPhongMaterial = function(name, object) {
		var folder = this.gui.addFolder(name);
		this.buildBasiceMaterial(folder, name, object);
	
		this.addGui(folder, name, 'color', object.color.getHex(), this.handleColorChange(object.color), true);
		this.addGui(folder, name, 'emissive', object.emissive.getHex(), this.handleColorChange(object.emissive), true);
		this.addGui(folder, name, 'specular', object.specular.getHex(), this.handleColorChange(object.specular), true);
	
		this.addGui(folder, name, 'shininess', object.shininess, function (val) {
			object.shininess = val;
		}, false, 0, 100);
	
		this.addGui(folder, name, 'shading', object.shading, function (val) {
			object.shading = val;
			object.needsUpdate = true;
		}, false, {
			"THREE.FlatShading": THREE.FlatShading,
			"THREE.SmoothShading": THREE.SmoothShading
		});
	};
	
	WidgetDebugger.prototype.buildBasiceMaterial = function(folder, objectname, object) {
		this.addGui(folder, objectname, 'transparent', object.transparent, function (val) {
			object.transparent = val;
		}, false);
	
		this.addGui(folder, objectname, 'opacity', object.opacity, function (val) {
			object.opacity = val;
		}, false, 0, 1.0);
	
		this.addGui(folder, objectname, 'depthTest', object.depthTest, function (val) {
			object.depthTest = val;
		}, false);
	
		this.addGui(folder, objectname, 'depthWrite', object.depthWrite, function (val) {
			object.depthWrite = val;
		}, false);
	
		this.addGui(folder, objectname, 'alphaTest', object.alphaTest, function (val) {
			object.alphaTest = val;
		}, false, 0, 1.0, 0.1);
	
		this.addGui(folder, objectname, 'overdraw', object.overdraw, function (val) {
			object.overdraw = val;
		}, false, 0.0, 5.0, 0.5);
	
	};
	
	WidgetDebugger.prototype.addRotationGui = function(folder, objectname, object) {
		if (!this.param[objectname]) {
			this.param[objectname] = {};
		}
	
		this.addGui(folder, objectname, 'rotation.x', object.rotation.x, function (val) {
			object.rotation.x = val;
		}, false, -Math.PI, Math.PI);
	
		this.addGui(folder, objectname, 'rotation.y', object.rotation.y, function (val) {
			object.rotation.y = val;
		}, false, -Math.PI, Math.PI);
	
		this.addGui(folder, objectname, 'rotation.z', object.rotation.z, function (val) {
			object.rotation.z = val;
		}, false, -Math.PI, Math.PI);
	};
	
	WidgetDebugger.prototype.addPositionGui = function(folder, objectname, object) {
		if (!this.param[objectname]) {
			this.param[objectname] = {};
		}
	
		this.addGui(folder, objectname, 'position.x', object.position.x, function (val) {
			object.position.x = val;
		}, false, -1000, 1000);
	
		this.addGui(folder, objectname, 'position.y', object.position.y, function (val) {
			object.position.y = val;
		}, false, -1000, 1000);
	
		this.addGui(folder, objectname, 'position.z', object.position.z, function (val) {
			object.position.z = val;
		}, false, -1000, 1000);
	};
	
	WidgetDebugger.prototype.addGui = function(folder, objectname, name, value, callback, isColor, min, max, step) {
		if (!this.param[objectname]) {
			this.param[objectname] = {};
		}
		this.param[objectname][name] = value;
		
		var param = this.param;
		
		var node;
		if (isColor) {
	
			node = folder.addColor(param[objectname], name).onChange(function () {
	
				callback(param[objectname][name]);
	
			});
	
		} else if (typeof value == 'object') {
	
			node = folder.add(param[objectname], name, value).onChange(function () {
	
				callback(param[objectname][name]);
	
			});
	
		} else if (typeof(min) == "undefined") {
			node = folder.add(param[objectname], name, value).onChange(function () {
	
				callback(param[objectname][name]);
	
			});
		} else {
	
			node = folder.add(param[objectname], name, min, max).onChange(function () {
	
				callback(param[objectname][name]);
	
			});
			if (step) {
				//设置都没有起效
				//node.step(step);
				//node.__impliedStep = step;
			};
	
		}
	
		return node;
	};
	
	WidgetDebugger.prototype.handleColorChange = function(color) {
	
		return function (value) {
	
			if (typeof value === "string") {
	
				value = value.replace('#', '0x');
	
			}
	
			color.setHex(value);
	
		};
	};
	
	WidgetDebugger.prototype.saveParams = function() {
		console.info(JSON.stringify(this.param));
		alert("请复制控制台信息到objectparams.js文件中");
	};
	
	namespace["WidgetDebugger"] = WidgetDebugger;
})(window);
