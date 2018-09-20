package com.esen.study.window;

public class DesktopWindow {
	private final static String TITLE = "弹窗";

	public static void main(String[] args) {
		InfoUtil test = new InfoUtil();
		test.show(TITLE, "这是一个弹窗测试！");
	}

}
