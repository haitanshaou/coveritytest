package com.esen.study.string;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.Test;

import com.esen.util.ArrayFunc;
import com.esen.util.StrFunc;

public class TestSplit {

	@Test
	public void testSplitLimit() throws Exception {
		String s = "abc;;111;666;";
		String[] s1 = s.split(";");
		String[] s2 = s.split(";", -1);
		String[] s3 = s.split(";", 3);

		System.out.println(s1.length);// 4
		System.out.println(ArrayFunc.array2Str(s1, '-'));// abc--111-666
		System.out.println(s2.length);// 5
		System.out.println(ArrayFunc.array2Str(s2, '-'));// abc--111-666-
		System.out.println(s3.length);// 3
		System.out.println(ArrayFunc.array2Str(s3, '-'));// abc--111;666;
	}

	private static List<String> splitZbs(String value) {
		List<String> list = new ArrayList<String>();
		value = StrFunc.null2blank(value);

		if (-1 == value.indexOf('[') && -1 == value.indexOf("<#=")) {
			ArrayFunc.array2list(value.split(","), list);
			return list;
		}
		LinkedList<Character> stack = new LinkedList<Character>();
		int startidx = 0;
		int len = value.length();
		int i = 0;
		while (i < len) {
			char c = value.charAt(i);
			if (stack.isEmpty() && c == '<' && "<#=".equals(value.substring(i, i + 3))) {
				String s = StrFunc.ensureNotStartWith(value.substring(startidx, i), ",");
				ArrayFunc.array2list(s.split(","), list);
				int end = value.indexOf("#>");
				if (-1 == end) {
					ArrayFunc.array2list(value.substring(i).split(","), list);
					i = len;
				} else {
					list.add(value.substring(i, end + 2));
					startidx = end + 2;
					i = end + 2;
				}
			} else if (c == '[') {
				if (stack.isEmpty()) {
					if (startidx != i) {
						String s = value.substring(startidx, i);
						ArrayFunc.array2list(s.split(","), list);
					}
					startidx = i;
				}
				stack.add(c);
				i++;
			} else if (c == ']') {
				if (!stack.isEmpty()) {
					stack.removeLast();
				}
				i++;
				if (stack.isEmpty()) {
					list.add(value.substring(startidx, i));
					startidx = i;
				}
			} else {
				i++;
			}
		}
		String s = StrFunc.ensureNotStartWith(value.substring(startidx, i), ",");
		ArrayFunc.array2list(s.split(","), list);
		return list;
	}

	//	如果有宏不拆分
	private static List<String> splitZbs2(String value) {
		List<String> list = new ArrayList<String>();
		value = StrFunc.null2blank(value);

		Matcher macro = Pattern.compile("<#=([^#]*#?)*#>").matcher(value);
		if (macro.find()) {
			list.add(value);
			return list;
		}

		if (-1 == value.indexOf('[')) {
			ArrayFunc.array2list(value.split(","), list);
			return list;
		}
		LinkedList<Character> stack = new LinkedList<Character>();
		int startidx = 0;
		int len = value.length();
		int i = 0;
		while (i < len) {
			char c = value.charAt(i);
			if (c == '[') {
				if (stack.isEmpty()) {
					if (startidx != i) {
						String s = value.substring(startidx, i);
						ArrayFunc.array2list(s.split(","), list);
					}
					startidx = i;
				}
				stack.add(c);
				i++;
			} else if (c == ']') {
				if (!stack.isEmpty()) {
					stack.removeLast();
				}
				i++;
				if (stack.isEmpty()) {
					list.add(value.substring(startidx, i));
					startidx = i;
				}
			} else {
				i++;
			}
		}
		String s = StrFunc.ensureNotStartWith(value.substring(startidx, i), ",");
		ArrayFunc.array2list(s.split(","), list);
		return list;
	}

	@Test
	public void testHong() {
		String value = "aa<#=bb#cc#>dd";
		//		System.out.println(value.matches("<#"));
		Matcher macro = Pattern.compile("<#=([^#]*#?)*#>").matcher(value);
		System.out.println(macro.find());
	}

	@Test
	public void testsplitzb() {
		String value = "[Add<#,cc],[b,[a,c],[d,e]]";
//		String value = "A1$,<#=A2$#>";
//		String value = "[f1],A1$,<#=[B1,b2,b3]#>,[[d1,<#=d2#>],[d3,d4]],c1";
		List<String> zbs = splitZbs2(value);
		for (Iterator iterator = zbs.iterator(); iterator.hasNext();) {
			String string = (String) iterator.next();
			System.out.println(string);
		}
	}
}
