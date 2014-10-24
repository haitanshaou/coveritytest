package com.esen.study.regexp;

import org.junit.Assert;
import org.junit.Test;

public class testRegexp {
	@Test
	public void test1() {
		String s1 = "(5.5%,-7.7%)";
		/**
		 * 开头和结尾为圆括号或中括号，括号内为用逗号隔开的两个数字或百分数
		 * （要么都是百分数，要么都不是）
		 */
		Assert.assertTrue(s1.matches("^(\\(|\\[)(-?\\d+)(\\.\\d+)?,(-?\\d+)(\\.\\d+)?(\\)|\\])$")
				|| s1.matches("^(\\(|\\[)(-?\\d+)(\\.\\d+)?%,(-?\\d+)(\\.\\d+)?%(\\)|\\])$"));

		String s2 = "(3,6),9,(10,20]";
		Assert.assertTrue(s2.matches("^(((\\(|\\[)(-?\\d+)(\\.\\d+)?,(-?\\d+)(\\.\\d+)?(\\)|\\]))|((-?\\d+)(\\.\\d+)?))(,(((\\(|\\[)(-?\\d+)(\\.\\d+)?,(-?\\d+)(\\.\\d+)?(\\)|\\]))|((-?\\d+)(\\.\\d+)?)))*$"));

		String s3 = "2014-09-01,2014-10-22";
		Assert.assertTrue(s3.matches("^\\d{4}(\\-\\d{2}){2},\\d{4}(\\-\\d{2}){2}$"));
	}

	@Test
	public void testCN() {
		String reg = "^[^\\x00-\\xff]+$";

		String s1 = "，";
		Assert.assertTrue(s1.matches(reg));

		String s2 = ",";
		Assert.assertFalse(s2.matches(reg));

		String s3 = "❤℡";
		Assert.assertTrue(s3.matches(reg));

		String s4 = "这个是纯中文测试，纯中文";
		Assert.assertTrue(s4.matches(reg));

		String s5 = "%";
		Assert.assertFalse(s5.matches(reg));
	}

	@Test
	public void testDate() {
		String reg = "^[12]\\d{3}-((1[012])|([1-9]))-(([1-9])|([12]\\d)|(3[01]))$";
		String s1 = "2014-2-31";
		Assert.assertTrue(s1.matches(reg));
	}

	@Test
	public void testIPV6() {
		String reg = "^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))(%.+)?$";

		String s1 = "5e:0:0:0:0:0:5668:eeee";
		Assert.assertTrue(s1.matches(reg));

		String s2 = "::1:2:2:2";
		Assert.assertTrue(s2.matches(reg));

		String s3 = "5e::5668::eeee";
		Assert.assertFalse(s3.matches(reg));

		String s4 = "55555:5e:0:0:0:0:0:5668:eeee";
		Assert.assertFalse(s4.matches(reg));

		String s5 = "11:11:e:1EEE:11:11:200.200.200.200";
		Assert.assertTrue(s5.matches(reg));

		String s6 = "::EfE:120.0.0.1";
		Assert.assertTrue(s6.matches(reg));

		String s7 = "e:ee:5:e::0.0.0.254";
		Assert.assertTrue(s7.matches(reg));

		String s8 = "ee:ee::11.11.11.125";
		Assert.assertTrue(s8.matches(reg));

		String s9 = "ee:ee::11.11.11.125%adfadfas";
		Assert.assertTrue(s9.matches(reg));

		String s10 = "ee:ee::11::125";
		Assert.assertFalse(s10.matches(reg));
	}

	/**
	 * 带千分位的非负整数
	 */
	@Test
	public void testThousandsNonnegativeInteger() {
		//		String reg = "^\\d{1,3}(,\\d{3})*$";
		String reg = "^(0|[1-9]\\d{1,2}(,\\d{3})*)$";

		String s1 = "00,311,555";
		Assert.assertFalse(s1.matches(reg));

		String s2 = "10,333,444,55";
		Assert.assertFalse(s2.matches(reg));

		String s3 = "100,234,000,888";
		Assert.assertTrue(s3.matches(reg));

		String s4 = "0";
		Assert.assertTrue(s4.matches(reg));

		String s5 = "22";
		Assert.assertTrue(s5.matches(reg));

		String s6 = "123";
		Assert.assertTrue(s6.matches(reg));

		String s7 = "123,";
		Assert.assertFalse(s7.matches(reg));
	}

	/**
	 * 浮点数
	 */
	@Test
	public void testFloatingPointNumber() {
		String reg = "^-?(0|[1-9]\\d*)(\\.[\\d]+|[\\d]*)$";
		String s1 = "-0.0";
		Assert.assertTrue(s1.matches(reg));

		String s2 = "-5";
		Assert.assertTrue(s2.matches(reg));

		String s3 = "-.3";
		Assert.assertFalse(s3.matches(reg));

		String s4 = "-005.3";
		Assert.assertFalse(s4.matches(reg));

		String s5 = "-579.1245";
		Assert.assertTrue(s5.matches(reg));

		String s6 = "-333.";
		Assert.assertFalse(s6.matches(reg));

		String s7 = "579.1245";
		Assert.assertTrue(s7.matches(reg));

		String s8 = "333.";
		Assert.assertFalse(s8.matches(reg));
	}

	/**
	 * 非负浮点数
	 */
	@Test
	public void testNonnegativeFloatingPointNumber() {
		//		String reg = "^[\\d]*.?[\\d]+$";
		String reg = "^(0|[1-9]\\d*)(\\.[\\d]+|[\\d]*)$";
		String s1 = "0.0";
		Assert.assertTrue(s1.matches(reg));

		String s2 = "5";
		Assert.assertTrue(s2.matches(reg));

		String s3 = ".3";
		Assert.assertFalse(s3.matches(reg));

		String s4 = "005.3";
		Assert.assertFalse(s4.matches(reg));

		String s5 = "579.1245";
		Assert.assertTrue(s5.matches(reg));

		String s6 = "333.";
		Assert.assertFalse(s6.matches(reg));
	}

	/**
	 * 非负整数
	 */
	@Test
	public void testNonnegativeInteger() {
		String reg = "^(0|[1-9][\\d]*)$";
		String s1 = "001";
		Assert.assertFalse(s1.matches(reg));

		String s3 = "0";
		Assert.assertTrue(s3.matches(reg));

		String s2 = "890372044";
		Assert.assertTrue(s2.matches(reg));
	}
}
