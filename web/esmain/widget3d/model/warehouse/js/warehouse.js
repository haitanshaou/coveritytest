/*
 * 仓库数据说明：
 * 仓房长宽高：52m*36m*8m
        传感器安装间距为长边5米，宽边6米，数量共60个
 * [{"name":"1-1","x":2.5,"y":3.0,"z":8.0},{"name":"1-2","x":2.5,"y":9.0,"z":8.0},{"name":"1-3","x":2.5,"y":15.0,"z":8.0},{"name":"1-4","x":2.5,"y":21.0,"z":8.0},{"name":"1-5","x":2.5,"y":27.0,"z":8.0},{"name":"1-6","x":2.5,"y":33.0,"z":8.0}
 * ,{"name":"1-7","x":7.5,"y":3.0,"z":8.0},{"name":"1-8","x":7.5,"y":9.0,"z":8.0},{"name":"1-9","x":7.5,"y":15.0,"z":8.0},{"name":"1-10","x":7.5,"y":21.0,"z":8.0},{"name":"1-11","x":7.5,"y":27.0,"z":8.0},{"name":"1-12","x":7.5,"y":33.0,"z":8.0}
 * ,{"name":"1-13","x":12.5,"y":3.0,"z":8.0},{"name":"1-14","x":12.5,"y":9.0,"z":8.0},{"name":"1-15","x":12.5,"y":15.0,"z":8.0},{"name":"1-16","x":12.5,"y":21.0,"z":8.0},{"name":"1-17","x":12.5,"y":27.0,"z":8.0},{"name":"1-18","x":12.5,"y":33.0,"z":8.0},{"name":"1-19","x":17.5,"y":3.0,"z":8.0},{"name":"1-20","x":17.5,"y":9.0,"z":8.0},{"name":"1-21","x":17.5,"y":15.0,"z":8.0},{"name":"1-22","x":17.5,"y":21.0,"z":8.0},{"name":"1-23","x":17.5,"y":27.0,"z":8.0},{"name":"1-24","x":17.5,"y":33.0,"z":8.0},{"name":"1-25","x":22.5,"y":3.0,"z":8.0},{"name":"1-26","x":22.5,"y":9.0,"z":8.0},{"name":"1-27","x":22.5,"y":15.0,"z":8.0},{"name":"1-28","x":22.5,"y":21.0,"z":8.0},{"name":"1-29","x":22.5,"y":27.0,"z":8.0},{"name":"1-30","x":22.5,"y":33.0,"z":8.0},{"name":"1-31","x":27.5,"y":3.0,"z":8.0},{"name":"1-32","x":27.5,"y":9.0,"z":8.0},{"name":"1-33","x":27.5,"y":15.0,"z":8.0},{"name":"1-34","x":27.5,"y":21.0,"z":8.0},{"name":"1-35","x":27.5,"y":27.0,"z":8.0},{"name":"1-36","x":27.5,"y":33.0,"z":8.0},{"name":"1-37","x":32.5,"y":3.0,"z":8.0},{"name":"1-38","x":32.5,"y":9.0,"z":8.0},{"name":"1-39","x":32.5,"y":15.0,"z":8.0},{"name":"1-40","x":32.5,"y":21.0,"z":8.0},{"name":"1-41","x":32.5,"y":27.0,"z":8.0},{"name":"1-42","x":32.5,"y":33.0,"z":8.0},{"name":"1-43","x":37.5,"y":3.0,"z":8.0},{"name":"1-44","x":37.5,"y":9.0,"z":8.0},{"name":"1-45","x":37.5,"y":15.0,"z":8.0},{"name":"1-46","x":37.5,"y":21.0,"z":8.0},{"name":"1-47","x":37.5,"y":27.0,"z":8.0},{"name":"1-48","x":37.5,"y":33.0,"z":8.0},{"name":"1-49","x":42.5,"y":3.0,"z":8.0},{"name":"1-50","x":42.5,"y":9.0,"z":8.0},{"name":"1-51","x":42.5,"y":15.0,"z":8.0},{"name":"1-52","x":42.5,"y":21.0,"z":8.0},{"name":"1-53","x":42.5,"y":27.0,"z":8.0},{"name":"1-54","x":42.5,"y":33.0,"z":8.0},{"name":"1-55","x":47.5,"y":3.0,"z":8.0},{"name":"1-56","x":47.5,"y":9.0,"z":8.0},{"name":"1-57","x":47.5,"y":15.0,"z":8.0},{"name":"1-58","x":47.5,"y":21.0,"z":8.0},{"name":"1-59","x":47.5,"y":27.0,"z":8.0},{"name":"1-60","x":47.5,"y":33.0,"z":8.0}]

	从数据推算：
	X起点为2.5，X间距5，X轴总长度52 ，X轴结束点为47.5
	Y起点为3，Y间距6，Y轴总长度36，Y轴结束点为33
 */
