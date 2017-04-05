(function(namespace) {
	"use strict";
	if (!window["AppletWidget"]) {
		include("esmain/widget3d/js/appletwidget.js");
	}
	if (!window["XTabCtrl"]) {
		addStyle(document, "esmain/pagedesigner/css/xtabctrl.css");
		sys.lib.include("esmain/pagedesigner/js/xtabctrl.js");
	}
	if (!window["XListBox"]) {
		sys.lib.include("xui/ctrls/xlistbox.js");
	}
	if (!window["XColorPicker"]) {
		sys.lib.include("xui/ctrls/xpicker.js");
	}
	if (!window["XEditSlider"]) {
		sys.lib.include("xui/ctrls/xslider.js");
	}

	/**
	 * 3D组件的配置对话框
	 * 
	 * @param widgetnmae
	 *            3D模型的名称
	 * @param config
	 *            后台Config.getTabs()方法返回的对象构成的JSON格式对象或者JSON格式字符串
	 * @param window
	 * @param width
	 * @param height
	 */
	// AppletWidget.ConfigDlg = function(widgetname, config, window, width, height) {
	AppletWidget.ConfigDlg = function() {
		// 记录上次访问的临时id（WidgetBI3D1_随机数）,当上次和本次不一样的时候，就要效果之前页面构造的dom
		this._preid = null;
		TopDialog.call(this, "AppletWidget.ConfigDlg",
				I18N.getString("", "配置"), null, 500, 400, "auto", false, true);
		this._doc = this.getDocument();
		this._wnd = this.getWindow();
		this._globalConfig = {};
		this._hef = new HtmlElementFactory(this._wnd);
		this._init();
	};

	_extendClass(AppletWidget.ConfigDlg, TopDialog, "AppletWidget.ConfigDlg");

	AppletWidget.ConfigDlg.EDITTYPE_INT = "int";
	AppletWidget.ConfigDlg.EDITTYPE_FLOAT = "float";

	AppletWidget.ConfigDlg.prototype._init = function() {
		var self = this;
		this.addButton(I18N.getString("ES.COMMON.CONFIRM", "确定"), null, null,
				null, true).setOnClick(function() {
			self.save();
		});
		this.addButton(I18N.getString("ES.COMMON.CANCEL", "取消")).setOnClick(
				function(p) {
					self.close();
				});
	};

	/**
	 * 设置对话框的保存事件
	 * 
	 * @param savefunc
	 */
	AppletWidget.ConfigDlg.prototype.setOnSave = function(savefunc) {
		this._finishCallback = savefunc;
	};

	/**
	 * 通过传入配置构建对话框
	 * 
	 * @param config
	 */
	AppletWidget.ConfigDlg.prototype.create = function(rid, jsonconfig) {
		TopDialog.prototype.open.call(this, false);
		this._options = jsonconfig;
		if (rid !== this.preid) {
			this.preid = rid;
			this._contentdispose();
			this._initDom();
		}
		this._initData(jsonconfig);
	};

	AppletWidget.ConfigDlg.prototype._initDom = function() {
		var options = this._options;
		var container = this.getContent();
		this._tabctrl = new XTabCtrl({
			wnd : this.wnd,
			parentElement : container,
			width : "100%",
			height : "100%",
			enableclosed : false,
			style : "gray"
		});
		
		this._tabctrl.getBodyContainer().style.padding = "0px";
		for(var i = 0, count = options.length; i < count; i++) {
			// 处理每一个tab
			var option = options[i];
			var caption = option.tab;
			var properties = option.properties;
			var index = this._tabctrl.add(caption);
			var bodyDom = this._tabctrl.getBodyDom(index);
			bodyDom.style.overflow = "auto";
			
			var tableDom = this._doc.createElement("table");
			bodyDom.appendChild(tableDom);
			
			for ( var j = 0, size = properties.length; j < size; j++) {
				// 处理tab里面的每一个property
				var property = properties[j];
				var type = property.type;

				if (type) {
					var funcName = "_create_" + type;
					if (typeof (this[funcName]) === 'function') {
						var editor = this[funcName](tableDom, property);
						if (editor) {
							this._globalConfig[editor.getName()] = editor;
//							dom[1].wtype = type;
						}
					}
				}
				
			}
		}
		// 默认显示第一个标签页
		this._tabctrl.setActive(0);
	};

	AppletWidget.ConfigDlg.prototype._initData = function (options) {
		for (var i = 0, size = options.length; i < size; i++) {
			var option = options[i];
			//加载属性列表
			var props = option.properties;
			for (var j = 0; j < props.length; j++) {
				var prop = props[j];
				var editor = this._globalConfig[prop.name];
				if (!editor || typeof (editor.setValue) !== "function") {
					continue;
				}
				editor.setValue(prop.value);
			}
		}
	};

	/**
	 * 创建tips图标
	 * @param pdom
	 * @param tips
	 */
	var _createTips = function(pdom, tips) {
		if(tips) {
			var tipsdiv = pdom.ownerDocument.createElement("img");
			tipsdiv.src = "xui/images/help.gif";
			tipsdiv.title = tips;
			tipsdiv.style.cssText += ';vertical-align: middle;';
			pdom.appendChild(tipsdiv);
		}
	};
	
	/**
	 * 创建指标类型属性
	 * @param tableDom
	 * @param json
	 */
	AppletWidget.ConfigDlg.prototype._create_zb = function(tableDom, json) {
		var r = tableDom.insertRow();
		var c1 = r.insertCell(-1);
		c1.innerHTML = json.caption;
		c1.className = 'medium_tableleft tableleft_minwidth';
		var c2 = r.insertCell(-1);
		c2.className = 'medium_tableright';
		var zbinput = this._hef.edit();
		c2.appendChild(zbinput);
		
		var pickspan;
		if(json.functionname) {
			pickspan = this._doc.createElement("span");
			// TODO 公共平台没有做小手的样式，要补一个，暂用bi的
			pickspan.className = 'group_editors_span';
			pickspan.style.cssText += "line-height:10px;";
			c2.appendChild(pickspan);
			
			$(pickspan).bind("click", this._functionname.bind(this, zbinput.id, eval(json.functionname)));
		}
		
		_createTips(c2, json.tips);

		zbinput.wtype = json.type;
		return {
			wtype : json.type,
			getDom : function() {
				return zbinput;
			},
			getName : function() {
				return json.name;
			},
			setValue : function(value) {
				zbinput.value = value || "";
			},
			getValue : function() {
				return zbinput.value;
			},
			dispose : function() {
				if(_isDom(pickspan)) {
					$(pickspan).unbind("click");
				}
			}
		};
	};

	AppletWidget.ConfigDlg.prototype._create_string = function(tableDom, json) {
		var r = tableDom.insertRow();
		var c1 = r.insertCell(-1);
		c1.innerHTML = json.caption;
		c1.className = 'medium_tableleft tableleft_minwidth';
		var c2 = r.insertCell(-1);
		c2.className = 'medium_tableright';
		var inputdom = this._hef.edit();
		c2.appendChild(inputdom);

		_createTips(c2, json.tips);

		inputdom.wtype = json.type;
		return {
			wtype : json.type,
			getDom : function() {
				return inputdom;
			},
			getName : function() {
				return json.name;
			},
			setValue : function(value) {
				inputdom.value = value || "";
			},
			getValue : function() {
				return inputdom.value;
			},
			dispose : function() {
			}
		};
	};

	AppletWidget.ConfigDlg.prototype._create_boolean = function(tableDom, json) {
		var r = tableDom.insertRow();
		var c1 = r.insertCell(-1);
		c1.innerHTML = json.caption;
		c1.className = 'medium_tableleft tableleft_minwidth';
		var c2 = r.insertCell(-1);
		c2.className = 'medium_tableright';
		var inputdom = this._hef.checkbox();
		c2.appendChild(inputdom);

		_createTips(c2, json.tips);

		inputdom.wtype = json.type;
		return {
			wtype : json.type,
			getDom : function() {
				return inputdom;
			},
			getName : function() {
				return json.name;
			},
			setValue : function(value) {
				// true or false
				inputdom.checked = value || false;
				// $(strinput).prop('checked', value);
			},
			getValue : function() {
				return inputdom.checked;
				// return $(strinput).is(':checked');
			},
			dispose : function() {
			}
		};
	};

	AppletWidget.ConfigDlg.prototype._create_text = function(tableDom, json) {
		var r = tableDom.insertRow();
		var c1 = r.insertCell(-1);
		c1.innerHTML = json.caption;
		c1.className = 'medium_tableleft tableleft_minwidth';
		var c2 = r.insertCell(-1);
		c2.className = 'medium_tableright';
		var inputdom = this._hef.textarea();
		c2.appendChild(inputdom);

		// TODO textarea的是不是也可以配拾取框处理表达式
		_createTips(c2, json.tips);

		inputdom.wtype = json.type;
		return {
			wtype : json.type,
			getDom : function() {
				return inputdom;
			},
			getName : function() {
				return json.name;
			},
			setValue : function(value) {
				inputdom.value = value || "";
			},
			getValue : function() {
				return inputdom.value;
			},
			dispose : function() {
			}
		};
	};

	AppletWidget.ConfigDlg.prototype._create_int = function(tableDom, json) {
		return this._create_number(tableDom, json, false);
	};

	AppletWidget.ConfigDlg.prototype._create_float = function(tableDom, json) {
		return this._create_number(tableDom, json, true);
	};

	AppletWidget.ConfigDlg.prototype._create_number = function(tableDom, json, isfloat) {
		var _this = this;
		var parseFunc = isfloat ? "parseFloat" : "parseInt";
		var r = tableDom.insertRow();
		var c1 = r.insertCell(-1);
		c1.innerHTML = json.caption;
		c1.className = 'medium_tableleft tableleft_minwidth';
		var c2 = r.insertCell(-1);
		c2.className = 'medium_tableright';

		var _cknum = function (evt) {
			evt.stopPropagation();
			if(isfloat) {
				var keyCode = evt.keyCode;
				var keynum = String.fromCharCode(keyCode);
				switch (keyCode) {
					case 190:
					case 110:// 小数点
						keynum = evt.shiftKey ? keynum : ".0";
						break;
					case 69:// e，直接在末尾输入e时会当成非数字类型
						keynum = keynum + 0;
						break;
				}
				return _this.checkNumber(evt, this, AppletWidget.ConfigDlg.EDITTYPE_FLOAT,
					keynum);
			} else {
				return _this._checkNumber(evt, this, AppletWidget.ConfigDlg.EDITTYPE_INT);
			}
		};

		if (json.max || json.min) {
			var r = new XEditSlider(getWndOfDom(c2), c2, 250, 15, 20, 10, 60);
			r.setMinValue(window[parseFunc](json.min, 10));
			r.setMaxValue(window[parseFunc](json.max, 10));
			if (!isfloat) {
				r.setStep(1);
			}
			var _val = window[parseFunc](json.value, 10);
			if (_val) {
				r.setPropertyValue(_val);
			}

			$(r.edit).bind('keydown.configdlg', _cknum);
			return {
				wtype : json.type,
				getDom : function() {
					return r.edit;
				},
				getName : function() {
					return json.name;
				},
				setValue : function(value) {
					r.setPropertyValue(value);
				},
				getValue : function() {
					return r.edit.value;
				},
				dispose : function() {
					r.dispose();
				}
			};
		} else {
			var inputdom = this._hef.edit();
			$(inputdom).bind('keydown.configdlg', _cknum);
			c2.appendChild(inputdom);

			return {
				wtype : json.type,
				getDom : function() {
					return inputdom;
				},
				getName : function() {
					return json.name;
				},
				setValue : function(value) {
					inputdom.value = value;
				},
				getValue : function() {
					return inputdom.value;
				},
				dispose : function() {
					$(inputdom).unbind('keydown.configdlg');
				}
			};
		}
	};

	AppletWidget.ConfigDlg.prototype._checkNumber = function(evt, dom, type, keynum, maxlength, floatlength) {
		var keyCode = evt.keyCode;
		if (typeof keynum == "undefined") {
			keynum = String.fromCharCode(keyCode);
		}
		// 火狐下的+-的keyCode和IE下的不一样
		if (!isMSIE) {
			keyCode = keyCode == 173 ? 189 : (keyCode == 61 ? 187 : keyCode);
		}
		switch (keyCode) {
			case 8:
			case 46:
			case 37:
			case 39:// 退格 删除 左移 右移
				return true;
			case 32:// 空格
				return false;
			case 189:
			case 109:// 负号
				keynum = evt.shiftKey ? keynum : "-0";
				break;
			case 187:// 正号
				keynum = evt.shiftKey ? "+0" : keynum;
				break;
			case 107:// 负号
				keynum = "+0";
				break;
			case 67:
			case 88:
			case 86:// 复制、剪切、粘贴快捷键
				if (evt.ctrlKey) {
					return true;
				}
				break;
		}
		if (keyCode >= 96 && keyCode <= 105) {
			keynum = keyCode - 96;
		}
		if (!isNaN(keynum) && keynum >= 0 && keynum <= 9 && evt.shiftKey) {
			return false;
		}
		var value = keynum;
		// 可能是同时选中几个数字进行替换
		var startIndex = _getPos(dom, "EndToStart", this._doc) != -1 ? _getPos(dom, "EndToStart", this._doc)
			: dom.selectionStart;
		var endIndex = _getPos(dom, "StartToStart", this._doc) != -1 ? _getPos(dom, "StartToStart", this._doc)
			: dom.selectionEnd;
		var domval = $(dom).val();
		if (endIndex != domval.length && value == ".0") {// 如果不在最后输入.把0去掉，以免影响小数位判断
			value = ".";
		}
		var Numval = domval.substring(0, startIndex) + "" + value
			+ domval.substring(endIndex);
		return _checkValue(type, Numval, maxlength, floatlength);
	};

	var _checkValue = function(type, Numval, maxlength, floatlength) {
		var maxVal;
		if (type == AppletWidget.ConfigDlg.EDITTYPE_INT) {
			maxVal = Math.pow(2, 31);
			if (isNaN(Numval)) {
				return false;
			} else if (Numval > maxVal - 1 || Numval < (0 - maxVal)) {
				return false;
			}
		} else {
			if (floatlength) {
				maxVal = Math.pow(10, maxlength - floatlength - 1)
					- Math.pow(10, -floatlength);
			} else {
				maxVal = Math.pow(10, maxlength) - 1;
			}
			if (isNaN(Numval)) {
				return false;
			} else if (Numval > maxVal || Numval < (0 - maxVal)) {
				return false;
			}
			Numval = Numval + "";// 控制小数位数，如果有e的话就计算，不然可以输入很多个0
			if (/e/i.test(Numval))
				Numval = eval(Numval) + "";
			if (Numval.indexOf(".") >= 0
				&& Numval.substring(Numval.indexOf(".") + 1, Numval.length).length > floatlength) {
				return false;
			}
		}
		return true;
	};

	/**
	 * 获得光标在文本中的位置，非IE下取光标位置不一样
	 */
	var _getPos = function (obj, sType, doc) {
		if (doc.selection) {
			obj.focus();
			var s = doc.selection.createRange();
			s.setEndPoint(sType, obj.createTextRange());
			return s.text.length;
		} else {
			return -1;
		}
	};

	AppletWidget.ConfigDlg.prototype._create_select = function(tableDom, json) {
		var r = tableDom.insertRow();
		var c1 = r.insertCell(-1);
		c1.innerHTML = json.caption;
		c1.className = 'medium_tableleft tableleft_minwidth';
		var c2 = r.insertCell(-1);
		c2.className = 'medium_tableright';

		var inputdom = this._hef.combobox();
		inputdom.className = "select_border";
		inputdom.style.cssText += ";width:135px;";

		c2.appendChild(inputdom);

		if(json.items) {
			for(var i = 0, size = json.items.length; i < size; i++) {
				var op = json.items[i];
				inputdom.addOption(op.value, op.caption);
			}
		}

		_createTips(c2, json.tips);

		inputdom.wtype = json.type;
		return {
			wtype : json.type,
			getDom : function() {
				return inputdom;
			},
			getName : function() {
				return json.name;
			},
			setValue : function(value) {
				value ? inputdom.setValue(value) : inputdom.value = "";
			},
			getValue : function() {
				return inputdom.getValue();
			},
			dispose : function() {
			}
		};
	};

	AppletWidget.ConfigDlg.prototype._create_line = function (tableDom, json) {
		var r = tableDom.insertRow();
		var c = r.insertCell(-1);
		c.colSpan = 2;

		var table = "<table class='info_title' cellpadding='0' cellspacing='0' width='100%' border='0'><tr>"
			+ "<td class='info_icon'><img src='esmain/acl/images/list_arrow.gif'/></td>"
			+ "<td class='info_text'>" + json.caption + "</td>"
			+ "<td width='99%'><div class='info_line'></div></td>"
			+ "</tr></table>";
		$(c).append(table);
	};

	AppletWidget.ConfigDlg.prototype._create_color = function(tableDom, json) {
		var r = tableDom.insertRow();
		var c1 = r.insertCell(-1);
		c1.innerHTML = json.caption;
		c1.className = 'medium_tableleft tableleft_minwidth';
		var c2 = r.insertCell(-1);
		c2.className = 'medium_tableright';
		var colorPic = new XColorPicker(getWndOfDom(c2), c2, json.caption);
		colorPic.setIcon("xui/images/fullcolor.gif");

		_createTips(c2, json.tips);

		return {
			wtype : json.type,
			getDom : function() {
				return colorPic;
			},
			getName : function() {
				return json.name;
			},
			setValue : function(value) {
				colorPic.setColor(value || "transparent");
			},
			getValue : function() {
				return colorPic.getColor();
			},
			dispose : function() {
			}
		};
	};

	/**
	 * 创建addtable类型属性
	 */
	AppletWidget.ConfigDlg.prototype._create_addable = function(tableDom, json) {
		var addable = new AppletWidget.ConfigDlg_addable(tableDom, json, this);
		
		return {
			wtype : json.type,
			getName : function() {
				return json.name;
			},
			setValue : addable.setValue.bind(addable),
			getValue : addable.getValue.bind(addable),
			dispose : addable.dispose.bind(addable)
		};
	};

	AppletWidget.ConfigDlg_addable_item = function(){
		this.type = null;
		this.properties = {};
		this.id = null;
		this.caption = null;
	};
	AppletWidget.ConfigDlg_addable_item.prototype.getProperty = function(property){
		return this.properties[property];
	};
	AppletWidget.ConfigDlg_addable_item.prototype.setProperty = function(name,value){
		this.properties[name] = value;
	};

	AppletWidget.ConfigDlg_addable = function(pdom, json, owner) {
		this._owner = owner;
		this._pdom = pdom;
		this._rightElements = {};
		this._lists = [];
		this._json = json;
		this._hef = new HtmlElementFactory(this._owner._wnd);
		// 左侧列表组件
		this._xlist = null;
		this._init(json);
	};

	AppletWidget.ConfigDlg_addable.prototype._init = function() {
		var json = this._json;
		var pdom = this._pdom;
		var r = pdom.insertRow();
		var c = r.insertCell(-1);
		c.colSpan = 2;
		
		var tableDom = this._hef.table();
		c.appendChild(tableDom);
		var r1 = tableDom.insertRow();
		r1.colSpan = 2;
		// 按钮行
		var c1 = r1.insertCell(-1);
		c1.style.verticalAlign = 'top';
		// 添加删除按钮
		var buttondom = this._hef.div();
		buttondom.style.cssText += ';text-align:left;padding-left:10px;';
		buttondom.innerHTML = '<div>'
			+ '<a class="icon_btn add"><i class="i_deptadd"></i></a>'
			+ '<a class="icon_btn del"><i class="i_deptremove"></i></a>';
		c1.appendChild(buttondom);

		var titledom = this._hef.div();
		titledom.style.cssText += ';text-align:right;';
		titledom.innerHTML = '<div style="display: inline-block;">'+json.caption+'</div>';
		_createTips(titledom, json.tips);
		c1.appendChild(titledom);

		//绑定添加删除事件
		$(buttondom).find(".add").bind("click",this._addItem.bind(this));
		$(buttondom).find(".del").bind("click",this._delItem.bind(this));

		var tr = tableDom.insertRow();
		// 左边元素
		var left = tr.insertCell(-1);
		this._initLeft(left, json);
		// 右边元素
		var right = tr.insertCell(-1);
		this._initRight(right, json);
	};
	
	AppletWidget.ConfigDlg_addable.prototype._initLeft = function(pdom, json) {
		var tableDom = this._hef.table();
		tableDom.style.paddingLeft = '10px';
		tableDom.style.width = '120px';
		tableDom.style.height = '180px';
		pdom.appendChild(tableDom);

		// 下方列表
		var r2 = tableDom.insertRow();
		var r2_c1 = r2.insertCell(-1);
		r2_c1.colSpan = 2;
		this._xlist = new XListBox(getWndOfDom(r2_c1), r2_c1);
		this._xlist.setOnItemSelectedEvent(this._focusItem.bind(this));
	};

	AppletWidget.ConfigDlg_addable.prototype._focusItem = function() {
		var focus = this._xlist.getFocusElement();
		//加载相关的信息,根据this.list里面的东西显示在右边，右边显示的时候根据属性名加载
		var item = focus.item;
		for(var key in item.properties){
			var editor  = this._rightElements[key];
			var value = item.getProperty(key);
			//this._owner.$setValue(domOrObject,value);
			if(!editor || typeof (editor.setValue) !== "function") {
				continue;
			}
			editor.setValue(value);
		}
	};

	AppletWidget.ConfigDlg_addable.prototype._addItem = function () {
		var item = new AppletWidget.ConfigDlg_addable_item();
		var elements = this._json.element;
		var tmp = elements[0];
		var name = tmp.name;
		item.id = "add" + bigRandom(1000);
		item.caption = item.id;
		item.setProperty(name, item.id);
		//将其他属性补齐
		for (var key in this._rightElements) {
			if (key == name) {
				continue;
			}
			item.setProperty(key, "");
		}
		this._lists.push(item);
		this._addXlist(item);
	};

	AppletWidget.ConfigDlg_addable.prototype._delItem = function() {
		var focus = this._xlist.getFocusElement();
		if(focus){
			this._lists.remove(focus.item);
			//清空改item
			this._xlist.removeElement(focus);
			if (this._xlist.getItemCount() > 0) {
				this._xlist.setFocusElement(0, true);
			} else {
				for ( var name in this._rightElements ){
					var editor = this._rightElements[name];
					if(editor && typeof (editor.setValue) === "function") {
						editor.setValue();
					}
				}
			}
		}
	};

	AppletWidget.ConfigDlg_addable.prototype._initRight = function(pdom, json) {
		//var tableDom = pdom.ownerDocument.createElement("table");
		var tableDom = this._hef.table();
		tableDom.style.width = '300px';
		tableDom.style.height = '180px';

		pdom.appendChild(tableDom);
		
		// 循环加elements
		var elements = json.element;
		for(var i = 0; i < elements.length;i++){
			var property = elements[i];
			var type = property.type;
			//根据类型生成不同的组件
			if (type) {
				var funcName = "_create_" + type;
				if (typeof (this._owner[funcName]) === 'function') {
					var editor = this._owner[funcName](tableDom, property);
					if (editor) {
						this._rightElements[editor.getName()] = editor;
						if("color" === editor.wtype) {
							editor.getDom().setOnClick(this._refreshItem.bind(this));
						} else {
							$(editor.getDom()).bind("change",this._refreshItem.bind(this));
						}
					}
				}
			}
		}
	};

	AppletWidget.ConfigDlg_addable.prototype._refreshItem = function () {
		var focus = this._xlist.getFocusElement();
		if(!focus) {
			return;
		}
		var item = focus.item;
		for (var key in item.properties) {
			var editor = this._rightElements[key];
			if (editor && typeof(editor.getValue) === "function") {
				item.setProperty(key, editor.getValue());
			}
		}
		//刷新xlist显示
		var elements = this._json.element;
		var tmp = elements[0];
		var name = tmp.name;
		var div = findFirstChildIgnoreText(focus);
		var table = findFirstChildIgnoreText(div);
		var caption = item.getProperty(name);
		table.rows[0].cells[0].title = caption;
		table.rows[0].cells[0].innerHTML = caption;
	};

	var findFirstChildIgnoreText = function (elem) {
		if (!elem) {
			return null;
		}
		var first = elem.firstChild;
		if (!first) {
			return null;
		}
		if (first.nodeType === 1) {
			return first;
		}
		return findNextIgnoreText(first);
	};

	var findNextIgnoreText = function (base) {
		if (!base) {
			return null;
		}
		var next = base.nextSibling;
		if (!next) {
			return null;
		}
		if (next.nodeType === 1) {
			return next;
		} else {
			return this.findNextIgnoreText(next);
		}
	};

	AppletWidget.ConfigDlg_addable.prototype.getValue = function() {
		var result = [];
		for(var i = 0;i< this._lists.length;i++){
			var onetmp = {};
			var tmp = this._lists[i];
			for(var key in tmp.properties){
				onetmp[key] = tmp.getProperty(key);
			}
			result.push(onetmp);
		}
		return result;
	};

	AppletWidget.ConfigDlg_addable.prototype.setValue = function (values) {
		this._lists = [];
		this._xlist.clear();
		for (var i = 0; i < values.length; i++) {
			var item = new AppletWidget.ConfigDlg_addable_item();
			var tmp = values[i];
			item.type = item.id = "add" + bigRandom(1000);
			item.caption = tmp[this._json.element[0].name];
			for (var key in tmp) {
				item.setProperty(key, tmp[key]);
			}
			this._lists.push(item);
			this._addXlist(item);
		}
	};
	AppletWidget.ConfigDlg_addable.prototype._addXlist = function(item){
		var div = this._hef.div();
		div.style.overflow="hidden";
		var table = this._hef.table();
		table.className = "select_template";
		table.insertRow(-1).insertCell(0).innerHTML = item.caption;
		div.appendChild(table);
		var option = this._xlist.addDom(div, true);
		option.style.cursor = "pointer";
		option.id = item.id || "";
		option.item = item;
		this._xlist.setFocusElement(option, true);
	};

	AppletWidget.ConfigDlg_addable.prototype.dispose = function() {
		$(this._pdom).find(".add").unbind("click");
		$(this._pdom).find(".del").unbind("click");

		if(this._xlist) {
			this._xlist.dispose();
			this._xlist = null;
		}

		this._lists = [];
		//销毁右边
		for(var key in  this._rightElements){
			var editor = this._rightElements[key][1];
			if(editor && typeof (editor.dispose) === "function") {
				editor.dispose();
			}
		}
		this._pdom.innerHTML = "";
		this._pdom = null;
		this._json = null;
		this._owner = null;
		this._rightElements = {};
	};
	
	AppletWidget.ConfigDlg.prototype._functionname = function(domid, funcname) {
		var dom = document.getElementById(domid);
		var self = this;
		funcname(dom.value, function(value) {
			dom.value = value;
			self._swapLayerTop();
			// 显示对话框
			self.setVisible(true);
			self.setPosition();
		});
		// 隐藏对话框
		this.setVisible(false);
	};
	
	var _isDom = function(dom){
		return dom&& typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string';
	};
	
	/**
	 * 保存页面内容
	 */
	AppletWidget.ConfigDlg.prototype.save = function () {
		//将页面存的属性进行保存
		var result = [];
		for (var i = 0, size = this._options.length; i < size; i++) {
			var option = this._options[i];
			//加载属性列表
			var props = option.properties;
			for (var j = 0, len = props.length; j < len; j++) {
				var prop = props[j];
				var onetemp = {name: "", value: ""};
				onetemp["name"] = prop.name;
				var editor = this._globalConfig[prop.name];
				if (editor && typeof(editor.getValue) === "function") {
					onetemp["value"] = editor.getValue();
					result.push(onetemp);
				}
			}
		}
		//执行回调
		this._finishCallback && this._finishCallback(JSON.stringify(result));
		//this._finishCallback&&this._finishCallback(result);
		this.close();
	};

	/**
	 * 关闭对话框
	AppletWidget.ConfigDlg.prototype.close = function() {

	};
	 */

	/**
	 * 页面内容销毁
	 */
	AppletWidget.ConfigDlg.prototype._contentdispose = function() {
		for ( var key in this._globalConfig) {
			var editor = this._globalConfig[key];
			if (editor) {
				editor.dispose();
			}
			editor = null;
			// delete this._globalConfig.keys;
		}
		this._globalConfig = {};
		if (this._tabctrl) {
			this._tabctrl.dispose();
			this._tabctrl = null;
		}
		var container = this.getContent();
		container.innerHTML = "";
	};

	/**
	 * 销毁对话框
	 */
	AppletWidget.ConfigDlg.prototype.dispose = function() {
		this._contentdispose();
		this._finishCallback = null;
		this._options = null;
		TopDialog.prototype.dispose.call(this);
	};

	/**
	 * 收集全部属性值
	AppletWidget.ConfigDlg.prototype._saveProperties = function() {

	};
	 */

	namespace["ConfigDlg"] = AppletWidget.ConfigDlg;
})(window);