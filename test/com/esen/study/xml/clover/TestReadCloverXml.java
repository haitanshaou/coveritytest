package com.esen.study.xml.clover;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
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
 * @author chenlan
 */
public class TestReadCloverXml {
	/**
	 * clover报告的工程路径名称
	 */
	private static final String RESPONSEPATH = "E:\\gitcode\\gitrepertory\\";

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

	/**
	 * 根据文件名，读取文件内记录的排除的包或类名
	 * @param filename 排除的文件名
	 * @return
	 * @throws Exception
	 */
	private static Set<String> getExclude(String filename) throws Exception {
		Set<String> exclude = new HashSet<String>();
		InputStream is = TestReadCloverXml.class.getResourceAsStream(filename);
		try {
			String ex = StmFunc.readString(is, StrFunc.UTF8);
			if (!StrFunc.isNull(ex)) {
				String[] exs = ex.split("\r?\n");
				for (int i = 0; i < exs.length; i++) {
					if (!exs[i].startsWith("#")) {
						exclude.add(exs[i]);
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
	public void testGetCloverByPath_i_es() throws Exception {
		File file = new File(RESULTPATH);
		FileOutputStream fos = new FileOutputStream(file);
		try {
			// csv的UTF-8格式需要BOM文件头，否则打开会乱码
			fos.write(new byte[] { (byte) 0xEF, (byte) 0xBB, (byte) 0xBF });
		} finally {
			fos.close();
		}
		double es_clover = TestReadCloverXml.getCloverByPath(CLOVERXML, "esenface", getExclude("i_es_pacexclude.txt"),
				getExclude("i_es_classexclude.txt"));
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
		double i_clover = TestReadCloverXml.getCloverByPath(CLOVERXML, "irpt", getExclude("i_pacexclude.txt"),
				getExclude("i_classexclude.txt"));
		System.out.println(i_clover);
	}

	/**
	 * @param xmlpath clover.xml 的路径
	 * @param project 工程名称
	 * @param excludes 排除的包路径
	 * @return 
	 * @throws Exception 
	 */
	private static double getCloverByPath(String xmlpath, String project, Set<String> excludes, Set<String> exclass) throws Exception {
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
						getclover(projectnode, PACKAGE, FILES, project, excludes, exclass);
					}
				}
			}
		} finally {
			fis.close();
		}
		int coveredelements = 0;
		int total = 0;
		double result = 0.0;
		
		for (Iterator<CloverBean> iterator = list.iterator(); iterator.hasNext();) {
			CloverBean cloverbean = iterator.next();
			coveredelements += cloverbean.getCoveredelements();
			total += cloverbean.getElements();
			FileFunc.writeStrToFile("C:/Users/Administrator/Desktop/clover.txt",
					cloverbean.getJavaname() + "\t" + cloverbean.getCoveredelements() + "\t" + cloverbean.getElements(), true,
					StrFunc.UTF8);
			FileFunc.writeStrToFile("C:/Users/Administrator/Desktop/clover.txt", "\r\n", true, StrFunc.UTF8);
		}
		System.out.println(coveredelements + "\t" + total);
		result = (coveredelements * 100) / total;
		System.out.println(javacount);
		return result;
	}

	private static void getclover(Node node, String name, String attribute, String project, Set<String> excludes, Set<String> exclass) {
		NodeList nodelist = node.getChildNodes();
		for (int i = 0; i < nodelist.getLength(); i++) {
			Node cnode = nodelist.item(i);
			if (cnode instanceof Element) {
				if (METRICS.equals(cnode.getNodeName())) {
					if (StrFunc.isNull(attribute)) {
						// attribute为空说明走到最后了，需要统计
						String javaname = node.getAttributes().getNamedItem("name").getNodeValue();
						CloverBean cloverbean = new CloverBean(javaname, StrFunc.str2int(
								((Element) cnode).getAttribute(COVEREDELEMENTS), 0), StrFunc.str2int(
								((Element) cnode).getAttribute(ELEMENTS), 0));
						FileFunc.writeStrToFile(RESULTPATH, cloverbean.toString(), true, StrFunc.UTF8);
						FileFunc.writeStrToFile(RESULTPATH, "\r\n", true, StrFunc.UTF8);
						list.add(cloverbean);
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
							if (new File(path).exists()) {
								// 文件在本地存在才计算，不存在的即被删除的废弃文件，不记录
								String javaname = cnode.getAttributes().getNamedItem("name").getNodeValue();
								if (null != exclass && !exclass.isEmpty() && exclass.contains(javaname)) {
									// 排除掉的java不处理
									// System.out.println(javaname);
									continue;
								}
								javacount++;
								path = path.substring((RESPONSEPATH + project).length() + 1);
								path = path.substring(path.indexOf('\\') + 1);
								FileFunc.writeStrToFile(RESULTPATH, path, true, StrFunc.UTF8);
								FileFunc.writeStrToFile(RESULTPATH, ",", true, StrFunc.UTF8);
								getclover(cnode, CLASS, null, project, excludes, exclass);
							}
						} else {
							// 如果不是指定工程下的不统计
							break;
						}
					} else if (PACKAGE.equals(cnode.getNodeName())) {
						String packagename = cnode.getAttributes().getNamedItem("name").getNodeValue();
						boolean find = false;
						if (null != excludes && !excludes.isEmpty()) {
							for (Iterator<String> iterator = excludes.iterator(); iterator.hasNext();) {
								String pname = iterator.next();
								if (packagename.startsWith(pname)) {
									find = true;
									break;
								}
							}
						}
						if (!find) {
							getclover(cnode, FILE, CLASSES, project, excludes, exclass);
						}
					}
				}
			}
		}
	}
}

class CloverBean {
	/**
	 * 覆盖分支数
	 */
	private int coveredelements = 0;

	/**
	 * 总分支数
	 */
	private int elements = 0;
	
	/**
	 * java类名
	 */
	private String javaname;

	public CloverBean(String javaname, int coveredelements, int elements) {
		super();
		this.coveredelements = coveredelements;
		this.elements = elements;
		this.javaname = javaname;
	}

	public int getCoveredelements() {
		return coveredelements;
	}

	public void setCoveredelements(int coveredelements) {
		this.coveredelements = coveredelements;
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

	@Override
	public String toString() {
		return coveredelements + "," + elements;
	}

}
