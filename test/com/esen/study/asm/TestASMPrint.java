package com.esen.study.asm;

/**
 * 测试ASM
 * @author chenlan
 * @since 2018-12-24
 */
public class TestASMPrint {

}

class Person {
	private String name;

	public void sayName() {
		// System.out.println(name);
		/*
	  Code:  
	    Stack=2, Locals=1, Args_size=1  
	    0: getstatic   #17; //Field java/lang/System.out:Ljava/io/PrintStream;  
	    3:   aload_0  
	    4:   getfield    #23; //Field name:Ljava/lang/String;  
	    7:   invokevirtual   #25; //Method java/io/PrintStream.println:(Ljava/lang/String;)V  
	    10:  return
	    */
	}
}