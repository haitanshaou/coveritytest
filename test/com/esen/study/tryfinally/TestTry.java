package com.esen.study.tryfinally;

import org.junit.Test;

public class TestTry {
	@SuppressWarnings("finally")
	@Test
	public void test() throws Exception{
		try {
			System.out.println("try");
		} finally {
			try {
				System.out.println("try2");
				int i = 1/0;
			} finally {
				System.out.println("finally2");
			}
			System.out.println("333"); // 没有执行
		}
	}
}
