package com.esen.study.thread;

import com.esen.util.GUID;

/**
 * @author chenlan
 * @since 2018-09-15
 */
public class MetaData {

	private String code;

	public MetaData() {
		this.code = GUID.makeGuid();
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

}
