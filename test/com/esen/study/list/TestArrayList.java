package com.esen.study.list;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import org.junit.Test;

public class TestArrayList {
	/**
	 * 测试ArrayList顺序问题
	 */
	@Test
	public void testOrderly() throws Exception {
		List<String> a = new ArrayList<String>();
		a.add("ccc");
		a.add("b");
		a.add("d");
		a.add("a");
		
		a.remove("d");
		a.add("c");
		Collections.sort(a);
		for (Iterator<String> iterator = a.iterator(); iterator.hasNext();) {
			String o = iterator.next();
			System.out.println(o);
		}
	}

	@Test
	public void testSort() throws Exception {
		List<User> a = new ArrayList<User>();
		a.add(new User("bb", 1));
		a.add(new User("a", 100));
		a.add(new User("c", 50));
		Collections.sort(a);
		for (Iterator<User> iterator = a.iterator(); iterator.hasNext();) {
			User o = iterator.next();
			System.out.println(o.toString());
		}
	}

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

class User implements Comparable<User> {
	private String name;

	private int age;

	public User(String name, int age) {
		super();
		this.name = name;
		this.age = age;
	}

	@Override
	public String toString() {
		return "User [name=" + name + ", age=" + age + "]";
	}

	public int compareTo(User o) {
		// TODO Auto-generated method stub
		return this.age - o.age;
	}

}
