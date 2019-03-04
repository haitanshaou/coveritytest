package com.esen.study.loader;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

public class RunHello {

	public static void main(String[] args) throws Exception {
		System.out.println(System.getProperty("java.library.path") );
		System.err.println(System.getProperty("java.class.path"));
		MyJarClassLoader loader = new MyJarClassLoader(
				"D:\\esendev\\studyworkspace\\elutil\\target\\elutil-1.1.1-SNAPSHOT.jar");
		Thread.currentThread().setContextClassLoader(loader);
		Class<?> clazz = loader.loadClass("com.esen.eutil.load.Hello");
		if (null == clazz) {
			return;
		}
		Method m_addOne = clazz.getMethod("addOne", int.class);
		Constructor constructor = clazz.getConstructor();
		Object hello = constructor.newInstance();
		int addResult = (int)m_addOne.invoke(hello, 5);
		System.out.println(addResult);
		
		Method m_delOne = clazz.getMethod("delOne", String.class);
		Object delResult = m_delOne.invoke(hello, "777");
		System.out.println(delResult);
	}
}
