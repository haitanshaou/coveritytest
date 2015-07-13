package com.esen.study.regexp;

import java.io.File;
import java.io.FileInputStream;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.Test;

import com.esen.util.FileFunc;
import com.esen.util.StmFunc;
import com.esen.util.StrFunc;

/**
 * 获取路径
 * 安全改造appscan需要
 * 1、根据appscan的访问url获取.do和.jsp的路径
 * 2、根据xml获取.do的所有路径
 * 3、根据jsp文件获取所有.jsp路径
 * 
 * 最后进行比对，哪些没有跑到的
 * @author chenlan
 */
public class testPath {
	Set<String> appscanurl = new HashSet<String>();

	Set<String> urls = new HashSet<String>();
	
	private void getSurplus(String surplus) throws Exception {
		File file = new File(surplus);
		FileInputStream fis = new FileInputStream(file);
		try {
			String line;
			while (null != (line = StmFunc.readLine(fis, StrFunc.UTF8))) {
				urls.add(line);
			}
		} finally {
			fis.close();
		}
	}

	@Test
	public void testI51() throws Exception {
		String surplus = "C:/Users/Administrator/Desktop/i5.1-20150710/i51全部路径.txt";
		getSurplus(surplus);

		System.err.println("总的路径个数：" + urls.size());

		String[] fns = new String[] { "C:/Users/Administrator/Desktop/i5.1-20150710/i5.1_320000 安全报告-all.txt",
				"C:/Users/Administrator/Desktop/i5.1-20150710/i5.1_320102053490090 安全报告-all.txt",
				"C:/Users/Administrator/Desktop/i5.1-20150710/i5.1_admin 安全报告-all.txt",
				"C:/Users/Administrator/Desktop/i5.1-20150710/i51_32010201 安全报告-all.txt" };
		String[] rootPaths = new String[] { "http://172.21.50.101:8080/irpt/", "http://172.21.50.101:8080/irpt/",
				"http://172.21.50.101:8080/irpt/", "http://172.21.50.101:8080/irpt/", "http://172.21.50.101:8080/irpt/" };

		getAppScanUrl(fns, rootPaths);
		System.err.println("appscan扫的路径个数：" + appscanurl.size());
		
		urls.removeAll(appscanurl);
		System.err.println("未跑到的路径个数:"+urls.size());
		
		for (Iterator<String> iterator = urls.iterator(); iterator.hasNext();) {
			String noclover = (String) iterator.next();
			System.out.println(noclover);
		}

//		appscanurl.removeAll(urls);
//		System.err.println(appscanurl.size());
//
//		for (Iterator<String> iterator = appscanurl.iterator(); iterator.hasNext();) {
//			String clover = (String) iterator.next();
//			System.out.println(clover);
//		}
	}

	@Test
	public void testClover0507() throws Exception {
		String surplus = "C:/Users/Administrator/Desktop/征管安全覆盖/i435未跑到路径.txt";
		getSurplus(surplus);

		System.err.println("总的路径个数：" + urls.size());

		String[] fns = new String[] { "C:/Users/Administrator/Desktop/admin 安全报告-20150507-URL 包含排除的和失败的.txt" };
		String[] rootPaths = new String[] { "http://172.21.50.101:9001/" };

		getAppScanUrl(fns, rootPaths);
		System.err.println("appscan扫的路径个数：" + appscanurl.size());
		
		urls.removeAll(appscanurl);
		System.err.println("未跑到的路径个数:"+urls.size());
		
		for (Iterator<String> iterator = urls.iterator(); iterator.hasNext();) {
			String noclover = (String) iterator.next();
			System.out.println(noclover);
		}
	}

