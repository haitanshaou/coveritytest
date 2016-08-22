package com.esen.study.xml.clover;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import org.junit.Test;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.esen.util.FileFunc;
import com.esen.util.StmFunc;
import com.esen.util.StrFunc;
import com.esen.util.XmlFunc;

/**
 * clover覆盖率的报告，如：irpt的，还包含了util和jdbc的内容
 * 现提取指定包路径下的覆盖率，算出覆盖率结果
 * 
 * clover.xml大概的格式：<br/>
 * &lt;package name="packagename"><br/>
 * 	&lt;metrics coveredelements="" statements="" methods="" elements="" files="" ... /><br/>
 * 		&lt;file path="" name=""><br/>
 * 			&lt;metrics cloverelements="" statements="" methods="" classes="" elements="" ... /><br/>
 * 				&lt;class name=""><br/>
 * 					&lt;metrics cloverelements="" statements="" methods="" elements="" ... /><br/>
 * 				&lt;/class><br/>
 * 		&lt;/file><br/>
 * &lt;/package><br/>
 * 
 * 计算方式：<br/>
 * cloverelements/elements
 * 
 * =HYPERLINK("http://172.21.200.12:8083/clover201608191830/web-server/"&LEFT(RIGHT(B2,LEN(B2)-4),LEN(B2)-8)&"html",B2)
 * 
 * @author chenlan
 * @since Aug 19, 2016
 * 加了指定目录和指定类
 */
public class TestCloverXml {
	/**
	 * clover报告的工程路径名称
	 */
	private static final String RESPONSEPATH = "/opt/ContinuousBuild/jenkins_home/workspace/EDF-1.1/";

	/**
	 * project节点
	 */
	private static final String PROJECT = "project";

	/**
	 * metrics节点
	 */
	private static final String METRICS = "metrics";

	/**
	 * file节点
	 */
	private static final String FILE = "file";

	/**
	 * class节点
	 */
	private static final String CLASS = "class";

	/**
	 * package节点
	 */
	private static final String PACKAGE = "package";

	/**
	 * coveredelements节点
	 */
	private static final String COVEREDELEMENTS = "coveredelements";

	/**
	 * elements节点
	 */
	private static final String ELEMENTS = "elements";

	/**
	 * files属性
	 */
	private static final String FILES = "files";

	/**
	 * classes属性
	 */
	private static final String CLASSES = "classes";

	/**
	 * path属性
	 */
	private static final String PATH = "path";

	/**
	 * 记录的覆盖率信息
	 */
	private static List<CloverBean> list = new ArrayList<CloverBean>();

	/**
	 * java类计数
	 */
	private static int javacount = 0;

	/**
	 * 覆盖率结果记录文件
	 */
	private static final String RESULTPATH = "C:/Users/Administrator/Desktop/clover.csv";

	/**
	 * 覆盖率数据文件
	 */
	private static final String CLOVERXML = "E:/clover/irpt/clover/irptweb-server-20150910/clover.xml";

	/*
	 * 读取指定文件中配置的内容
	 */
	private static Set<String> getPath(String filename) throws Exception {
		Set<String> appointclass = new HashSet<String>();
		InputStream is = TestCloverXml.class.getResourceAsStream(filename);
		try {
			String ex = StmFunc.readString(is, StrFunc.UTF8);
			if (!StrFunc.isNull(ex)) {
				String[] exs = ex.split("\r?\n");
				for (int i = 0; i < exs.length; i++) {
					appointclass.add(exs[i]);
				}
			}
		} finally {
			is.close();
		}
		return appointclass;
	}

