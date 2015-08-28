package com.esen.study.oper;

import org.junit.Assert;
import org.junit.Test;

/**
 * 进制转换
 * @author chenlan
 */
public class TestTransfer {
	/**
	 * 10进制转2进制
	 */
	@Test
	public void testT2B() throws Exception {
		System.out.println(Integer.toBinaryString(768));
		System.out.println(Integer.toBinaryString(7936));
		System.out.println(Integer.toBinaryString(4194319));
		System.out.println(Integer.toBinaryString(4202255));
		System.out.println(Integer.toBinaryString(4195087));
		
		// 1010 | 110 = 1110
		System.err.println(Integer.toBinaryString(10|6));
		// 1010 & ~110 = 1000
		System.err.println(Integer.toBinaryString(10&~6));
		
		Assert.assertEquals(Integer.toBinaryString(4194319), Integer.toBinaryString(4202255&~7936));
		Assert.assertEquals(Integer.toBinaryString(4194319), Integer.toBinaryString(4195087&~7936));
	}
}
