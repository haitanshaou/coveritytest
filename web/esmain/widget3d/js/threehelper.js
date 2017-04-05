/**
 * 提供加载模型对象相关工具方法
 */
function ModelHelper(model) {
	this.model = model; // THREE.Mesh或者THREE.Group对象
	var hex = 0xff0000;
	var boxH = new THREE.BoundingBoxHelper(model, hex);// 创建BoundingBoxHelper
	this.boundingBox = boxH.box;
	this.boundingBoxHelper = boxH;
	this.update();
}

/**
 * 显示boxHelper，便于调试
 * @param parent
 */
ModelHelper.prototype.showBoxHelper = function (parent) {
	parent.add(this.boundingBoxHelper);
};

ModelHelper.prototype.update = function () {
	var boxH = this.boundingBoxHelper;
	boxH.update();
	this.md_Length = boxH.box.max.x - boxH.box.min.x; // 长
	this.md_Width = boxH.box.max.z - boxH.box.min.z;// 宽
	this.md_Height = boxH.box.max.y - boxH.box.min.y;// 高

	// 计算模型中心位置
	var cx, cy, cz;
	cx = boxH.box.min.x + this.md_Length / 2;
	cz = boxH.box.min.z + this.md_Width / 2;
	cy = boxH.box.min.y + this.md_Height / 2;

	this.center = new THREE.Vector3(cx, cy, cz);

	this.maxv = Math.max(Math.max(this.md_Length, this.md_Width), this.md_Height);
};

/**
 * 设置中心位置至原点
 * 与直接设置position为中心点的位置区别为旋转时的效果不同
 * @returns {*}
 */
ModelHelper.prototype.setCenterOrigin = function () {
	var offset = this.boundingBox.center().negate();
	this._translate(offset.x, offset.y, offset.z);
	return offset;
};

ModelHelper.prototype._translate = function (x, y, z) {
	var m1 = new THREE.Matrix4();
	m1.makeTranslation(x, y, z);
	if (this.model instanceof THREE.Group) {
		var meshs = this.model.children;
		for (var i = 0, size = meshs.length; i < size; i++) {
			meshs[i].geometry.applyMatrix(m1);
		}
	} else {
		this.model.applyMatrix(m1);
	}
};

/**
 * 厚度
 * @returns {number|*}
 */
ModelHelper.prototype.getWidth = function () {
	return this.md_Width;
};

/**
 * 高
 * @returns {number|*}
 */
ModelHelper.prototype.getHeight = function () {
	return this.md_Height;
};

/**
 * 宽
 * @returns {number|*}
 */
ModelHelper.prototype.getLength = function () {
	return this.md_Length;
};

/**
 * 获取中心点
 * @returns {THREE.Vector3|*}
 */
ModelHelper.prototype.getCenter = function () {
	return this.center;
};

/**
 * 返回照相机与场景的合适距离
 * 视野中看到的物体大小，由此参数决定，离的远，看到的物体小，离的近，到到的物体大
 */
ModelHelper.prototype.getSuitableCameraZValue = function () {
	return this.maxv * 1.5;
};

/**
 * 返回照相机与场景合适的最远距离
 * （这个算的不怎么准，用的少，因为一般可以设置的远些不影响）
 * @returns {number}
 */
ModelHelper.prototype.getSuitableCameraFarValue = function () {
	return this.maxv * 2;
};

/**
 * 关于坐标点转换工具类
 */
function VectorHelper() {
}

/**
 * 获取屏幕中的点的二维坐标
 * 这个仅为坐标系转换
 * @param {x:int,y:int}
 */
VectorHelper.getVector2InScene = function (point, dom) {
	var vector = new THREE.Vector2();
	vector.x = ( point.x / dom.offsetWidth ) * 2 - 1;
	vector.y = -( point.y / dom.offsetHeight ) * 2 + 1;
	return vector;
};

/**
 * 获得屏幕中的点在场景中的坐标
 * @param point {x:0,y:0}
 * @param camera
 * @param dom
 * @returns vector3
 */
