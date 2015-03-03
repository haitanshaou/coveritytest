package com.esen.study.map;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.junit.Test;

import com.esen.util.StrFunc;

/**
 * TreeMap put Object对象的时候，该对象要继承Comparable并实现compareTo方法，否则get的时候会抛异常
 * 
 * 问题：TreeMap的key是一个对象，如果修改了这个对象的属性，是否还能根据这个对象get到value
 * 结论：这与对象的compareTo实现有关,
 * 				如果compareTo永远返回固定值0,修改了该对象的属性依旧能get到value
 * 				（put不同的对象，get到的永远是最后一次put的value）
 * 				如果compareTo永远返回非0固定值,不能get到
 * 
 */
public class TestTreeMap {

	/**
	 * 测试：compareTo永远返回固定值0的情况
	 * 	1、修改对象的属性	结果：依旧能get到该对象
	 * 	2、put一个新的对象 	结果：新的value把旧的value覆盖掉了，
	 * 			只要get的对象是这个类，就能获取到最后一次设置的value
	 */
	@Test
	public void testKeyObj1() {
		Map<Object, String> map = new TreeMap<Object, String>();
		StuObj stu1 = new StuObj("1", "htso", false);
		map.put(stu1, "this is htso");

		stu1.setId("3");
		System.out.println(map.get(stu1));//	this is htso

		StuObj stu2 = new StuObj("2", "my", false);
		map.put(stu2, "this is other student");

		System.out.println(map.get(stu1));//	this is other student
		System.out.println(map.get(stu2));//	this is other student
		System.out.println(map.get(new StuObj("no", "another", true)));//	this is other student
	}

	/**
	 * 测试：compareTo永远返回非0固定值的情况
	 * 结果：修改了该对象的属性，不能get到value
	 * 			 （即便不修改该对象的属性也不能get到）
	 */
	@Test
	public void testKeyObj2() {
		Map<Object, String> map = new TreeMap<Object, String>();
		TeacherObj to1 = new TeacherObj("1", "to1");
		map.put(to1, "this is to1");

		to1.setName("to2");
		System.out.println(map.get(to1));
	}

	/**
	 * 测试：compareTo根据对象的某个属性(name)比较设定返回值
	 * 	1、修改对象的attribute属性(与排序无关的属性)	结果：能get到该对象
	 *  2、修改对象的name属性(排序属性)		结果：依旧能get到该对象
	 */
	@Test
	public void testKeyObj3() {
		Map<Object, String> map = new TreeMap<Object, String>();
		catObj co1 = new catObj(1, "red hair,blue eyes", "ca1");
		map.put(co1, "this is ca1");

		co1.setAttribute("blue hair,black eyes");
		System.out.println(map.get(co1)); //	this is ca1

		co1.setName("ca2");
		System.out.println(map.get(co1)); //	this is ca1

		catObj co3 = new catObj(2, "red hair,blue eyes", "ca3");
		map.put(co3, "this is ca3");

		// 这里无论是co1.setName("ca3");还是co3.setName("ca2");
		// get这2个的结果都是 this is ca1
		co3.setName("ca2");
		System.out.println(map.get(co1)); //	this is ca1
		System.out.println(map.get(co3)); //	this is ca1

		catObj co4 = new catObj(3, "red hair,blue eyes", "ca3");
		map.put(co4, "this is ca3");

		co1.setName("co1");
		System.out.println(map.get(co1)); //	this is ca3
		System.out.println(map.get(co3)); //	null
		System.out.println(map.get(co4)); //	null

	}

	/**
	 *  测试：
	 *  	再put一个新的对象(排序属性与第一个不一样),修改name属性(排序属性)一致	
	 *	结果：
	 *		get到的始终是先put进去对象的对应的value
	 *		（其实map里面的值还是有2个没有减少）
	 */
	@Test
	public void testKeyObj4() {
		Map<Object, String> map = new TreeMap<Object, String>();
		catObj co1 = new catObj(1, "red hair,blue eyes", "ca1");
		map.put(co1, "this is ca1");

		catObj co2 = new catObj(2, "blue hair,blue eyes", "ca2");
		map.put(co2, "this is ca2");

		// 这里无论是co1.setName("ca2");还是co2.setName("ca1");
		// get这2个的结果都是 this is ca1
		co1.setName("ca2");
		System.out.println(map.get(co1));//	this is ca1
		System.out.println(map.get(co2));//	this is ca1

		System.out.println(map.toString());
	}

