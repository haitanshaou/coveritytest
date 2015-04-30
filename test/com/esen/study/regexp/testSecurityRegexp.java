package com.esen.study.regexp;

import java.io.StringWriter;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;

import com.esen.util.StrFunc;
import com.esen.util.StringMap;
import com.esen.util.security.SecurityFunc;

/**
 * 关于安全检查的正则防范
 * @author chenlan
 */
public class testSecurityRegexp {
	@Test
	public void encode() throws Exception {
		String value = "()=*-/<>";
		String encode = URLEncoder.encode(value, StrFunc.UTF8);
		System.out.println(encode);
	}
	
	@Test
	public void decode() throws Exception {
		String value = "%20%22";
		String decode = URLDecoder.decode(value, StrFunc.UTF8);
		System.out.println(decode);
	}

	@Test
	public void testtable() throws Exception {
		System.out.println(Pattern.compile("[-.$\\w]*").matcher("%^&").matches());
	}
	@Test
	public void testi() throws Exception {
		System.out.println("joIn".matches("(?-i:union|join|from|select|update|delete|where|or|and|not|between|like|is)"));
	}
	
	public static Pattern JSONSTRING = Pattern.compile("\\{(\"[^']+\":\"[^']+\",)*\"[^']+\":\"[^']+\"\\}"
			+ "|\\[(\\{(\"[^']+\":\"[^']+\",)*\"[^']+\":\"[^']+\"\\})+\\]");

	@Test
	public void testjsonreg() throws Exception {
		JSONArray ja = new JSONArray();
		JSONObject j = new JSONObject();
		j.put("fieldName", "fieldN\r\name");
		j.put("fieldAlias", "fieldAlias");
		j.put("dbType", "dbType");
		j.put("factType", "factType");
		j.put("dbLength", "1");
		j.put("factLength", "2");
		ja.put(j);
		JSONObject j2 = new JSONObject();
		j2.put("1", "v");
		ja.put(j2);
		checkParam(j.toString(), JSONSTRING, false, false);
	}
	
	@Test
	public void testclassname() throws Exception {
		checkParam("aa.bb", CLASSNAME, false, false);
	}
	@Test
	public void testSQL() throws Exception {
		String value = "Select * Join AAA";
		checkParam(value, SCRIPT_SQLINJ, true, false);
	}
  /**
   * 20121226 by kangx
   * 匹配BI系统资源ID,包含有数字,大小写字母,中繁日文,$,~,/
   * */
  public static Pattern RESID = Pattern.compile("[\\w\u0800-\u9fa5~/$\\-( |&#xA0;)]+");

	@Test
	public void testRes() throws Exception {
		String value = "3$SJWJHSLTJRU-&#xA0;G483 aaa";
		checkParam(value, RESID, false, false);
	}
	@Test
	public void test() throws Exception {
		String value = "</script";
////		checkId(value);
		checkParam(value, SCRIPT_XSS, true, true);
		//		checkUrl(value);
		
//		Pattern p = Pattern.compile("[-\\w,;]+");
//		Matcher m = p.matcher("yyyyMMdd,20070301");
//		System.out.println(m.find());
	}

	/**
	 * 外面直接获取目录的方式报出路径操纵的安全问题，设置为常量后（白名单）应该能解决问题
	 */
	public static final String JAVA_TEMP = getTempPath();

	private static String getTempPath() {
		return getSystemProperty("java.io.tmpdir", null);
	}

	public static String getSystemProperty(String key, String def) {
		return filter(System.getProperty(key, def));
	}

	/**
	 * 匹配标识符：字母、数字下划线构成
	 * edit by chenlan 2013/6/8 补充中划线（如取数名称等可能出现中划线）
	 */
	public static final Pattern IRPT_IDENTIFIER = Pattern.compile("[-\\w]+");

	/**
	 * 匹配:字母、数字、点、下划线、中线
	 * 主要用来检测类名
	 */
	public static final Pattern CLASSNAME = Pattern.compile("[-.\\w]+");

	/**
	 * 匹配任务GUID的正则表达式：{8位大写字母或数字-4位大写字母或数字-4位大写字母或数字-4位大写字母或数字-12位大写字母或数字}
	 */
	public static final Pattern IRPT_GUID = Pattern.compile("\\{[0-9A-Z]{8}(-[0-9A-Z]{4}){3}-[0-9A-Z]{12}\\}");

	/**
	 * 匹配任务ID的正则表达式：{8位大写字母或数字-4位大写字母或数字-4位大写字母或数字-4位大写字母或数字-12位大写字母或数字}.32位小写字母或者数字
	 */
	public static final Pattern IRPT_TASKID = Pattern.compile("\\{[0-9A-Z]{8}(-[0-9A-Z]{4}){3}-[0-9A-Z]{12}\\}(.[0-9a-z]{32})?");

