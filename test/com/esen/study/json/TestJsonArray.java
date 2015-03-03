package com.esen.study.json;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;

public class TestJsonArray {
	@Test
	public void testIsNull() {
		JSONArray ja = new JSONArray();

		System.out.println(ja.length());// 0
		System.out.println(ja.isNull(0));// true
	}

	@Test
	public void test() throws Exception {
		JSONArray ja = new JSONArray();
		for (int i = 0; i < 3; i++) {
			JSONObject jo = new JSONObject();
			jo.put("kstd" + i, i + "");
			ja.put(jo);
		}

		System.out.println(ja.toString());
	}
}
