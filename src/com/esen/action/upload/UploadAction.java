package com.esen.action.upload;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.esen.util.FileFunc;
import com.esen.util.StmFunc;

/**
 * 处理文件上传的Action
 * @author chenlan
 */
public class UploadAction extends Action {
	public ActionForward execute(ActionMapping mapping, ActionForm form, HttpServletRequest req, HttpServletResponse res)
			throws Exception {
		try {
			String action = req.getParameter("action");
			if ("upload".equals(action)) {
				return uploadfile(req, res, mapping);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 上传注册文件
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	private ActionForward uploadfile(HttpServletRequest request, HttpServletResponse response, ActionMapping mapping)
			throws Exception {
		String path = FileFunc.createTempFile(null, "license.xml", false, true);
		System.out.println(path);
		File file = new File(path);
		DiskFileItemFactory factory = new DiskFileItemFactory();
		factory.setSizeThreshold(1024 * 1024);
		ServletFileUpload upload = new ServletFileUpload(factory);
		@SuppressWarnings("unchecked")
		List<FileItem> list = (List<FileItem>) upload.parseRequest(request);
		for (FileItem item : list) {
			if (!item.isFormField()) {
				//因为写了机器码后，又会进入myApply，依旧需要解读这个文件
				System.out.println(item.getName());
				InputStream in = item.getInputStream();
				try {
					OutputStream os = new FileOutputStream(file);
					try {
						StmFunc.stmTryCopyFrom(in, os);
					} finally {
						os.close();
					}
				} finally {
					in.close();
				}
			}
		}
		return null;
	}
}