	/**
	 * 20121224 by kangx 修改XSS匹配规则<br>
	 * 匹配带有XSS攻击脚本的正则表达式, 匹配符合*&ltscript *&gt*&lt/script&gt*的认为含有脚本攻击<br>
	 * 以前的匹配规则为"[^<>\r\n\t&\'\"\\x00]*"<br>
	 * 20121226 by kangx 增加匹配&ltimg *"/&gt<br>
	 * 增加匹配&ltiframe *"/&gt
	 * 
	 * 20130427 将匹配iframe改成匹配frame
	 * */
  public static final Pattern SCRIPT_XSS = Pattern
  		.compile(".*?((<|\\%3c).*(script.*?(>|\\%3e).*?(<|\\%3c).*?script.*?(>|\\%3e))" +
  				"|((<|\\%3c).*((img)|(frame)|(a))[\\s+]+.*?[\\/]?(>|\\%3e))|(javascript)" +
  				"|((style).*(:|%3a).*?(expression)|(\\/\\*.*\\*\\/))" +
  				"|((content-type(:|(\\%3a)).*(;|(\\%3b)))+)" +
  				"|((<|\\%3c)\\/.*(script.*?(>|\\%3e)))).*?",Pattern.CASE_INSENSITIVE);
//	public static final Pattern SCRIPT_XSS = Pattern.compile("[^<>\r\n\t&\'\"\\x00]*");
	
	/**
	 * 2013.2.3 wandj  初始化js事件的数组,后面验证时需要用到.
	 * */
	public static Pattern[] _patlist = { Pattern.compile("[\\S\\s]*onabort[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onactivate[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onafterprint[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onafterupdate[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onbeforeactivate[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onbeforecopy[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onbeforecut[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onbeforeeditfocus[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onbeforepaste[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onbeforeprint[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onbeforeunload[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onbeforeupdate[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onblur[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onbounce[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*oncellchange[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onchange[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onclick[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*oncontextmenu[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*oncontrolselect[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*oncopy[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*oncut[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*ondataavailable[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*ondataavailable[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*ondatasetchanged[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*ondatasetcomplete[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*ondblclick[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*ondeactivate[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*ondrag[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*ondragend[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*ondragenter[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*ondragleave[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*ondragover[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*ondragstart[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*ondrop[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onerror[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onerrorupdate[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onfilterchange[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onfinish[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onfocus[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onfocusin[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onfocusout[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onhelp[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onkeydown[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onkeypress[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onkeyup[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onlayoutcomplete[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onload[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onlosecapture[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onmousedown[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onmouseenter[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onmouseleave[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onmousemove[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onmouseout[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onmouseover[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onmouseup[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onmousewheel[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onmove[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onmoveend[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onmovestart[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onpaste[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onpropertychange[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onreadystatechange[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onreset[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onresize[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onresizeend[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onresizestart[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onrowenter[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onrowexit[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onrowsdelete[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onrowsinserted[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onscroll[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onselect[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onselectionchange[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onselectstart[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onstart[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onpaste[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onmovestart[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onstop[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onsubmit[\\S\\s]*", Pattern.CASE_INSENSITIVE),
			Pattern.compile("[\\S\\s]*onunload[\\S\\s]*", Pattern.CASE_INSENSITIVE) };

	/**
	 * Header Manipulation
	 * 文件头操作
	 * CR 和 LF 字符是 HTTP Response Splitting 攻击的核心，
	 * 但其他字符，如 “:” （冒号）和 “=”（等号），在响应头文件中同样具有特殊的含义。
	 * 匹配换行，
	 * 由于要检查forward路径，参数中带有=号，不检查=号
	 * 由于有的情况下是url绝对路径，有http://，带有冒号，不检测：
	 */
	public static final Pattern HEADSPLITTER = Pattern.compile("((?!(%0d|%0a)).)*", Pattern.CASE_INSENSITIVE);

	/**
	 * 带有SQL注入脚本字符的正则表达式，如果字符串中包含了至少以下的一个字符'、=、>、<、!，
	 * 或者包含了union、join、from、select、update、delete、where、or、and、not、between、like、is的SQL关键词
	 * 或者包含了 %u0027 %u02b9 %u02bc %u02c8 %u2032 %uff07 %c0%27 %c0%a7 %e0%80%a7
	 */
	public static final Pattern SCRIPT_SQLINJ = Pattern.compile("[\\s\\S]*(([\'=><!]+)|(\\s+(?-i:union|join|from|select|update|delete|where|or|and|not|between|like|is)+\\s+)|(%u0027|%u02b9|%u02bc|%u02c8|%u2032|%uff07|%c0%27|%c0%a7|%e0%80%a7))[\\s\\S]*");

	/**
	 * 匹配整数，包括正负号
	 */
	public static final Pattern INTEGER = Pattern.compile("[+-]?\\d+");

	/**
	 * 匹配数字。可以是整数也可以是浮点数。支持科学计算法。
	 */
	public static final Pattern NUMBER = Pattern.compile("[+-]?\\d+(\\.\\d+[E|e]?\\d+)?");

