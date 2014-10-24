package com.esen.study.json;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;

public class TestJsonObj {
	@Test
	public void test() throws JSONException {
		JSONObject j = new JSONObject();
		j.put("fieldName", "fieldName");
		j.put("fieldAlias", "fieldAlias");
		j.put("dbType", "dbType");
		j.put("factType", "factType");
		j.put("dbLength", "1");
		j.put("factLength", "2");
		System.out.println(j.toString());

		JSONObject o = new JSONObject(j.toString());

		System.out.println(o.get("fieldName"));
		System.out.println(o.get("dbLength"));
		System.out.println(o.get("factLength"));
	}
}