function WareHouse(length,width,height,xstart,xend,xstep,ystart,yend,ystep,zpoint){
	this.length = length;//长
	this.width = width;//宽
	this.height = height;//高
	this.xstart = xstart;//传感器的X起点
	this.xend = xend; //传感器的Y起点
	this.xstep = xstep;
	this.ystart = ystart;
	this.yend = yend;
	this.ystep = ystep;
	this.zpoint = zpoint;
	this._init();
}

WareHouse.prototype._init = function(){
	var rows = (this.yend - this.ystart)/this.ystep + 1;
	var cols = (this.xend - this.xstart)/this.xstep + 1;
	var xpoints = [];
	var ypoints = [];
	var xzero = - this.length / 2 + this.xstart;
	var yzero = - this.width / 2 + this.ystart;
	
	for(var x = 0;x < cols;x ++){
		xpoints.push(xzero + x * this.xstep);
	}
	
	for(var y = 0;y < rows;y ++){
		ypoints.push(yzero + y * this.ystep);
	}
	var detectors = new Object();
	var index = 0;
	for(var x = 0;x < cols; x ++ ){
		for(var y = 0;y < rows; y ++ ){
			var object = new Object();
			object.rc = y + "" + x;
			object.index = index ++;
			object.x = xzero + this.xstep * x;
			object.y = yzero + this.ystep * y;
			object.name = "1-" + (object.index + 1);
			detectors[object.rc] = object;
		}
	}
	this.detectors = detectors;
	this.rows = rows;
	this.cols = cols;
	this.xpoints = xpoints;
	this.ypoints = ypoints;
}
WareHouse.prototype.createDetector = function(geometry,material){
	var meshs = [];
	for(var r = 0;r < this.rows; r++){
		for(var c = 0;c < this.cols;c++){
			var object = this.detectors[r + "" + c];
			//数据X对应3D的X轴，数据Y对应3D的Z轴，数据Z对应3D的Y轴
			var mesh = new THREE.Mesh(geometry.clone(),material);
			mesh.position.set(object.x , this.zpoint , object.y);
			mesh.name = object.name;
			meshs.push(mesh);
		}
	}
	
	return meshs;
}

WareHouse.prototype.createFace=function(data){
	var zpoints = [];
	for(var r = 0;r < this.rows; r++){
		var rcols = [];
		for(var c = 0;c < this.cols;c++){
			var object = this.detectors[r + "" + c];
			rcols.push(data[object.index]);
		}
		zpoints.push(rcols);
	}
	//createCurvesFace(x,y,z,xstart,xend,ystart,yend,times)
	return createCurvesFace(this.xpoints,this.ypoints,zpoints,-this.length/2,this.length/2,-this.width/2,this.width/2, 5);
}

/**
 * 根据列，行，高度生成平面（非3D世界的XYZ轴）
 * @param x 列数据，一维数组
 * @param y 行数据，一维数组
 * @param z 高度，二维数组，例如：[[r1c1,r1c2,r1c3,r1c4],[r2c1,r2c2,r2c3,r2c4]] 两行四列的高度数据
 * @param times 数据点扩大的倍数
 * @returns
 */
function createCurvesFace(x,y,z,xstart,xend,ystart,yend,times){
	var points = createPoints(x,y,z,xstart,xend,ystart,yend,times);
	
	var geometry = new THREE.Geometry();

	geometry.vertices = points;
	
	
	geometry.faces = createFaces(y.length * times,x.length * times  );
	geometry.computeBoundingSphere();
	geometry.computeBoundingBox ();
	var max = geometry.boundingBox.max;
	var min = geometry.boundingBox.min;
	var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
	var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
	var faces = geometry.faces;
	
	geometry.faceVertexUvs[0] = [];
	
	for (var i = 0; i < faces.length ; i++) {

	    var v1 = geometry.vertices[faces[i].a], 
	        v2 = geometry.vertices[faces[i].b], 
	        v3 = geometry.vertices[faces[i].c];

	    geometry.faceVertexUvs[0].push([
	        new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
	        new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
	        new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
	    ]);
	}

	geometry.uvsNeedUpdate = true;
	
	geometry.rotateX( - Math.PI / 2 );
	
	return geometry;
}

