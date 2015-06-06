package com.esen.study.arrayStr;

import org.junit.Test;

import com.esen.util.ArrayFunc;

public class ArrayStr {

	@Test
	public void test() {
		String[] s = { "a", "b" };
		System.out.println(ArrayFunc.array2Str(s, "，"));
	}
	
	@Test
	public void testMearge() {
		int[] arr1 = {9,7,3};
		int[] arr2 = {10,8,2,1};
		meargeArr(arr1, arr2);
	}

	// 降序保持降序
	public void meargeArr(int[] arr1, int[] arr2) {
		int m = arr1.length;
		int n = arr2.length;
		int t = m + n;
		int[] result = new int[t];
		int i = 0, j = 0, k = 0;
		while (i < m && j < n) {
			if (arr1[i] >= arr2[j]) {
				result[k++] = arr1[i++];
			} else {
				result[k++] = arr2[j++];
			}
		}

		if (i == m) {
			while (k < t) {
				result[k++] = arr2[j++];
			}
		} else {
			while (k < t) {
				result[k++] = arr1[i++];
			}
		}
		
		for (int k2 = 0; k2 < result.length; k2++) {
			System.out.println(result[k2]);
		}
	}
}
