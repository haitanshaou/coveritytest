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
		System.out.println(ja.length());
	}
	
	@Test
	public void test4Rich() throws Exception {
		JSONObject jo = new JSONObject();
		jo.put("newline", true);
		
		System.out.println(jo.length());
		System.out.println(jo.toString());
		jo.put("stl", "other");
		System.out.println(jo.names().getString(1));
	}
	
	@Test
	public void testja() throws Exception {
		JSONArray ja = new JSONArray();
		JSONObject jo = new JSONObject();
		jo.put("t", "sdfsdf;");
		JSONObject jo1 = new JSONObject();
		jo1.put("fn", "微软雅黑");
		jo.put("stl", jo1);
		JSONObject jo3 = new JSONObject();
		jo3.put("newline", true);
		ja.put(jo);
		ja.put(jo3);
		System.out.println(ja.toString());
		
		JSONArray jch = new JSONArray(ja.toString());
	}
}