	/**
	 * 根据文件名，读取文件内记录的排除的包或类名
	 * @param filename 排除的文件名
	 * @return
	 * @throws Exception
	 */
	private static Map<String, String> getExclude(String filename) throws Exception {
		Map<String, String> exclude = new HashMap<String, String>();
		InputStream is = TestCloverXml.class.getResourceAsStream(filename);
		try {
			String ex = StmFunc.readString(is, StrFunc.UTF8);
			if (!StrFunc.isNull(ex)) {
				String[] exs = ex.split("\r?\n");
				String description = null;
				for (int i = 0; i < exs.length; i++) {
					if (exs[i].startsWith("#")) {
						description = exs[i].substring(1);
					} else {
						exclude.put(exs[i], description);
					}
				}
			}
		} finally {
			is.close();
		}
		return exclude;
	}

	/**
	 * 根据文件路径来判断是否是工程下的
	 */
	@Test
	public void testGetCloverByPath_df() throws Exception {
		File file = new File(RESULTPATH);
		FileOutputStream fos = new FileOutputStream(file);
		try {
			// csv的UTF-8格式需要BOM文件头，否则打开会乱码
			fos.write(new byte[] { (byte) 0xEF, (byte) 0xBB, (byte) 0xBF });
		} finally {
			fos.close();
		}
		double clover = TestCloverXml.getCloverByPath("D:/clover/datafactory/clover/web-server/clover.xml", "datafactory",
				null, null, null, null);
		System.out.println(clover);
	}

	/**
	 * 根据文件路径来判断是否是工程下的
	 */
	@Test
	public void testGetCloverByPath_df_es() throws Exception {
		File file = new File(RESULTPATH);
		FileOutputStream fos = new FileOutputStream(file);
		try {
			// csv的UTF-8格式需要BOM文件头，否则打开会乱码
			fos.write(new byte[] { (byte) 0xEF, (byte) 0xBB, (byte) 0xBF });
		} finally {
			fos.close();
		}
		Set<String> appointpath = new HashSet<String>();
		appointpath.add("com/esen/platform/action/dsmodel");
		appointpath.add("com/esen/platform/dsmodel");
		double clover = TestCloverXml.getCloverByPath("D:/clover/datafactory/clover/web-server/clover.xml", "esenface",
				null, null, appointpath, getPath("df_es_appointclass_2.1.1.txt"));
		System.out.println(clover);
	}

	/**
	 * 根据文件路径来判断是否是工程下的
	 */
	@Test
	public void testGetCloverByPath_i_es() throws Exception {
		File file = new File(RESULTPATH);
		FileOutputStream fos = new FileOutputStream(file);
		try {
			// csv的UTF-8格式需要BOM文件头，否则打开会乱码
			fos.write(new byte[] { (byte) 0xEF, (byte) 0xBB, (byte) 0xBF });
		} finally {
			fos.close();
		}
		double es_clover = TestCloverXml.getCloverByPath(CLOVERXML, "esenface", getExclude("i_es_pacexclude.txt"),
				getExclude("i_es_classexclude.txt"), null, null);
		System.out.println(es_clover);
	}

	/**
	 * 根据文件路径来判断是否是工程下的
	 */
	@Test
	public void testGetCloverByPath_i() throws Exception {
		File file = new File(RESULTPATH);
		FileOutputStream fos = new FileOutputStream(file);
		try {
			// csv的UTF-8格式需要BOM文件头，否则打开会乱码
			fos.write(new byte[] { (byte) 0xEF, (byte) 0xBB, (byte) 0xBF });
		} finally {
			fos.close();
		}
		double i_clover = TestCloverXml.getCloverByPath(CLOVERXML, "irpt", getExclude("i_pacexclude.txt"),
				getExclude("i_classexclude.txt"), null, null);
		System.out.println(i_clover);
	}