/**
 * 创建点
 * @times 数据点增加的倍数
 */
function createPoints(x,y,z,xstart,xend,ystart,yend,times){
	var f = interp2(x,y,z);
	
	var newx = [];
	var newy = []
	//x,y数据点，增加10倍
	var width = xend - xstart;
	var xw = width / (x.length * times - 1);
	var height = yend - ystart;
	var yw = height / (y.length * times - 1);
	for(var i = 0;i < times * x.length ;i ++){
		newx[i] = xstart + i * xw;  
	}
	
	for(var i = 0;i < times * y.length ;i ++){
		newy[i] = ystart + i * yw;  
	}
	var newz = f(newx,newy);
	
	var points = new Array();
	for(var r = 0;r < newy.length; r++){
		for(var c = 0;c < newx.length;c ++ ){
			var p = new THREE.Vector3(newx[c] , newy[r] , newz[r][c]);
			points.push(p);
		}
	}
	return points;
}

/*
 * 创建面
 */
function createFaces(rlen , clen){
	var faces = new Array();
	for(var r = 1; r < rlen ; r++){
		for(c = 1 ; c < clen ; c++){
			var index = (r-1) * clen + (c - 1);
			var f1 = new THREE.Face3(index, index + 1 , index + clen);
			var f2 = new THREE.Face3(index + 1, index + 1 + clen   , index + clen);
			faces.push(f1);
			faces.push(f2);
		}
	}
	return faces;
}

//按顺序排列的监控数据
var data1 = [2.988,5.256,2.438,1.687,5.673,2.94,4.912,5.141,4.319,4.014,3.482,2.611,2.079,5.33,5.565,3.899,7.307,6.213,3.538,6.408,4.374,2.277,2.896,4.858,1.483,5.706,6.735,5.251,2.418,6.029,2.19,5.61,6.842,7.621,5.759,6.851,4.962,7.437,3.047,7.747,2.011,1.456,2.537,5.081,5.405,5.559,6.624,5.677,3.756,4.613,3.392,6.262,2.623,1.794,4.005,3.952,5.643,5.174,3.995,4.854];
var data2 = [1.825,5.35,4.408,7.908,6.296,2.554,5.721,5.952,1.848,3.61,7.995,4.468,4.021,1.687,4.224,2.28,7.464,5.331,1.221,4.761,3.619,2.645,7.542,7.73,5.357,1.284,1.206,4.155,7.735,6.573,5.684,1.782,3.899,4.307,5.885,6.229,1.448,4.18,3.882,3.413,6.323,4.146,7.038,4.09,6.725,1.316,2.919,5.901,6.99,1.327,6.549,5.149,3.928,4.013,7.631,6.253,6.862,4.278,7.826,3.094];
var data3 = [1.825,5.35,4.408,7.908,6.296,2.554,5.721,5.952,1.848,3.61,7.995,4.468,4.021,1.687,4.224,2.28,7.464,5.331,1.221,4.761,3.619,2.645,7.542,7.73,5.357,1.284,1.206,4.155,7.735,6.573,5.684,1.782,3.899,4.307,5.885,6.229,1.448,4.18,3.882,3.413,6.323,4.146,7.038,4.09,6.725,1.316,2.919,5.901,6.99,1.327,6.549,5.149,3.928,4.013,7.631,6.253,6.862,4.278,7.826,3.094];
var data4 = [1.709,2.403,4.752,3.759,5.468,7.858,5.279,4.026,4.363,2.311,6.033,3.913,5.452,1.858,6.759,3.358,3.98,7.84,3.822,4.567,6.923,4.046,6.584,3.306,2.762,2.402,2.59,6.94,5.19,1.843,4.38,3.082,5.921,7.749,7.542,4.13,1.816,2.354,6.739,4.391,2.702,7.803,4.239,5.218,1.642,7.448,2.908,1.727,1.883,6.996,2.901,4.616,4.623,3.996,7.894,5.1,4.365,7.596,4.808,4.993];
var data5 = [7.343,2.607,5.773,6.164,1.337,5.354,2.317,4.932,6.679,6.246,3.909,6.813,2.863,5.8,4.185,3.232,6.827,2.769,5.801,5.688,7.224,7.874,2.529,5.421,1.033,1.364,2.601,5.728,7.898,6.237,7.686,7.891,7.012,7.592,4.92,5.746,2.739,1.463,5.961,5.547,5.734,6.629,4.453,3.339,4.492,2.598,5.69,3.096,2.167,7.687,7.388,7.364,2.506,5.849,1.715,5.401,7.634,5.606,3.743,6.404];