	/**
	 * 匹配访问的相对路径，可以../或者 字符打头，可以有后缀名，也可以没有
	 */
	public static final Pattern URLPATH = Pattern.compile("(../)*([\\d\\w_]+(/))*([\\d\\w_]+(.(\\w)+)?)");

	/**
	 * 匹配报表户类型， 0 或者 9 或者 空
	 */
	public static final Pattern IRPT_BTYPE = Pattern.compile("(0|9)?");

	/**
	 * 匹配报表户ID，字母数字下划线、中划线、点号、星号，1-32位长度
	 * 
	 * edit 2013/4/12 chenlan
	 * 匹配报表户ID、机构ID，等
	 */
	public static final Pattern IRPT_ID = Pattern.compile("[\\d\\w_\\-\\.\\*]{1,50}");

	/**
	 * 日志信息中不允许出现带有日志级别的字符串：
	 * emerg(紧急)，alert(必须立即采取措施)，crit(致命情况)，
	 * error(错误情况)，warn(警告情况)，notice(一般重要情况)，info(普通信息)，debug(调试信息)
	 * edit by chenlan 2013.4.11 
	 */
	public static final Pattern SCRIPT_LOGDESC = Pattern.compile(
			"((?!(\\[info\\]|\\[debug\\]|\\[emerg\\]|\\[alert\\]|\\[crit\\]|\\[error\\]|\\[warn\\]|\\[notice\\]))[\\S\\s])*",
			Pattern.CASE_INSENSITIVE);

	/**
	 * 匹配IP地址：字母、数字 . : 组成
	 * IRPT-10924 兼容IP v6
	 */
	public static final Pattern IRPT_IP = Pattern.compile("[\\da-zA-Z\\.:]+");

  /**
   * 2013.1.15 by wandj  增加参数分号验证.js中出现的参数不能有"或者'和;或者+组合出现,否则可以直接跟js语句执行
   * 20150423 by chenlan 增加"或者'	与		( 或 ) 或 * 或 - 或 / 或 < 或 > 或 = 组合出现
   * */
  public static Pattern InJS = Pattern.compile("[\\s\\S]*(\"|\\%27|\'|\\%22)+[\\s\\S]*" +
  		"(;|\\%3[Bb]|\\+|%2[Bb]|\\(|\\)|\\%28|\\%29|\\=|\\%3[Dd]|\\*|\\-|/|\\<|\\>|\\%2[Ff]|\\%3[Cc]|\\%3[Ee])+?[\\s\\S]*");

	private void checkId(String value) throws Exception {
		checkParam(value, IRPT_ID, false, true);
	}

	private void checkUrl(String value) throws Exception {
		int p = value.indexOf("?");
		if (p != -1) {//对于有参数的url，要拆开，把参数部分进行url编码，再检查是否合法。
			String urlPath = value.substring(0, p);
			String urlQueryStr = value.substring(p + 1);
			SecurityFunc.checkParam(null, urlPath, URLPATH, false);//先检查urlPath有没有script脚本。
			value = urlPath + "?" + new StringMap(urlQueryStr, "&", "=").toUrlParams();
		} else {
			SecurityFunc.checkParam(null, value, URLPATH, false);//先检查有没有script脚本。
		}
	}

	public static String checkParam(String value, Pattern pattern, boolean negate, boolean injs)
			throws IllegalArgumentException {
		value = filter(value);
		//判断空必须放在转换后
		if (StrFunc.isNull(value))
			return value;
		// 这里把参数名称传给异常,错误页面用该参数名称从request对象中去取值来组织与显示异常
		String errmsg = StrFunc.format2HtmlStr("'" + value + "'值不合法。");

		if (!StrFunc.isNull(value) && !(negate ^ pattern.matcher(value).matches())) {
			// 这里把参数名称传给异常,错误页面用该参数名称从request对象中去取值来组织与显示异常
			throw new IllegalArgumentException(errmsg);
		}
		if (pattern.equals(SCRIPT_XSS)) {
			if (injs) {
				checkSemicolon(value);
			}
			if (value.indexOf("\"") > -1 || value.indexOf("%22%20") > -1) {
				for (int i = 0; i < _patlist.length; i++) {
					if (_patlist[i].matcher(value).matches()) {
						// 这里把参数名称传给异常,错误页面用该参数名称从request对象中去取值来组织与显示异常
						throw new IllegalArgumentException(errmsg);
					}
				}
			}
		}
		return value;
	}

	public static String checkSemicolon(String value) {
		if (InJS.matcher(value).matches()) {
			throw new IllegalArgumentException(StrFunc.format2HtmlStr("'" + value + "'值不合法。"));
			//throw new IllegalArgumentException(I18N.getString("com.esen.util.security.SecurityFunc.java.1", UtilResourceBundleFactory.class, new Object[]{param}));
		}
		return value;
	}

	public static String filter(String value) {
		if (value == null)
			return null; //判断为空后返回value是不能通过检查的
		if ("".equals(value))
			return "";
		StringWriter sw = new StringWriter(value.length());
		sw.getBuffer().append(value);
		return sw.toString();
	}
}