VectorHelper.getCoordinate2InScene = function (point, camera, dom) {
	var vector = VectorHelper.getVector2InScene(point, dom);

	var v = new THREE.Vector3(vector.x, vector.y, 0);
	v.unproject(camera);
	v.sub(camera.position);
	v.normalize();
	var raycaster = new THREE.Raycaster(camera.position, v);
	var origin = raycaster.ray.origin;
	var direction = raycaster.ray.direction;
	var z = 0;
	var rv = new THREE.Vector3();
	rv.setX(origin.x - ( (origin.z - z) * direction.x / direction.z ));
	rv.setY(origin.y - ( (origin.z - z) * direction.y / direction.z ));
	return rv;
};

/**
 * 场景中的点在屏幕中的位置，返回值为{x:int,y:int}
 */
VectorHelper.getPointInScreen = function (vector3, camera, dom) {
	var vector = vector3.project(camera);

	var halfWidth = dom.offsetWidth / 2;
	var halfHeight = dom.offsetHeight / 2;

	var result = {
		x: Math.round(vector.x * halfWidth + halfWidth),
		y: Math.round(-vector.y * halfHeight + halfHeight)
	};
	return result;
};

function HtmlScreenHelper(animates, resizes, container, renderer, camera) {
	this._container = container;
	// create a new scene to hold CSS
	var cssScene = new THREE.Scene();

	var rendererCSS	= new THREE.CSS3DRenderer(container.style.zIndex || 0);
	rendererCSS.setSize(container.clientWidth, container.clientHeight);
	rendererCSS.domElement.style.position = 'absolute';
	rendererCSS.domElement.style.top = 0;
	rendererCSS.domElement.style.margin = 0;
	rendererCSS.domElement.style.padding = 0;
	//document.body.appendChild(rendererCSS.domElement);
	this._container.appendChild(rendererCSS.domElement);
	// TODO resize数组
	/*$(window).bind('resize', function () {
	 rendererCSS.setSize(container.clientWidth, container.clientHeight);
	 }.bind(this));*/
	resizes.push(function(container){
		this._rendererCSS.setSize(container.clientWidth, container.clientHeight);
	}.bind(this));

	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = 0;
	rendererCSS.domElement.appendChild(renderer.domElement);

	this._cssScene = cssScene;
	this._rendererCSS = rendererCSS;

	animates.push(function () {
		rendererCSS.render(cssScene, camera);
	});
}

/**
 * 创建IFRAME的屏幕
 * 应确保传入的plane为一个平面
 * @param renderer
 * @param scene
 * @param camera
 * @param url 要显示的URL链接
 * @param euler 平面旋转的角度（可以配置到固定XML配置文件中）
 * @param animates 每次渲染时调用的容器
 */
HtmlScreenHelper.prototype.createHtmlPlane = function (model, scene, euler, url) {
	var modelHelper = new ModelHelper(model);

	var box = modelHelper.boundingBoxHelper;

	var planeMaterial = new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0, side: THREE.DoubleSide});
	var planeWidth = modelHelper.md_Length;
	var planeHeight = modelHelper.md_Height;
	var planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
	var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
	planeMesh.position.copy(box.position);
	if (euler) {
		planeMesh.rotation.copy(euler);
	}
	planeMesh.name = model.name;
	scene.add(planeMesh);
	model.parent.remove(model);

	// create the iframe to contain webpage
	var element = document.createElement('iframe');
	// webpage to be loaded into iframe
	element.src = url;
	// width of iframe in pixels
	var elementWidth = this._container.clientWidth;
	// force iframe to have same relative dimensions as planeGeometry
	var aspectRatio = planeHeight / planeWidth;
	var elementHeight = elementWidth * aspectRatio;
	element.style.width = elementWidth + "px";
	element.style.height = elementHeight + "px";
	element.style.border = 'none';
	element.style.zIndex = (this._container.style.zIndex || 0 ) - 1;

	// create a CSS3DObject to display element
	var cssObject = new THREE.CSS3DObject(element);
	// synchronize cssObject position/rotation with planeMesh position/rotation
	cssObject.position.copy(planeMesh.position);
	cssObject.rotation.copy(planeMesh.rotation);

	cssObject.scale.set(1, 1, 1).multiplyScalar(planeWidth / elementWidth);
	this._cssScene.add(cssObject);
};