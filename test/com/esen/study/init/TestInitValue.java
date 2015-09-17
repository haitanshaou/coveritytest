package com.esen.study.init;

import org.junit.Test;

public class TestInitValue {

	private boolean closed;

	private int i;
	
	@Test
	public void testint() {
		System.out.println(i);
	}

	@Test
	public void testboolean() {
		if (!closed) {
			System.out.println("默认值为false");
		} else {
			System.out.println("默认值为true");
		}
	}
}
