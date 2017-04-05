/**
 * Created by htso on 2016/11/25.
 * 网上拷的代码做的修改，处理星空背景
 */
(function (namespace) {
	"use strict";

	function Starry(pdom, pid) {
		this._init(pdom, pid);
		//this.animation();
	}

// 星星数量
	Starry.prototype.MAXSTARS = 100;

	Starry.prototype._init = function (pdom, pid) {
		$(pdom).prepend('<canvas id="' + pid + 'starrycanvas" class="esen3d_bg_star_canvas" style="width:100%; height:100%;"></canvas>');
		$(pdom).prepend('<div class="esen3d_bg_star"></div>');

		var canvas = document.getElementById(pid + 'starrycanvas');
		this._pid = pid;
		this._ctx = canvas.getContext('2d');

		this._w = canvas.width = pdom.offsetWidth;
		this._h = canvas.height = pdom.offsetHeight;
		//this._w = canvas.width = window.innerWidth;
		//this._h = canvas.height = window.innerHeight;

		this._hue = 217;
		this._stars = [];

		var canvas2 = document.createElement('canvas'),
			ctx2 = canvas2.getContext('2d');
		canvas2.width = 100;
		canvas2.height = 100;
		var half = canvas2.width / 2,
			gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
		gradient2.addColorStop(0.025, '#CCC');
		gradient2.addColorStop(0.1, 'hsl(' + this._hue + ', 61%, 33%)');
		gradient2.addColorStop(0.25, 'hsl(' + this._hue + ', 64%, 6%)');
		gradient2.addColorStop(1, 'transparent');

		ctx2.fillStyle = gradient2;
		ctx2.beginPath();
		ctx2.arc(half, half, half, 0, Math.PI * 2);
		ctx2.fill();

		for (var i = 0; i < this.MAXSTARS; i++) {
			var start = new Star(canvas2, this.MAXSTARS, this._ctx, this._w, this._h);
			this._stars[i] = start;
		}
		this._canvas2 = canvas2;
	};

	Starry.prototype.resize = function (container) {
		this._stars = [];
		var canvas = document.getElementById(this._pid + 'starrycanvas');

		this._w = canvas.width = container.offsetWidth;
		this._h = canvas.height = container.offsetHeight;
		for (var i = 0; i < this.MAXSTARS; i++) {
			var start = new Star(this._canvas2, this.MAXSTARS, this._ctx, this._w, this._h);
			this._stars[i] = start;
		}
	};

	Starry.prototype.animation = function () {
		this._ctx.globalCompositeOperation = 'source-over';
		this._ctx.globalAlpha = 0.5; //尾巴
		this._ctx.fillStyle = 'hsla(' + this._hue + ', 64%, 6%, 2)';
		this._ctx.fillRect(0, 0, this._w, this._h);

		this._ctx.globalCompositeOperation = 'lighter';
		for (var i = 1, l = this._stars.length; i < l; i++) {
			this._stars[i].draw();
		}
		//requestAnimationFrame(this.animation);
	};

	function Star(canvas, maxStars, ctx, w, h) {
		this._canvas = canvas;
		this._ctx = ctx;
		this.orbitRadius = this.random(this.maxOrbit(w, h));
		this.radius = this.random(60, this.orbitRadius) / 8;
		//星星大小
		this.orbitX = w / 2;
		this.orbitY = h / 2;
		this.timePassed = this.random(0, maxStars);
		this.speed = this.random(this.orbitRadius) / 500000;
		//星星移动速度
		this.alpha = this.random(2, 10) / 10;
	}

	Star.prototype.random = function (min, max) {
		if (arguments.length < 2) {
			max = min;
			min = 0;
		}

		if (min > max) {
			var hold = max;
			max = min;
			min = hold;
		}

		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	Star.prototype.maxOrbit = function (x, y) {
		var max = Math.max(x, y),
			diameter = Math.round(Math.sqrt(max * max + max * max));
		return diameter / 2;
		//星星移动范围，值越大范围越小，
	};

	Star.prototype.draw = function () {
		var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
			y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
			twinkle = this.random(10);

		if (twinkle === 1 && this.alpha > 0) {
			this.alpha -= 0.05;
		} else if (twinkle === 2 && this.alpha < 1) {
			this.alpha += 0.05;
		}

		this._ctx.globalAlpha = this.alpha;
		this._ctx.drawImage(this._canvas, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
		this.timePassed += this.speed;
	};

	namespace["Starry"] = Starry;
})(window);