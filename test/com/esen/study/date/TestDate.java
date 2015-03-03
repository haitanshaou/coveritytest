package com.esen.study.date;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import org.junit.Test;

public class TestDate {
	/**
	 * 日期格式转换
	 */
	@Test
	public void testParse() {
		// 星期二, 3 三月 2015 09:48:23 +0800
		Date now = new Date();
		SimpleDateFormat parser = new SimpleDateFormat("EEEE, d MMM yyyy HH:mm:ss Z", Locale.PRC);
		System.err.println(parser.format(now));
	}
}