	/**
	 *	测试：
	 *		再put一个新的对象(排序属性与之前的一样)
	 *	
	 */
	@Test
	public void testKeyObj5() {
		Map<Object, String> map = new TreeMap<Object, String>();
		catObj co1 = new catObj(1, "red hair,blue eyes", "9");
		map.put(co1, "this is ca1");

		catObj co2 = new catObj(2, "blue hair,blue eyes", "8");
		map.put(co2, "this is ca2");

		co1.setName("8");

		catObj co3 = new catObj(3, "black hair,blue eyes", "8");
		map.put(co3, "this is ca3");

		//		{catObj [id=2, attribute=blue hair,blue eyes, name=8]=this is ca2, 
		//		 catObj [id=1, attribute=red hair,blue eyes, name=8]=this is ca3}
		System.out.println(map.toString());
		System.out.println(map.get(co1));//	this is ca3
		System.out.println(map.get(co2));//	this is ca3
		System.out.println(map.get(co3));//	this is ca3

		//		co1.setName("9");
		////		{catObj [id=2, attribute=blue hair,blue eyes, name=8]=this is ca2, 
		////		 catObj [id=1, attribute=red hair,blue eyes, name=9]=this is ca3}
		//		System.out.println(map.toString());
		//		System.out.println(map.get(co1));//	this is ca3
		//		System.out.println(map.get(co2));//	this is ca2
		//		System.out.println(map.get(co3));//	this is ca2

		//		co2.setName("9");
		////	{catObj [id=2, attribute=blue hair,blue eyes, name=9]=this is ca2, 
		////	 catObj [id=1, attribute=red hair,blue eyes, name=8]=this is ca3}
		//		System.out.println(map.toString());
		//		System.out.println(map.get(co1));//	this is ca3
		//		System.out.println(map.get(co2));//	null
		//		System.out.println(map.get(co3));//	this is ca3

		co3.setName("9");
		//	{catObj [id=2, attribute=blue hair,blue eyes, name=8]=this is ca2, 
		//	 catObj [id=1, attribute=red hair,blue eyes, name=8]=this is ca3}
		System.out.println(map.toString());
		System.out.println(map.get(co1));//	this is ca3
		System.out.println(map.get(co2));//	this is ca3
		System.out.println(map.get(co3));// null
	}

	@Test
	public void test() {
		TreeMap<String, Integer> newMap = new TreeMap<String, Integer>();
		newMap.put("b", 1);
		newMap.put("a", 9);
		newMap.put("c", 4);
		newMap.put("g", 7);
		newMap.put("e", 6);
		newMap.put("d", 3);
		newMap.put("f", 10);

		ByValueComparator bvc = new ByValueComparator(newMap);
		List<String> newList = new ArrayList<String>(newMap.keySet());
		Collections.sort(newList, bvc);
		for (String str : newList) {
			System.out.println(str + "=================================" + newMap.get(str));
		}
	}

	class ByValueComparator implements Comparator<String> {
		TreeMap<String, Integer> base_map;

		public ByValueComparator(TreeMap<String, Integer> base_map) {
			this.base_map = base_map;
		}

		public int compare(String arg0, String arg1) {
			if (!base_map.containsKey(arg0) || !base_map.containsKey(arg1)) {
				return 0;
			}

			if (base_map.get(arg0) < base_map.get(arg1)) {
				return 1;
			} else if (base_map.get(arg0) == base_map.get(arg1)) {
				return 0;
			} else {
				return -1;
			}
		}
	}

	class catObj implements Comparable<catObj> {
		private int id;

		private String attribute;

		private String name;

		public catObj(int id, String attribute, String name) {
			super();
			this.id = id;
			this.attribute = attribute;
			this.name = name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public void setAttribute(String attribute) {
			this.attribute = attribute;
		}

		public int compareTo(catObj o) {
			return StrFunc.compareStrInt(name, o.name);
		}

		@Override
		public String toString() {
			return "catObj [id=" + id + ", attribute=" + attribute + ", name=" + name + "]";
		}

	}

	class TeacherObj implements Comparable<TeacherObj> {
		private String id;

		private String name;

		public TeacherObj(String id, String name) {
			super();
			this.id = id;
			this.name = name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public int compareTo(TeacherObj o) {
			return 1;
		}
	}

	class StuObj implements Comparable<StuObj> {
		private String id;// 编号

		private String name;// 姓名

		private boolean isMale;// 是否是男性

		public StuObj(String id, String name, boolean isMale) {
			super();
			this.id = id;
			this.name = name;
			this.isMale = isMale;
		}

		public void setId(String id) {
			this.id = id;
		}

		public int compareTo(StuObj o) {
			return 0;
		}
	}
}
