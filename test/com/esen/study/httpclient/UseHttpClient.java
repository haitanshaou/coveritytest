package com.esen.study.httpclient;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.MultipartPostMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;

import com.esen.util.FileFunc;
import com.esen.util.StmFunc;
import com.esen.util.StrFunc;


/**
 * 获取网络内容
 * @author chenlan
 */
public class UseHttpClient {
	/**
	 * 得到一个表单提交对象
	 * @param url 提交的网址
	 * @param parms 提交表单的内容
	 * @return 表单提交对象
	 */
	public static PostMethod getPostMethod(String url, String parms) {
		PostMethod rs = new PostMethod(url);
		rs.addRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

		if (parms == null) {
			return rs;
		}
		String[] values = parms.split("&");
		NameValuePair[] pairs = new NameValuePair[values.length];
		String[] temp;
		for (int i = 0; i < values.length; i++) {
			temp = values[i].split("=");
			pairs[i] = new NameValuePair(temp[0], temp[1]);
		}
		rs.setRequestBody(pairs);
		return rs;
	}

	public static GetMethod getGetMethod(String url) {
		GetMethod rs = new GetMethod(url);
		rs.addRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		return rs;
	}

	/**
	 * 获取表单提交返回结果
	 * @param client 相当于浏览器对象
	 * @param post 提交对象
	 * @return 返回的内容 
	 * @throws IOException
	 */
	public static String getContent(HttpClient client, HttpMethod method) throws IOException {
		String content = null;
		client.executeMethod(method);
		if (method.getStatusCode() == HttpStatus.SC_OK) {
			// get的时候,直接用method.getResponseBodyAsString()乱码
//			content = new String(method.getResponseBody(), StrFunc.UTF8);

			InputStream resStream = method.getResponseBodyAsStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(resStream, StrFunc.UTF8));
			StringBuffer resBuffer = new StringBuffer();
			String resTemp = "";
			while ((resTemp = br.readLine()) != null) {
				resBuffer.append(resTemp);
			}
			content = resBuffer.toString();
		} else {
			throw new RuntimeException("获取网络内容出错！");
		}
		method.releaseConnection();
		return content;
	}

	/**
	 * 附件下载，需要加参数文件名，路径另考虑
	 */
	public static void getFile(HttpClient client, HttpMethod method, String filepath) throws IOException {
		InputStream content = null;
		client.executeMethod(method);
		if (method.getStatusCode() == HttpStatus.SC_OK) {
			// get的时候,直接用method.getResponseBodyAsString()乱码
			content = method.getResponseBodyAsStream();
		} else {
			throw new RuntimeException("获取网络内容出错！");
		}

		File file = new File(filepath);
		FileFunc.createDirsOfFile(file);
		FileOutputStream fos = new FileOutputStream(file);
		try {
			StmFunc.stmTryCopyFrom(content, fos);
		} finally {
			fos.close();
		}
		method.releaseConnection();
	}
}
