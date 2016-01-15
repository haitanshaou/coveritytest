package com.esen.study.string;

import org.junit.Test;

public class TestValueOf {

	@Test
	public void testNull() {
		String s = String.valueOf(null);
		System.out.println(s);
	}
}
