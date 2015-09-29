package com.esen.study.string;

import org.junit.Test;

import com.esen.util.ArrayFunc;

public class TestSplit {

	@Test
	public void testSplitLimit() throws Exception {
		String s = "abc;;111;666;";
		String[] s1 = s.split(";");
		String[] s2 = s.split(";", -1);
		String[] s3 = s.split(";", 3);
		
		System.out.println(s1.length);// 4
		System.out.println(ArrayFunc.array2Str(s1, '-'));// abc--111-666
		System.out.println(s2.length);// 5
		System.out.println(ArrayFunc.array2Str(s2, '-'));// abc--111-666-
		System.out.println(s3.length);// 3
		System.out.println(ArrayFunc.array2Str(s3, '-'));// abc--111;666;
	}
}
