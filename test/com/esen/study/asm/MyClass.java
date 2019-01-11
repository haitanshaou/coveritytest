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
/*
		public class com.esen.study.asm.MyClass {
		  public com.esen.study.asm.MyClass();
		    Code:
		       0: aload_0
		       1: invokespecial #10                 // Method java/lang/Object."<init>":()V
		       4: aload_0
		       5: ldc           #12                 // String Kuzury
		       7: putfield      #14                 // Field name:Ljava/lang/String;
		      10: return
		
		  public java.lang.String getName();
		    Code:
		       0: aload_0
		       1: getfield      #14                 // Field name:Ljava/lang/String;
		       4: areturn
		
		  public void setName(java.lang.String);
		    Code:
		       0: aload_0
		       1: aload_1
		       2: putfield      #14                 // Field name:Ljava/lang/String;
		       5: return
		}
 */
