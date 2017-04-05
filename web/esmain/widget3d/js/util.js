/**
 * Created by htso on 2017/3/6.
 */
(function(namespace, name) {
	"use strict";

	var Util = namespace[name] = {
		/**
		 * 全屏
		 * @private
		 */
		fullScreenChange: function (onfinish) {
			if (document.fullscreenElement) {
				document.body.requestPointerLock();
			}
			//this._onWindowResize();
			if(typeof (onfinish) === "function") {
				onfinish();
			}
		},
		isFullscreen: function () {
			return document.fullscreenElement ||
				document.msFullscreenElement ||
				document.mozFullScreenElement ||
				document.webkitFullscreenElement || false;
		},
		/**
		 * 退出全屏
		 */
		exitFullScreen: function () {
			var el = document;
			var cfs = el.cancelFullScreen || el.webkitCancelFullScreen ||
				el.mozCancelFullScreen || el.exitFullScreen;

			if (typeof cfs != "undefined" && cfs) {
				cfs.call(el);
			} else if (typeof window.ActiveXObject != "undefined") {
				//for IE，这里和fullScreen相同，模拟按下F11键退出全屏
				var wscript = new ActiveXObject("WScript.Shell");
				if (wscript != null) {
					wscript.SendKeys("{F11}");
				}
			}
		},
		commafy: function (num) {
			var re = /(-?\d+)(\d{3})/;
			while (re.test(num)) {
				num = num.replace(re, "$1,$2");
			}
			return num;
		},
		/**
		 * 区间解析
		 * (,100],120,[200,)
		 * @param rangevalue
		 */
		getScopes: function (rangevalue) {
			if (!rangevalue || "" === rangevalue) {
				return;
			}
			var scopes = [];
			var numArr = rangevalue.split(",");
			for (var i = 0, size = numArr.length; i < size; i++) {
				var num = numArr[i];
				if (/^\d+$/.test(num)) {
					scopes.push(new RangeScope(parseFloat(num), parseFloat(num), true, true, false, false));
					continue;
				}
				if (/^(\(|\[)\d*$/.test(num) && /^\d*(\)|])$/.test(numArr[i + 1])) {
					var num2 = numArr[i + 1];
					var minusInfinity = /^\($/.test(num);
					var plusInfinity = /^\)$/.test(num2);
					var containMin = /^\[/.test(num);
					var containMax = /]$/.test(num2);

					var min = parseFloat(num.replace(/[^0-9]/ig, ""));
					var max = parseFloat(num2.replace(/[^0-9]/ig, ""));

					scopes.push(new RangeScope(min, max, containMin, containMax, minusInfinity, plusInfinity));
					i++;
					continue;
				}

				scopes.push({
					check : function(value) {
						return num == value;
					}
				});
			}
			return scopes;
		},
		/**
		 * 多指标的拆分，如果有宏，不进行拆分
		 * @param value
		 * @returns {Array}
		 */
		splitZbs : function(value) {
			var list = new Array();
			var stack = new Array();
			value = value || '';

			if(/<#=([^#]*#?)*#>/.test(value)) {
				list.push(value);
				return list;
			}

			if (-1 == value.indexOf('[')) {
				//ArrayFunc.array2list(value.split(","), list);
				list.push.apply(list, value.split(","));
				return list;
			}
			var startidx = 0;
			var len = value.length;
			var i = 0;
			while (i < len) {
				var c = value.charAt(i);
				if (stack.length === 0 && c == '<' && "<#=".equals(value.substring(i, i + 3))) {
					//var s = StrFunc.ensureNotStartWith(value.substring(startidx, i), ",");
					//ArrayFunc.array2list(s.split(","), list);
					list.push.apply(list, value.substring(startidx, i).split(","));

					var end = value.indexOf("#>");
					if (-1 == end) {
						//ArrayFunc.array2list(value.substring(i).split(","), list);
						list.push.apply(list, value.substring(i).split(","));
						i = len;
					} else {
						list.push(value.substring(i, end + 2));
						startidx = end + 2;
						i = end + 2;
					}
				} else if (c == '[') {
					if (stack.length === 0) {
						if (startidx != i) {
							var s = value.substring(startidx, i);
							//ArrayFunc.array2list(s.split(","), list);
							list.push.apply(list, s.split(","));
						}
						startidx = i;
					}
					stack.push(c);
					i++;
				} else if (c == ']') {
					if (stack.length !== 0) {
						stack.pop();
					}
					i++;
					if (stack.length === 0) {
						list.push(value.substring(startidx, i));
						startidx = i;
					}
				} else {
					i++;
				}
			}
			//String s = StrFunc.ensureNotStartWith(value.substring(startidx, i), ",");
			//ArrayFunc.array2list(s.split(","), list);
			list.push.apply(list, value.substring(startidx, i).split(","));

			for (var j = 0, size = list.length; j < size; j++) {
				if (list[j] == '') {
					list.splice(j, 1);
					j = j - 1;
				}
			}
			return list;
		}
	};

	/**
	 * 值域范围检查对象
	 * @param min 最小值
	 * @param max 最大值
	 * @param containMin 是否包含最小值
	 * @param containMax 是否包含最大值
	 * @param minusInfinity 负无穷
	 * @param plusInfinity 正无穷
	 * @constructor
	 */
	function RangeScope(min, max, containMin, containMax, minusInfinity, plusInfinity) {
		this.min = min;
		this.max = max;
		this.containMin = containMin;
		this.containMax = containMax;
		this.minusInfinity = minusInfinity;
		this.plusInfinity = plusInfinity;
	}

	RangeScope.prototype.check = function (value) {
		value = parseFloat(value);
		if (this.plusInfinity) {
			return this.containMin ? value >= this.min : value > this.min;
		} else if (this.minusInfinity) {
			return this.containMax ? value <= this.max : value < this.max;
		}
		if (value > this.min && value < this.max) {
			return true;
		} else {
			if ((this.containMin && value == this.min)
				|| (this.containMax && value == this.max)) {
				return true;
			}
		}
		return false;
	};
	namespace[name] = Util;
})(window, "WidgetUtil");

/*
 function checkRangeValue(){
 var range = getValueById("rangevalue");
 if(range.charAt(0)!='('&&range.charAt(0)!='['){
 return false;
 }else if(range.charAt(range.length-1)!=')'&&range.charAt(range.length-1)!=']'){
 return false;
 }else{
 var content = range.substring(1,range.length-1);
 if(isStrEmpty(content)){
 return false;
 }else{
 var numArr = content.split(",");
 if(numArr.length!=2){
 return false;
 }else{
 for(var i=0;i<2;i++){
 if(!/^(-?\d+)(\.\d+)?$/.test(numArr[i])){
 return false;
 }
 }
 var num1 = parseFloat(numArr[0]);
 var num2 = parseFloat(numArr[1]);
 if(num1>=num2){
 return false;
 }
 }
 }
 }
 return true;
 }
 */