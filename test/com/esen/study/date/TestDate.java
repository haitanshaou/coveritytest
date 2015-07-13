package com.esen.study.date;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import org.junit.Test;

import com.esen.util.StrFunc;

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
	
	@Test
	public void date2Str() {
		Date date = new Date(7 * 24L * 3600 * 1000 + System.currentTimeMillis());
		System.out.println(date);
		System.out.println(StrFunc.date2str(date, "yyyy-mm-dd"));
	}
	
	@Test
	public void dateAddday() {
		Calendar c = Calendar.getInstance();
		c.add(Calendar.DAY_OF_MONTH, 7);
		System.out.println(StrFunc.date2str(c, "yyyy-mm-dd"));
		
		c.setTimeInMillis(7 * 24L * 3600 * 1000 + System.currentTimeMillis());
		System.out.println(StrFunc.date2str(c, "yyyy-mm-dd"));
	}
}
