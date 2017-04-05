package com.esen.study.regexp;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import org.junit.Assert;
import org.junit.Test;

public class testReg {
	
	@Test
	public void testgetat() throws Exception {
		String msg = "xui/xxx/third/aaa";
		Matcher m = Pattern.compile("/third/").matcher(msg);
		if(m.find()) {
			System.out.println(m.group());
		}
		
		System.out.println(msg.contains("/third/"));
	}

	@Test
	public void test1() {
		String msg = "Esensoft PetaBase";
		String key = ";P";
		String value = "ycttitter";
		msg = msg.replaceAll(key, value);
		System.out.println(msg);
	}

	@Test
	public void test2() throws Exception {
		String msg = "dfaddabdddc";
		Matcher m = Pattern.compile("(((?<!c)d)|[^d])*ab(((?<!c)d)|[^d])*").matcher(msg);
		if(m.matches()) {
			System.out.println(true);
		} else {
			System.out.println(false);
		}
		
//		System.out.println(msg.contains("/third/"));
	}
	
	@Test
	public void transtime() {
		System.out.println("20150909".replaceAll("(\\d{4})(\\d{2})(\\d{2})", "$1/$2/$3"));
	}

	@Test
	public void aboutESC() {
		System.out.println("单引号'转义'".replaceAll("'", "\\\\'"));
		System.out.println("单引号\'转义\'".replaceAll("\\\\'", "'"));
	}
	@Test
	public void caseInsensitive() {
		Pattern hexadecimal = Pattern.compile("\\b[0-9A-F]+\\b");
		Matcher hexMatcher = hexadecimal.matcher("A7 B6 c3 11 5a5 0=9");
		while (hexMatcher.find()) {
			System.out.print(hexMatcher.group() + " ");
		}
	}

	@Test
	public void replaceAllExample() {
		/**
		 * 将<ac:emoticon ac:name="smile" />换成<img src=\"images/smile.png\"></img> 的形式
		 */
		String after = "replaceAll第一个参数是正则表达式，<ac:emoticon ac:name=\"cry\" />\nreplace是不支持正则表达式的哦"
				.replaceAll("<ac:emoticon ac:name=\"([a-z\\-]*)\" />", "<img src=\"images/$1.png\"></img>");
		System.out.println(after);
	}

	@Test
	public void mul() {
		String string = "区号：\n027\n电话号码后3位：\n123";
		String ResultString = null;
		Pattern regex = Pattern.compile("^\\d+$", Pattern.MULTILINE);
		Matcher regexMatcher = regex.matcher(string);
		while (regexMatcher.find()) {
			ResultString = regexMatcher.group();
			System.out.println(ResultString);
		}
	}
	
	@Test
	public void test() {
		String value = "ad%3cfaf";
		Matcher matcher = Pattern.compile("(\"|%20%22|<|>|%3c|%3e)", Pattern.CASE_INSENSITIVE).matcher(value);
		if(matcher.find()) {
			System.out.println(matcher.start());
		}
	}

	@Test
	public void testp() {
		String s = "<p>这是第一个段落</p>之间有些其他东西<p>这是第二个段落</p>";
		Matcher regexMatcher = Pattern.compile("<p>(?>.*?</p>)", Pattern.DOTALL).matcher(s);
		while (regexMatcher.find()) {
			System.out.println(regexMatcher.group());
		}
	}
	@Test
	public void dotall() {
		String string = "前面内容省略<textarea>这里是内容\n换行了\n需要获取这标签里面的内容</textarea>后面内容略";
		String ResultString = null;
		try {
			Pattern regex = Pattern.compile(".*?<textarea>(.*?)</textarea>.*?", Pattern.DOTALL);
			Matcher regexMatcher = regex.matcher(string);
			if (regexMatcher.find()) {
				ResultString = regexMatcher.group(1);
				System.out.println(ResultString);
			} 
		} catch (PatternSyntaxException ex) {
			System.out.println("进到这里表示正则表达式写的有问题哦!");
		}
	}

	/**
	 * 名称只能字母开头，字母数字下划线
	 */
	@Test
	public void testCheckName() {
		Assert.assertTrue("tableName1_".matches("[a-zA-Z][\\w_]*"));
	}
}
