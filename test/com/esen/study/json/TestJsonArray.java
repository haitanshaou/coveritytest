package com.esen.study.json;

import org.json.JSONArray;
import org.junit.Test;

public class TestJsonArray {
	@Test
	public void testIsNull() {
		JSONArray ja = new JSONArray();

		System.out.println(ja.length());
		System.out.println(ja.isNull(0));
	}
}
