package com.esen.study.asm;

import org.junit.Assert;
import org.junit.Test;
import org.ow2.jonas.asm.Type;

/**
 * ASM示例test
 * @author chenlan
 * @since 2018-12-25
 */
public class TestASM {

	/**
	 * 在Java二进制文件中使用的是JVM的内部名字，而不是我们所熟悉的以“.”分割的全限定名，
	 * 内部名字是以“/”替代“.”的全名，
	 * 例如：java.lang.String在JVM中的内部名字是java/lang/String。
	 * 在ASM中可以使用org.objectweb.asm.Type类中的静态方法getInternalName(final Class c) 来获得
	 * @throws Exception
	 */
	@Test
	public void testInternalNameTransform() throws Exception {
		Assert.assertEquals("java/lang/String", Type.getInternalName(String.class));
		Assert.assertEquals("java/lang/Integer", Type.getInternalName(Integer.class));
		Assert.assertEquals("com/esen/study/asm/TestASM", Type.getInternalName(TestASM.class));
	}
	
	/**
	 * 类型描述
	 * Java类型				JVM中的描述
	 * boolean				Z
	 * char						C
	 * byte						B
	 * short					S
	 * int						I
	 * float					F
	 * long						J
	 * double					D
	 * Object			Ljava/lang/Object;
	 * int						[I
	 * Object			[[Ljava/lang/Object;
	 */
}
