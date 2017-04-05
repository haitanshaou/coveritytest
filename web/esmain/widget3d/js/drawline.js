var svgContainer = null;

//画直线
var line1 = null;
var line2 = null;

function initSvgContainer(container) {
	svgContainer = d3.select(container).append("svg")
		.attr("width", 0)
		.attr("height", 0)
		.style("left", "0px")
		.style("top", "0px")
		.style("position", "absolute")
		.style("display", "none")
		.style("z-index", 5000);
	line1 = svgContainer.append("line");
	line2 = svgContainer.append("line");
}

function subPoint(point, sub) {
	point.x = point.x - sub.x;
	point.y = point.y - sub.y;
}

function addPoint(point, add) {
	point.x = point.x + add.x;
	point.y = point.y + add.y;
}

function showAdMessage(x, y, targetDom) {
	var offset = $(targetDom).offset();
	var dwidth = $(targetDom).width();
	var dheight = $(targetDom).height();

	if ((x < offset.left + dwidth && x >= offset.left) && ( y >= offset.top && y < offset.top + dheight)) {
		return; //选中点在DOM中
	}

	var padding = 0;

	//鼠标点
	var point1 = {x: x, y: y};
	var point3 = {x: 0, y: 0};
	var point2 = {x: 0, y: 0};

	/*
	 * 起点point1.y > offset.top + dheight || point1.y < offset.top 时
	 * point3.x = offset.left + dwidth/2;(dom的上下边中点) 
	 * 
	 */

	if (y > offset.top + dheight || y < offset.top) {
		point3.x = offset.left + dwidth / 2;
		if (y > offset.top + dheight) {
			point3.y = offset.top + dheight;
		} else {
			point3.y = offset.top;
		}
		point2.y = point1.y;

	} else {
		point3.y = offset.top + dheight / 2;
		if (x < offset.left) {
			point3.x = offset.left;
		} else {
			point3.x = offset.left + dwidth;
		}
		point2.y = point3.y;
	}
	point2.x = (Math.max(point1.x, point3.x) - Math.min(point1.x, point3.x)) / 2 + Math.min(point1.x, point3.x);

	var width = Math.abs(point1.x - point3.x);
	var height = Math.abs(point1.y - point3.y);

	var divtop = Math.min(point1.y, point3.y);
	var divleft = Math.min(point1.x, point3.x);

	subPoint(point1, {x: divleft, y: divtop});
	subPoint(point2, {x: divleft, y: divtop});
	subPoint(point3, {x: divleft, y: divtop});

	if (point1.y < 0 || point2.y < 0 || point3.y < 0 || point1.x < 0 || point2.x < 0 || point3.x < 0) {
		return;
	}

	line1.attr("x1", point1.x)
		.attr("y1", point1.y)
		.attr("x2", point2.x)
		.attr("y2", point2.y)
		.attr("stroke", "white")
		.attr("stroke-width", 2);

	line2.attr("x1", point2.x)
		.attr("y1", point2.y)
		.attr("x2", point3.x)
		.attr("y2", point3.y)
		.attr("stroke", "white")
		.attr("stroke-width", 2);

	svgContainer.style("display", "")
		.style("left", divleft + "px")
		.style("top", divtop + "px")
		.attr("width", width + padding * 2)
		.attr("height", height + padding * 2);
}

function hideAdMessage() {
	if (svgContainer) {
		svgContainer.style("display", "none");
	}
}
