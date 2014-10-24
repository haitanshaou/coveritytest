package com.esen.study.arrayStr;

import org.junit.Test;

import com.esen.util.ArrayFunc;

public class ArrayStr {

	@Test
	public void test() {
		String[] s = { "a", "b" };
		System.out.println(ArrayFunc.array2Str(s, "，"));
	}
}
