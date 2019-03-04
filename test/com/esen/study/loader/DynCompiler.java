package com.esen.study.loader;

import java.io.FileWriter;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Arrays;

import javax.tools.JavaCompiler;
import javax.tools.JavaFileManager;
import javax.tools.SimpleJavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;

import org.junit.Test;

public class DynCompiler {

	@Test
	public void test2() throws Exception {
		String str = "import com.esen.study.loader.Printer;" + "public class MyPrinter2 implements Printer {"
				+ "public void print() {" + "System.out.println(\"test2\");" + "}}";
		//生成源代码的JavaFileObject
		SimpleJavaFileObject fileObject = new JavaSourceFromString("MyPrinter2", str);
		JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
		//被修改后的JavaFileManager
		JavaFileManager fileManager = new ClassFileManager(compiler.getStandardFileManager(null, null, null));
		//执行编译
		JavaCompiler.CompilationTask task = compiler.getTask(null, fileManager, null, null, null,
				Arrays.asList(fileObject));
		task.call();
		//获得ClassLoader，加载class文件
		ClassLoader classLoader = fileManager.getClassLoader(null);
		Class printerClass = classLoader.loadClass("MyPrinter2");
		//获得实例
		Printer printer = (Printer) printerClass.newInstance();
		printer.print();
	}

	@Test
	public void test() throws Exception {
		String classPath = DynCompiler.class.getResource("/").getPath();
		//在这里我们是动态生成定义，然后写入文件。也可以直接读一个已经存在的文件
		String str = "import com.esen.study.loader.Printer;" + "public class MyPrinter1 implements Printer {"
				+ "public void print() {" + "System.out.println(\"test1\");" + "}}";
		FileWriter writer = new FileWriter(classPath + "MyPrinter1.java");
		writer.write(str);
		writer.close();
		//获得系统编译器
		JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
		StandardJavaFileManager fileManager = compiler.getStandardFileManager(null, null, null);
		//读入源文件
		Iterable fileObject = fileManager.getJavaFileObjects(classPath + "MyPrinter1.java");
		//编译
		JavaCompiler.CompilationTask task = compiler.getTask(null, fileManager, null, null, null, fileObject);
		task.call();
		fileManager.close();
		//指定class路径，默认和源代码路径一致，加载class
		URLClassLoader classLoader = new URLClassLoader(new URL[] { new URL("file:" + classPath) });
		Printer printer = (Printer) classLoader.loadClass("MyPrinter1").newInstance();
		printer.print();
	}
}
