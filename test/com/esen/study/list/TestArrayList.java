package com.esen.study.list;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

import org.junit.Test;

public class TestArrayList {

	/**
	 * a是原list，b是变化后的，要找到新增和删除的内容
	 */
	@Test
	public void testAddDel() throws Exception {
		List<String> a = new ArrayList<String>();
		List<String> b = new ArrayList<String>();

		a.add("a");
		a.add("b");
		a.add("c");
		a.add("d");
		a.add("e");
		a.add("h");
		b.add("e");
		b.add("b");
		b.add("f");

		ArrayList<String> c = (ArrayList<String>) ((ArrayList<String>) a).clone();

		c.retainAll(b);
		a.removeAll(c);
		b.removeAll(c);
		for (Iterator<String> iterator = a.iterator(); iterator.hasNext();) {
			String del = iterator.next();
			System.out.print(del);
		}
		System.out.println();
		for (Iterator<String> iterator = b.iterator(); iterator.hasNext();) {
			String add = iterator.next();
			System.out.print(add);
		}
	}
}
