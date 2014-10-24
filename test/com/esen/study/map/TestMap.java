package com.esen.study.map;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TreeMap;

import org.junit.Test;

import com.urlshow.pinyin.PinYin;

public class TestMap {
	/**
	 * TreeMap 是根据key值来排序的,是有序的
	 * HashMap 是无序的，与插入顺序有关
	 */
	@Test
	public void test4Sort() {
		Map<String, String> treeMap = new TreeMap<String, String>();
		Map<String, String> hashMap = new HashMap<String, String>();

		treeMap.put("a", "c");
		treeMap.put("c", "a");
		treeMap.put("b", "b");

		hashMap.put("a", "c");
		hashMap.put("c", "a");
		hashMap.put("b", "b");

		System.out.println(treeMap.toString()); //	{a=c, b=b, c=a}
		System.out.println(hashMap.toString()); //	{a=c, c=a, b=b}
	}

	@Test
	public void testSortPinyin() {
		Map<String, String> treeMap = new TreeMap<String, String>();
		String[] s = { "愚人", "隐士", "圣杯", "魔法师", "女祭司", "倒塔" };
		for (int i = 0; i < s.length; i++) {
			treeMap.put(PinYin.getPinYin(s[i], 2), s[i]);
		}

		//		{daota=倒塔, mofashi=魔法师, nvjisi=女祭司, shengbei=圣杯, yinshi=隐士, yuren=愚人}
		System.out.println(treeMap.toString());

		//		entrySet
		Iterator<Map.Entry<String, String>> iter = treeMap.entrySet().iterator();
		while (iter.hasNext()) {
			Entry<String, String> entry = iter.next();
			String key = entry.getKey();
			String value = entry.getValue();
			System.out.println(key + ":\t" + value);
		}
	}

	@Test
	public void testContainObj() {
		Map<Info, String> map = new HashMap<TestMap.Info, String>();
		String name = "a";
		String tname = "t";
		String sname = "s";

		Info info = new Info(name, tname, sname);
		map.put(info, "s");

		Info info2 = new Info(name, tname, sname);
		System.out.println(map.containsKey(info2));
		System.out.println(map.get(info2));
	}

	class Info {
		String name;

		String tname;

		String sname;

		public Info(String name, String tname, String sname) {
			super();
			this.name = name;
			this.tname = tname;
			this.sname = sname;
		}

		@Override
		public boolean equals(Object obj) {
			if (obj instanceof Info) {
				return this.name.equals(((Info) obj).name);
			}
			return super.equals(obj);
		}
	}
}
