package com.esen.study.asm;

/**
 * ASM例子，创建的目标类
 * @author chenlan
 * @since 2018-12-24
 */
public class MyClass {
	private String name;

	public MyClass() {
		this.name = "Kuzury";
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
