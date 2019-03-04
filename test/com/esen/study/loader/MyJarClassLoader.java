package com.esen.study.loader;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.HashMap;
import java.util.Map;

/**
 * @author chenlan
 * @since 2019年1月17日
 */
public class MyJarClassLoader extends URLClassLoader {

	// Map<String, Class> loadedClassPool = new HashMap<String, Class>();

	public MyJarClassLoader(String jarpath) {
		// 将 Parent 设置为 null
		super(new URL[] {}, null); 

		loadResource(jarpath);
	}

	@Override
	public Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
		// 首先搜索是否加载过了，加载过了直接获取
		Class claz = findLoadedClass(name);

		// 其次丢给父类加载
		try {
			if (null == claz) {
				claz = super.loadClass(name, false);
			}
		} catch (Throwable e) {
			// 异常接着往下走，不处理
		}

		// 父类加载不了的，自己加载
		try {
			if (claz == null) {
				claz = loadByCjClassLoader(name);
			}
		} catch (Throwable e) {
			// 自定义的也无法加载的情况
			throw new ClassNotFoundException(name);
		}

		if (resolve) {
			resolveClass(claz);
		}
		return claz;
	}

	/** 
	 *  
	 * 解密加载 
	 *  
	 * @param name 
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	private Class loadByCjClassLoader(String name) {
		Class claz = null;
		try {
			byte[] rawData = loadClassData(name);
			if (rawData != null) {
				// 前8位是魔数和jdk版本信息
				for (int i = 8; i < rawData.length; i++) {
					rawData[i] = (byte) (rawData[i] - 1);
				}
				claz = defineClass(name, rawData, 0, rawData.length);
			}
		} catch (Throwable e) {
			// 异常了不处理
		}
		return claz;
	}

	private byte[] loadClassData(String className) throws Exception {
		URL[] urls = getURLs();
		@SuppressWarnings("resource")
		URLClassLoader loader = new URLClassLoader(urls, Thread.currentThread().getContextClassLoader());
		InputStream is = loader.getResourceAsStream(className.replace('.', '/') + ".class");
		if (null == is) {
			return null;
		}
		try {
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			int bufferSize = 4096;
			byte[] buffer = new byte[bufferSize];
			int bytesNumRead = 0;
			while ((bytesNumRead = is.read(buffer)) != -1) {
				baos.write(buffer, 0, bytesNumRead);
			}
			return baos.toByteArray();
		} finally {
			is.close();
		}
	}

	@Override
	protected Class<?> findClass(String name) throws ClassNotFoundException {
		try {
			return super.findClass(name);
		} catch (ClassNotFoundException e) {
			return MyJarClassLoader.class.getClassLoader().loadClass(name);
		}
	}

	private void loadResource(String jarPath) {
		// 加载对jar目录下的 Jar 包
		tryLoadJarInDir(jarPath);
		// 加载jar目录下的 lib 目录下的 Jar 包
		// tryLoadJarInDir(jarPath + File.separator + "lib");
	}

	private void tryLoadJarInDir(String dirPath) {
		File jar = new File(dirPath);
		// 自动加载目录下的jar包
		if (jar.exists()) {
			if(jar.isDirectory()) {
				for (File file : jar.listFiles()) {
					if (file.isFile() && file.getName().endsWith(".jar")) {
						this.addURL(file);
						continue;
					}
				}
			} else {
				if (jar.getName().endsWith(".jar")) {
					this.addURL(jar);
				}
			}
		}
	}

	private void addURL(File file) {
		try {
			super.addURL(new URL("file", null, file.getCanonicalPath()));
		} catch (MalformedURLException e) {
			// 异常不处理
		} catch (IOException e) {
			// 异常不处理
		}
	}

}
