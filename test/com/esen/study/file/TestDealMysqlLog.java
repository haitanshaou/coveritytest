package com.esen.study.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import org.junit.Test;

import com.esen.util.StmFunc;
import com.esen.util.StrFunc;

public class TestDealMysqlLog {

	/**
	 * 用于mysql数据恢复的处理
	 * mysqlbinlog --no-defaults --database=crucible --start-datetime='2013-02-20 09:00:00' mysql-bin.000048 >> mysqlrestore/log.sql
	 * 200.2服务器，备份文件在 /opt/mysqldb 下
	 * @throws Exception
	 */
	@Test
	public void test() throws Exception {
		File file = new File("C:/Users/Administrator/Desktop/log.sql");
		File newfile = new File("C:/Users/Administrator/Desktop/log_new.sql");

		InputStream is = new FileInputStream(file);
		try {
			OutputStream os = new FileOutputStream(newfile);
			try {
				String line;
				boolean write = true;
				while (null != (line = StmFunc.readLine(is, StrFunc.UTF8))) {
					// #140228 16:36:00 server id 1 end_log_pos 323 Xid =
					// 771039148
					// #140228 16:36:00 server id 1 end_log_pos 397 Query
					// thread_id=3650113 exec_time=0 error_code=0
					if (!write) {
						if (!line.matches("#\\d{6} \\d\\d:\\d\\d:\\d\\d.*")) {
							continue;
						}
					}

					if (line.matches("#\\d{6} [\\w_: \\t]+(Xid|Query).*")) {
						write = false;
						continue;
					} else {
						write = true;
					}

					StmFunc.writeFix(os, line, StrFunc.UTF8);
					os.write('\n');
				}
			} finally {
				os.close();
			}
		} finally {
			is.close();
		}

	}
}
