package com.atlassian.crowd.security.demo.util;

import javax.servlet.http.HttpServletRequest;

import com.opensymphony.webwork.dispatcher.mapper.ActionMapping;
import com.opensymphony.webwork.dispatcher.mapper.DefaultActionMapper;

public class CrowdActionMapper extends DefaultActionMapper {
	@Override
	protected void handleSpecialParameters(HttpServletRequest request, ActionMapping mapping) {
	}
}
