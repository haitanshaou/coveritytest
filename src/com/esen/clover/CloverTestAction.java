package com.esen.clover;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

public class CloverTestAction extends Action {
	public ActionForward execute(ActionMapping mapping, ActionForm form, HttpServletRequest req, HttpServletResponse res)
			throws Exception {
		String action = req.getParameter("action");
		if ("test1_1".equals(action)) {
			Test1.method1();
		} else if ("test1_2".equals(action)) {
			Test1.method2();
		} else if ("test1_3".equals(action)) {
			Test1.method3();
		} else if ("test2_1".equals(action)) {
			Test2.method1();
		} else if ("test2_2".equals(action)) {
			Test2.method2();
		} else if ("test2_3".equals(action)) {
			Test2.method3();
		} else if ("test3_1".equals(action)) {
			Test3.method3();
		} else if ("test3_2".equals(action)) {
			Test3.method2();
		} else if ("test3_3".equals(action)) {
//			Test3.method3();
		}
		return null;
	}

}
