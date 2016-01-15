package com.esen.study.date;

import java.util.Calendar;

import org.junit.Test;

import com.esen.util.StrFunc;

public class TestCalendar {

	@Test
	public void str2Cal() throws Exception {
		String c = "2015-08-29 11:29:32.0680";
		Calendar time = StrFunc.str2date(c, "yyyy-mm-dd hh:nn:ss.zzzz");
		System.out.println(StrFunc.date2str(time, "yyyy-mm-dd hh:nn:ss.zzzz"));
	}
}