	/**
	 * @param xmlpath clover.xml 的路径
	 * @param project 工程名称
	 * @param excludes 排除的包路径
	 * @return 
	 * @throws Exception 
	 */
	private static double getCloverByPath(String xmlpath, String project, Map<String, String> excludes,
			Map<String, String> exclass, Set<String> appoint, Set<String> appointclass) throws Exception {
		File file = new File(xmlpath);
		FileInputStream fis = new FileInputStream(file);
		try {
			Document document = XmlFunc.getDocument(fis);
			// 根节点是coverage，获取coverage下的project下的节点，遍历所有的package节点
			Element root = document.getDocumentElement();
			NodeList rootlist = root.getChildNodes();
			for (int i = 0; i < rootlist.getLength(); i++) {
				Node projectnode = rootlist.item(i);
				if (projectnode instanceof Element) {
					if (PROJECT.equals(projectnode.getNodeName())) {
						getclover(projectnode, PACKAGE, FILES, project, excludes, exclass, null, appoint, appointclass);
					}
				}
			}
		} finally {
			fis.close();
		}
		int coveredelements = 0;
		int total = 0;
		double result = 0.0;

		Collections.sort(list);
		for (Iterator<CloverBean> iterator = list.iterator(); iterator.hasNext();) {
			CloverBean cloverbean = iterator.next();
			coveredelements += cloverbean.getCloverdelements();
			total += cloverbean.getElements();

			FileFunc.writeStrToFile(RESULTPATH, cloverbean.toString(), true, StrFunc.UTF8);
		}
		System.out.println(coveredelements + "\t" + total);
		result = (coveredelements * 100) / total;
		System.out.println(javacount);
		return result;
	}

	private static void getclover(Node node, String name, String attribute, String project, Map<String, String> excludes,
			Map<String, String> exclass, CloverBean coverebean, Set<String> appoint, Set<String> appointclass)
			throws CloneNotSupportedException {
		NodeList nodelist = node.getChildNodes();
		CloverBean cb = null;
		for (int i = 0; i < nodelist.getLength(); i++) {
			if (null != coverebean) {
				cb = coverebean.clone();
			}
			Node cnode = nodelist.item(i);
			if (cnode instanceof Element) {
				if (METRICS.equals(cnode.getNodeName())) {
					if (StrFunc.isNull(attribute)) {
						// attribute为空说明走到最后了，需要统计
						String javaname = node.getAttributes().getNamedItem("name").getNodeValue();
						int elements = StrFunc.str2int(((Element) cnode).getAttribute(ELEMENTS), 0);
						cb.setJavaname(javaname);
						cb.setCloverdelements(StrFunc.str2int(((Element) cnode).getAttribute(COVEREDELEMENTS), 0));
						cb.setElements(elements);
						if (0 != elements) {
							// 分支数不为0的才记录
							list.add(cb);
						}
						break;
					} else {
						// 如果子节点为0，就不用继续遍历了
						if (0 == StrFunc.str2int(((Element) cnode).getAttribute(attribute), 0)) {
							break;
						}
					}
				} else {
					if (FILE.equals(cnode.getNodeName())) {
						if (((Element) cnode).getAttribute(PATH).startsWith(RESPONSEPATH + project)) {
							String path = ((Element) cnode).getAttribute(PATH);
							// TODO 如果是远程的，此处要注释掉（或着是想办法把路径转为本地的进行判断）
							//							if (new File(path).exists()) {
							// 文件在本地存在才计算，不存在的即被删除的废弃文件，不记录
							String javaname = cnode.getAttributes().getNamedItem("name").getNodeValue();
							if (null != exclass && !exclass.isEmpty() && exclass.containsKey(javaname)) {
								// 排除掉的java不处理
								// System.out.println(javaname);
								cb.setIsexclude(true);
								cb.setExccontent(javaname);
								cb.setDescription(exclass.get(javaname));
							}
							boolean needCount = false;
							if ((null != appoint && !appoint.isEmpty()) || (null != appointclass && !appointclass.isEmpty())) {
								if (null != appoint && !appoint.isEmpty()) {
									Iterator<String> iterator = appoint.iterator();
									while (iterator.hasNext()) {
										String pname = iterator.next();
										if (path.contains(pname)) {
											needCount = true;
											break;
										}
									}
								}
								if (!needCount) {
									if (null != appointclass && !appointclass.isEmpty()) {
										Iterator<String> iterator = appointclass.iterator();
										while (iterator.hasNext()) {
											String pname = iterator.next();
											if (path.contains(pname)) {
												needCount = true;
												break;
											}
										}
									}
								}
							} else {
								needCount = true;
							}
							if (needCount) {
								javacount++;
								path = path.substring((RESPONSEPATH + project).length() + 1);
								path = path.substring(path.indexOf('\\') + 1);
								cb.setName(path);
								getclover(cnode, CLASS, null, project, excludes, exclass, cb, appoint, appointclass);
							}
							//							}
						} else {
							// 如果不是指定工程下的不统计
							break;
						}
					} else if (PACKAGE.equals(cnode.getNodeName())) {
						String packagename = cnode.getAttributes().getNamedItem("name").getNodeValue();
						coverebean = new CloverBean();
						if (null != excludes && !excludes.isEmpty()) {
							Iterator<Map.Entry<String, String>> iter = excludes.entrySet().iterator();
							while (iter.hasNext()) {
								Entry<String, String> entry = iter.next();
								String pname = entry.getKey();
								String description = entry.getValue();
								if (packagename.startsWith(pname)) {
									coverebean.setIsexclude(true);
									coverebean.setExccontent(pname);
									coverebean.setDescription(description);
									break;
								}
							}
						}
						getclover(cnode, FILE, CLASSES, project, excludes, exclass, coverebean, appoint, appointclass);
					}
				}
			}
		}
	}
}

