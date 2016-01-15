package com.esen.study.type;

import org.junit.Assert;
import org.junit.Test;

public class TestInteger {

	@Test
	public void testStr2Int() {
		String s = "";
		Integer a = Integer.parseInt(s);
	}
	
	@Test
	public void testInterger2Str() {
		Integer i = Integer.getInteger(null);
		Assert.assertNull(i);
	}
}
