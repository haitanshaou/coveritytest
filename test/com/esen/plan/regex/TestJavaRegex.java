package com.esen.plan.regex;

import java.util.regex.Pattern;

import org.junit.Assert;
import org.junit.Test;

/**
 * java流派的正则表达式
 * @author chenlan
 */
public class TestJavaRegex {
	/*
	 * find			查找		Matcher.find()
	 * Match		匹配		String.matches() 和 Matcher.matches()
	 * Split		分隔		String.split() 和 Matcher.split()
	 * Replace	替换		String.replaceAll() 和  Matcher.replaceAll()
	 */

	@Test
	public void testSplitDot() throws Exception {
		String s = "com.esen.plan.regex";
		/*
		 * 实际是先分隔成了20个空字符串，又因limit未传参默认为0
		 * 如果 limit 为零，那么应用模式的次数不受限制，数组可以为任意长度，并且将丢弃尾部空字符串。
		 * Pattern.compile(regex).split(this, 0);
		 * Pattern.compile(regex).split(this, limit);
		 */
		String[] ss1 = s.split(".");
		Assert.assertEquals("字符串“" + s + "”被点号元字符分隔，产生的数组长度为0", 0, ss1.length);

		String[] ss2 = s.split("\\.");
		Assert.assertEquals("字符串“" + s + "”实际期望的被点号分隔效果，产生的数组长度为4", 4, ss2.length);
		
		/*
		 * 正则记号：\Q \E，用于抑制元字符
		 * \Q.\E 与  \\. 效果是一样的，好处是读起来容易理解
		 * 
		 * XXX java4和java5也支持此特性，但不推荐使用
		 * 在实现中有些bug，造成\Q\E的正则表达式匹配的与期望的不同
		 * 这些bug在java6中得到了修正
		 */
		String[] ss3 = s.split("\\Q.\\E");
		Assert.assertEquals("字符串“" + s + "”实际期望的被点号分隔效果，产生的数组长度为4", 4, ss3.length);

		/*
		 * Pattern.quote(".") 同 \\Q.\\E
		 */
		String[] ss4 = s.split(Pattern.quote("."));
		Assert.assertEquals("字符串“" + s + "”实际期望的被点号分隔效果，产生的数组长度为4", 4, ss4.length);
	}
	
	/*
	 * 匹配x或y。例如，“z|food”能匹配“z”或“food”或"zood"(此处请谨慎)。“(z|f)ood”则匹配“zood”或“food”
	 */
	
	/*
	 * 不可打印字符：
	 * \r \n \f等
	 */
	
	/*
	 * 简写：\d	\D 等
	 * 每个小写的简写字符，都拥有一个相关联的大写简写字符，其含义正好相反
	 */
	
	/*
	 * 模式，如：忽略大小写模式
	 * (?i) (?s) (?m)
	 * Pattern.CASE_INSENSITIVE
	 * javascript /i
	 */
	
	/*
	 * ^ $
	 * 定位符\A总是会匹配目标文本的最开始处，也就是在第一个字符的前面。
	 * 这也是它会匹配的唯一位置。A必须是大写。JavaScript不支持\A
	 * \Z		\z
	 */
	
	/*
	 * 量词，如：贪婪量词，懒惰量词
	 * 
	 * 最好只有当你确实想要允许出现任意字符时，才使用点号。
	 * 而在任何其他场合，都应当使用一个字符类或着是否定字符类来实现。
	 */
	
	/*
	 * 分组（jdk1.7及以上）
	 */
}