class CloverBean implements Comparable<CloverBean>, Cloneable {
	/**
	 * 覆盖分支数
	 */
	private int cloverdelements = 0;

	/**
	 * 总分支数
	 */
	private int elements = 0;

	/**
	 * java类名
	 */
	private String javaname;

	/**
	 * 是否排除
	 */
	private boolean isexclude = false;

	/**
	 * 包名加类名
	 */
	private String name;

	/**
	 * 排除的内容(排除包就是包路径，排除类就是类名)
	 */
	private String exccontent;

	/**
	 * 排除的原因描述
	 */
	private String description;

	public int getCloverdelements() {
		return cloverdelements;
	}

	public void setCloverdelements(int cloverdelements) {
		this.cloverdelements = cloverdelements;
	}

	public int getElements() {
		return elements;
	}

	public void setElements(int elements) {
		this.elements = elements;
	}

	public String getJavaname() {
		return javaname;
	}

	public void setJavaname(String javaname) {
		this.javaname = javaname;
	}

	public boolean isIsexclude() {
		return isexclude;
	}

	public void setIsexclude(boolean isexclude) {
		this.isexclude = isexclude;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getExccontent() {
		return exccontent;
	}

	public void setExccontent(String exccontent) {
		this.exccontent = exccontent;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public String toString() {
		return name + "," + cloverdelements + "," + elements + "," + (isexclude ? "是" : "否") + ","
				+ StrFunc.null2blank(exccontent) + "," + StrFunc.null2blank(description) + "\r\n";
	}

	public int compareTo(CloverBean o) {
		if (!this.isexclude && o.isexclude) {
			return -1;
		}
		if (this.isexclude && !o.isexclude) {
			return 1;
		}
		return StrFunc.compareStrInt(this.name, o.name);
	}

	@Override
	protected CloverBean clone() throws CloneNotSupportedException {
		CloverBean coverebean = new CloverBean();
		coverebean.setCloverdelements(cloverdelements);
		coverebean.setDescription(description);
		coverebean.setElements(elements);
		coverebean.setExccontent(exccontent);
		coverebean.setIsexclude(isexclude);
		coverebean.setJavaname(javaname);
		coverebean.setName(name);
		return coverebean;
	}

}
