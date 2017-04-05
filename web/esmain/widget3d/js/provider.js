AppletWidget.Provider = function(properties,columns,params,datas) {
	this._properties = properties;
	this._columns = columns;
	this._params = params;
	this._datas = datas;
};

/**
 * 3D组件的配置信息 默认实现可以从模型的VFS目录中加载配置文件来获取
 * 
 * 由于产品中能够修改配置，比如BI分析表，可以每个报表进行配置 配置信息也保存在报表中，所以由产品来实现 返回格式，通过调用3D模型后台类实现统一
 */
AppletWidget.Provider.prototype.getProperties = function() {
	return this._properties;
};

/**
 * 3D组件的配置的需要从BI获取的ZB列表，返回值为数组 通过调用3D模型后台类获取
 * 
 * 例如： [ "grid1.B1$","[grid1.B1 + grid1.C1 , grid1.B2 +
 * grid1.C2]","[\"1\",\"2\"]"
 * ,"$drilldown(grid1.B1$)","$tips(grid1.B1$)","$backgroudcolor(grid1.B1$)" ]
 * 上面这个例子，返回为6个指标 其中，最后三个为特殊，取对应指标的钻取、提示、背景颜色
 */
AppletWidget.Provider.prototype.getColumns = function() {
	return this._columns;
};

/**
 * 3D组件数据信息 由产品提供 返回数据的数组，数据长度与顺序跟getZbs返回的升序与指标保持一致
 * [["110000",100,1,{url:"javascript:zr()",...},"<span>北京</span>","#FFFFFF"],
 * ["120000",120,2,{url:"javascript:zr()",...},"<span>天津</span>","#FFFFFF"] ]
 */
AppletWidget.Provider.prototype.getDatas = function() {
	//return [
	//	[100,"机柜1","","<span>主机柜1</span><br/>100",'yellow'],
	//	[55,"机柜2","","<span>主机柜2</span><br/>55",'#95fd63'],
	//	[4000,"机柜3","","<span>主机柜3</span><br/>4000",'#ff00e1'],
	//	[5000,"机柜4","","<span>主机柜4</span><br/>5000",'yellow'],
	//	['错误',"机柜5","","<span>主机柜5</span><br/>错误",'#ffffff']
	//];
	//return [
	//	["轮胎","","这个是轮胎"],
	//	["引擎盖","","这个是引擎盖"]
	//];
	//return [
	//	[100,"黑龙江","","<span>黑龙江</span><br/>100",'yellow'],
	//	[55,"西藏","","<span>西藏</span><br/>55",'#95fd63'],
	//	[4000,"新疆","","<span>新疆</span><br/>4000",'#ff00e1'],
	//	[5000,"广西","","<span>广西</span><br/>5000",'yellow'],
	//	[4500,"广东","","<span>广东</span><br/>4500",'#ffffff']
	//];

	//["E1", "北京亿信华辰软件有限责任公司", "D1$", "C1", "E1$", "D1", "F1$", "B1$",
	// "B1", "C1$", "A1$", "$drill_A1$", "$prompt_A1$", "$backgroudcolor_A1$"]

	//return [
	//		["房价", "北京亿信华辰软件有限责任公司",1,"税额",2,"增值",100,3,"aa",4,"黑龙江","","<span>黑龙江</span><br/>100",'yellow'],
	//		[,,5,,6,,55,7,,8,"西藏","","<span>西藏</span><br/>55",'#95fd63'],
	//		[,,9,,10,,4000,11,,12,"新疆","","<span>新疆</span><br/>4000",'#ff00e1'],
	//		[,,13,,14,,5000,15,,16,"广西","","<span>广西</span><br/>5000",'yellow'],
	//		[,,17,,18,,4500,19,,20,"广东","","<span>广东</span><br/>4500",'#ffffff']
	//];
	return this._datas;
};

/**
 * 3D组件中需要使用的参数值 由产品提供，返回JSON对象，属性为BI对应参数，值为返回的参数值的数组， 例如： [
 * {name:"@bbq",values:["2001","2002","2003","2004"]},
 * {name:"@cellvalue",values:["X","Y","Z"]} ]
 */
AppletWidget.Provider.prototype.getParams = function() {
	return this._params;
};
