/*!
 * jqtimeline Plugin
 * http://goto.io/jqtimeline
 *
 * Copyright 2013 goto.io
 * Released under the MIT license
 *
 */
;
(function ($) {
	function jqTimeLine(element, options) {
		this._options = options;
		this.$el = $(element);
		this._id = options.id;
		// 光每次移动的距离是140
		this._focusgap = 110;
		// 光的起始位置
		this.focusstart = -18;
		this.focus = this.focusstart;
		// 分页相关
		// 每页容量
		this._pagesize = this._options.pageSize;
		// 总期数
		this._totalCount = this._options.events.length;
		// 当前页数
		this._page = 0;
		// 总页数
		this._pageCount = Math.ceil(this._totalCount / this._pagesize);

		this.init();
	};

	jqTimeLine.prototype.init = function () {
		var _this = this;
		_this._generateContainer();

	};

	jqTimeLine.prototype._generateContainer = function () {
		var _this = this;
		_this.$mainContainer = $('<div class="timeline_container" style="position:absolute;">');

		// 鼠标晃上去显示播放暂停按钮
		_this.$mainContainer.hover(function () {
				_this.$playbutton.toggle();
				/**
				 * ESENBI-7962 IE11浏览器，原创3D地图的时间轴播放暂停少了图标
				 */
				_this.$playbutton.css('display', 'inline-block');
			}, function () {
				_this.$playbutton.hide();
			}
		);

		_this.$timeline = $('<div class="timeline"></div>');
		_this.$dateline = $('<div class="date_line"></div>');
		_this.$timeline.append(_this.$dateline);

		_this.$datalineul = $('<ul class="date_line_ul"></ul>');
		_this.$dateline.append(_this.$datalineul);

		var size = _this._totalCount;
		for (var i = 0; i < size; i++) {
			var e = _this._options.events[i];
			_this._getMarkup(e, i);
		}

		_this.$mainContainer.append(_this.$timeline);

		_this._addPlayButton();

		if (size > _this._pagesize) {
			_this._addSliderButton();
		}

		_this.$el.append(_this.$mainContainer);
	};

	jqTimeLine.prototype._getMarkup = function (e, i) {
		var _this = this;

		var dateli = $('<li>'
			+ '<span class="date_mark"></span>'
			+ '<span class="date_text">' + e.date + '</span>'
			+ '</li>');
		_this.$datalineul.append(dateli);
		dateli.bind('mousedown.timelineswitchdate', function (e) {
			e.stopPropagation();
		});
		dateli.bind('click.timelineswitchdate', _this._switchdate.bind(_this, i, dateli));
	};

	jqTimeLine.prototype.switchbbq = function (index) {
		var _this = this;
		_this.$datalineul.find('li')[index].click();
	};

	jqTimeLine.prototype._switchdate = function (i, li, e) {
		e.stopPropagation();
		var _this = this;
		_this._switchPage(Math.floor(i / _this._pagesize));
		_this._changefocus(i, li, e);
	};

	jqTimeLine.prototype._changefocus = function (i, li, e) {
		var _this = this;
		_this.focus = _this.focusstart + (i % _this._pagesize) * _this._focusgap;

		if (!_this.$date_focus) {
			_this.$date_focus = $('<div class="date_focus"></div>');
			_this.$date_focus.css('left', _this.focus);
			_this.$dateline.append(_this.$date_focus);
		} else {
			_this.$date_focus.css('left', _this.focus);
		}

		if (_this._options.click) {
			_this._options.click(e, _this._options.events[i], i);
		}

		_this.$mainContainer.find('.date_select').attr('class', '');
		li.attr('class', 'date_select');
	};

	/**
	 * 报表期翻页
	 * 如果不能翻页，不显示对应按钮
	 *
	 * 单纯的翻页，每次高亮的都是第一个，数据切对应期。
	 * 多了的后面空着就空着，不用管
	 *
	 * 轮播时播到最后一个才翻页
	 * @private
	 */
	jqTimeLine.prototype._addSliderButton = function () {
		var _this = this;
		_this.$sliderbuttonpre = $('<a class="p_arrow"></a>');
		_this.$sliderbuttonpre.hide();
		_this.$dateline.append(_this.$sliderbuttonpre);
		_this.$sliderbuttonpre.bind('click.timelineprev', _this._prev.bind(_this));

		_this.$sliderbuttonnext = $('<a class="n_arrow"></a>');
		_this.$dateline.append(_this.$sliderbuttonnext);
		_this.$sliderbuttonnext.bind('click.timelinenext', _this._next.bind(_this));
	};

	jqTimeLine.prototype._switchPage = function (page) {
		var _this = this;
		_this._page = page;
		if(_this.$sliderbuttonpre) {
			if (0 === _this._page) {
				_this.$sliderbuttonpre.hide();
			} else {
				_this.$sliderbuttonpre.toggle();
				_this.$sliderbuttonpre.css('display', 'inline-block');
			}
		}

		if(_this.$sliderbuttonnext) {
			if (_this._page === _this._pageCount - 1) {
				_this.$sliderbuttonnext.hide();
			} else {
				_this.$sliderbuttonnext.toggle();
				_this.$sliderbuttonnext.css('display', 'inline-block');
			}
		}

		var left = -(this._pagesize * page) * this._focusgap;
		_this.$datalineul.css('left', left + 'px');
	};

	/**
	 * 下一页
	 * @private
	 */
	jqTimeLine.prototype._next = function () {
		var _this = this;
		_this.switchbbq((_this._page + 1) * _this._pagesize);
		/*if (_this._page === 0) {
		 // 显示上一页的翻页按钮
		 _this.$sliderbuttonpre.toggle();
		 _this.$sliderbuttonpre.css('display', 'inline-block');
		 }

		 var left = parseFloat(_this.$datalineul.css('left'));
		 left -= this._pagesize * this._focusgap;
		 _this.$datalineul.css('left', left + 'px');

		 _this._page++;
		 if (_this._page === _this._pageCount - 1) {
		 _this.$sliderbuttonnext.hide();
		 }*/
	};

	/**
	 * 上一页
	 * @private
	 */
	jqTimeLine.prototype._prev = function () {
		var _this = this;
		_this.switchbbq((_this._page - 1) * _this._pagesize);
		/*if (_this._page === _this._pageCount - 1) {
		 _this.$sliderbuttonnext.toggle();
		 _this.$sliderbuttonnext.css('display', 'inline-block');
		 }

		 var left = parseFloat(_this.$datalineul.css('left'));
		 left += this._pagesize * this._focusgap;
		 _this.$datalineul.css('left', left + 'px');

		 _this._page--;
		 if(0 === _this._page) {
		 _this.$sliderbuttonpre.hide();
		 }*/
	};

	jqTimeLine.prototype._addPlayButton = function () {
		var _this = this;
		_this._curPlay = false;
		_this.$playbutton = $('<a class="autoplay">播放</a>');
		_this.$playbutton.hide();
		_this.$playbutton.bind('mousedown.timelineplay', function (e) {
			e.stopPropagation();
		});
		_this.$playbutton.bind('click.timelineplay', _this.play.bind(_this));
		_this.$mainContainer.append(_this.$playbutton);
	};

	/**
	 * @param pause true 播放变暂停,false 暂停变播放
	 */
	jqTimeLine.prototype.switchplaybutton = function (pause) {
		var _this = this;
		if (pause) {
			// 正在播放，点击变成暂停
			_this.$playbutton.attr('class', 'autoplay');
			_this.$playbutton.html('播放');
			_this._curPlay = false;
		} else {
			// 正在暂停，点击变成播放
			_this.$playbutton.attr('class', 'pause');
			_this.$playbutton.html('暂停');
			_this._curPlay = true;
		}
	};

	jqTimeLine.prototype.play = function (e) {
		var _this = this;
		e.stopPropagation();
		if (_this._options.play) {
			_this._options.play(_this._curPlay);
		} else {
			_this.switchplaybutton(!_this._curPlay);
		}
	};

	$.fn.jqtimeline = function (options) {
		return this.each(function () {
			var element = $(this);
			if (element.data('timeline')) {
				return;
			}
			var timeline = new jqTimeLine(this, options);
			element.data('jqtimeline', timeline);
		});
	};

}(jQuery, window));