	@Test
	public void testClove() throws Exception{
//		String rootPath = "D:/esendev/securityworkspace/i_r4.3.5_zg/pages";
//		String[] fns = new String[] { "C:/Users/Administrator/Desktop/覆盖率/admin.txt",
//				"C:/Users/Administrator/Desktop/覆盖率/320000.txt", "C:/Users/Administrator/Desktop/覆盖率/320200071093224.txt",
//				"C:/Users/Administrator/Desktop/覆盖率/all.txt", "C:/Users/Administrator/Desktop/覆盖率/bj.txt" };
//		String[] rootPaths = new String[] { "http://172.21.50.101:9001/", "http://172.21.100.102:8080/i435/",
//				"http://172.21.100.102:8080/i435/", "http://172.21.100.102:8080/i435/", "http://172.21.100.102:8080/i435/" };
//		String xmlRootPath = "D:/esendev/securityworkspace/i_r4.3.5_zg/pages/WEB-INF/i-struts-config";
		
//		String rootPath = "D:/esendev/securityworkspace/bi_r3.3/web";
//		String[] fns = new String[] {"C:/Users/Administrator/Desktop/bi33-admindemo-20150430 安全报告_url.txt"};
//		String[] rootPaths = new String[]{"http://172.21.50.101:7005/bi33/"};
//		String xmlRootPath = "D:/esendev/securityworkspace/bi_r3.3/web/WEB-INF/ebi-struts-config";
		
	String rootPath = "D:/esendev/securityworkspace/i_r4.3.5_zg/pages";
	String[] fns = new String[] { "C:/Users/Administrator/Desktop/i435_admin20150430 安全报告-url.txt"};
	String[] rootPaths = new String[] { "http://172.21.100.102:8080/i435/"};
	String xmlRootPath = "D:/esendev/securityworkspace/i_r4.3.5_zg/pages/WEB-INF/i-struts-config";

		
		getAppScanUrl(fns, rootPaths);
		System.err.println("appscan扫的路径个数："+appscanurl.size());
		
		getUrlFormFile(rootPath);
//		System.err.println(urls.size());
		getUrlFromXml(xmlRootPath,false);
		System.err.println("总的路径个数："+urls.size());
		
		urls.removeAll(appscanurl);
		System.err.println("未跑到的路径个数:"+urls.size());
		
		for (Iterator<String> iterator = urls.iterator(); iterator.hasNext();) {
			String noclover = (String) iterator.next();
			System.out.println(noclover);
		}
		
//		appscanurl.removeAll(urls);
//		System.err.println(appscanurl.size());
//		
//		for (Iterator<String> iterator = appscanurl.iterator(); iterator.hasNext();) {
//			String clover = (String) iterator.next();
//			System.out.println(clover);
//		}
	}

	/**
	 * 根据文件获取jsp路径
	 */
	private void getUrlFormFile(String irootPath) throws Exception {
		findFile(irootPath, ".*\\.jsp", false, irootPath.length());
	}

	/**
	 * 从xml获取.do的路径
	 */
	private void getUrlFromXml(String xmlRootPath, boolean isbi) throws Exception {
		File dir = new File(xmlRootPath);

		File[] xmlfiles = dir.listFiles();
		for (int i = 0; i < xmlfiles.length; i++) {
			if (xmlfiles[i].getName().endsWith(".xml")) {
				Matcher m = Pattern.compile("<action[\\s\\w\\.\"=/]*?path\\s*=\\s*\"([^\"]*)\"").matcher(
						FileFunc.readFileToStr(xmlfiles[i].getAbsolutePath(), StrFunc.UTF8));
				while (m.find()) {
					urls.add(m.group(1) + (isbi?".sa":".do"));
				}
			}
		}
//		System.out.println(urls.size());
//		for (Iterator iterator = urls.iterator(); iterator.hasNext();) {
//			String string = (String) iterator.next();
//			System.out.println(string);
//		}
	}

	/**
	 * 从appscan中获取访问到的路径
	 */
	private void getAppScanUrl(String[] fns, String[] rootPaths) throws Exception {
		for (int i = 0; i < fns.length; i++) {
			Matcher m = Pattern.compile("^" + rootPaths[i] + "([^\\.]+\\.(do|sa|jsp|html)).*$", Pattern.MULTILINE).matcher(
					FileFunc.readFileToStr(fns[i], StrFunc.UTF8));
			while (m.find()) {
				appscanurl.add("/" + m.group(1));
			}
		}

//		System.out.println(appscanurl.size());
//		for (Iterator<String> iterator = appscanurl.iterator(); iterator.hasNext();) {
//			String urlpath = iterator.next();
//			System.out.println(urlpath);
//		}
	}

	/**
	 * 循环遍历文件夹，根据正则找到符合条件的文件，返回List集合，存放路径
	 * @param filePath 要遍历的文件夹路径
	 * @param regex	过滤的正则
	 * @param flag	是否包含目录，false 不包含目录， true 包含目录
	 * @return list 存放符合条件的路径
	 */
	private void findFile(String filePath, String regex, boolean flag, int len) {
		File file = new File(filePath);
		//获得文件数组，循环遍历
		File[] fileList = file.listFiles();
		for (int i = 0, size = fileList.length; i < size; i++) {
			String path = fileList[i].getAbsolutePath();
			//判断是否是文件
			if (fileList[i].isFile()) {
				//是文件，匹配正则，符合条件放入集合
				if (StrFunc.isNull(regex) || path.matches(regex)) {
					urls.add(path.substring(len).replaceAll("\\\\", "/"));
				}
			} else if (fileList[i].isDirectory()) {
				//是目录，判断是否放入集合，后递归
				if (flag) {
					if (StrFunc.isNull(regex) || path.matches(regex)) {
						urls.add(path.substring(len));
					}
				}
				if (!path.contains(".svn")) {
					findFile(path, regex, flag, len);
				}
			}
		}
	}
}
