package com.esen.study.set;

import java.util.HashSet;
import java.util.Set;

import org.junit.Test;

public class TestHashSet {
	@Test
	public void test() {
		Set<Integer> set = new HashSet<Integer>();
		set.add(1);
		set.add(2);
		set.add(3);

		Set<Integer> types = new HashSet<Integer>();
		types.add(4);
		types.add(5);
		types.add(6);

		int before = set.size();
		set.retainAll(types);
		int after = set.size();

		System.out.println(before);
		System.out.println(after);
	}
}
