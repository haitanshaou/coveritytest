package com.esen.study.asm;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.ow2.jonas.asm.*;

/**
 * ASM案例
 * ASM提供了两组API：Core API 和Tree API，Core API是基于访问者模式来操作类的，而Tree是基于树节点来操作类的
 * 本类是使用ASM的CoreAPI创建一个MyClass类
 * 
 * @author chenlan
 * @since 2018-12-24
 */
public class GenerateClass {
	public void generateClass() throws InstantiationException, IllegalAccessException, SecurityException,
			NoSuchMethodException, IllegalArgumentException, InvocationTargetException {
		//方法的栈长度和本地变量表长度用户自己计算  
		ClassWriter classWriter = new ClassWriter(0);
		//Opcodes.V1_6指定类的版本  
		//Opcodes.ACC_PUBLIC表示这个类是public，  
		//Type.getInternalName(MyClass.class) 类的全限定名称  
		//第一个null位置变量定义的是泛型签名，  
		//“java/lang/Object”这个类的父类  
		//第二个null位子的变量定义的是这个类实现的接口  
		classWriter.visit(Opcodes.V1_6, Opcodes.ACC_PUBLIC, Type.getInternalName(MyClass.class), null,
				Type.getInternalName(Object.class), null);
		ClassAdapter classAdapter = new MyClassAdapter(classWriter);
		//定义name属性   
		classAdapter.visitField(Opcodes.ACC_PRIVATE, "name", Type.getDescriptor(String.class), null, null);
		//定义构造方法
		classAdapter.visitMethod(Opcodes.ACC_PUBLIC, "<init>", "()V", null, null).visitCode();
		String setMethodDesc = "(" + Type.getDescriptor(String.class) + ")V";
		//定义setName方法
		classAdapter.visitMethod(Opcodes.ACC_PUBLIC, "setName", setMethodDesc, null, null).visitCode();

		String getMethodDesc = "()" + Type.getDescriptor(String.class);
		//定义getName方法
		classAdapter.visitMethod(Opcodes.ACC_PUBLIC, "getName", getMethodDesc, null, null).visitCode();

		//生成字节码
		byte[] classFile = classWriter.toByteArray();

		//定义一个类加载器
		MyClassLoader classLoader = new MyClassLoader();
		Class clazz = classLoader.defineClassFromClassFile("com.esen.study.asm.MyClass", classFile);
		//利用反射方式，访问getName  
		Object obj = clazz.newInstance();
		Method method = clazz.getMethod("getName");
		System.out.println(obj.toString());
		System.out.println(method.invoke(obj, null));
	}

	class MyClassLoader extends ClassLoader {
		public Class defineClassFromClassFile(String className, byte[] classFile) throws ClassFormatError {
			return defineClass(className, classFile, 0, classFile.length);
		}
	}

	public static void main(String[] args) throws Exception {
		GenerateClass generateClass = new GenerateClass();
		generateClass.generateClass();
	}
}