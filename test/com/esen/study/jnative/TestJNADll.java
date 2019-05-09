package com.esen.study.jnative;

import org.junit.Test;
import org.xvolks.jnative.JNative;
import org.xvolks.jnative.Type;

import com.sun.jna.WString;

/**
 * Jnative是对JNI技术进行了封装，更加方便的让java去调用DLL。
 *	1. 下载Jnative库，其中包含JNative.jar, JNativeCPP.dll, JNativeCPP.so这三个包。 
 *			JNative.jar是需要导入到Java工程的lib下， JNativeCPP.dll文件放在jdk安装目录下，或者是user\System32目录下，或者项目根目录下。
 *	2. 将需要调用的dll动态链接库放在SYSTEM32文件夹下，或者是项目根目录下，否则会出现找不到dll文件的错误。
 *	3. 加载DLL库 ： System.loadLibrary("TranferEth");  // TransferEth为需要调用的DLL文件，只需要使用DLL文件的文件名即可。
 *	4. 调用DLL入口函数 ： JNative jnt = new JNative("TransferEth.dll", "Transfer_Ethernet");  
 *	// 参数1为需要调用的DLL文件， 参数2为需要调用的方法。
 *	5. 设置返回参数类型 ： jnt.setVal(Type.INT);
 *	6. 设置传入参数 ： jnt.setParameter(0, "TransferScale.ini");
 *	7. 执行调用 ： jnt.invoke();
 *	8. 释放资源 ： jnt.dispose();
 * @author chenlan
 * @since 2018-12-26
 */
public class TestJNADll {

	@Test
	public void test2() throws Exception {
		CLibrary.INSTANCE.printf("Hello, World/n");
	}

	@Test
	public void testDll1() throws Exception {
		int isVM = TestDll1.INSTANCE.IsVMwarePresent();
		System.out.println(isVM);
	}

	@Test
	public void test() throws Exception {
		System.setProperty("jnative.debug", "true");
		JNative jnt = new JNative("JNativeCpp.dll", "Transfer_Ethernet");
		try {
			jnt.setRetVal(Type.INT);
			jnt.setParameter(0, "TransferScale.ini");
			jnt.invoke();
		} finally {
			jnt.dispose();
		}
	}
}
