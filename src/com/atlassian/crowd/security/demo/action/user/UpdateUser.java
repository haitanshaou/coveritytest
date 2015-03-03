/*
 * Copyright (c) 2005 Authentisoft, LLC. All Rights Reserved.
 */
package com.atlassian.crowd.security.demo.action.user;

import com.atlassian.crowd.model.user.User;
import com.atlassian.crowd.security.demo.model.DemoUser;
import com.opensymphony.webwork.ServletActionContext;
import org.apache.commons.lang.StringUtils;

import java.util.Enumeration;

public class UpdateUser extends ViewUser {

	private String removeGroup;

	private String unsubscribedGroup;

	public String doUpdateGeneral() {
		try {
			// update personal information
			User user = DemoUser.newInstance(name, firstname, lastname, active, email, firstname + " " + lastname);
			crowdClient.updateUser(user);

			// update the passsword
			if (StringUtils.isNotBlank(password)) {
				if (password.equals(passwordConfirm)) {
					crowdClient.updateUserCredential(name, password);
				} else {
					addFieldError("password", getText("user.passwordconfirm.nomatch"));
					addFieldError("confirmPassword", "");
				}
			}

			// populate our memberships for the view page
			super.doDefault();

			return SUCCESS;

		} catch (Exception e) {
			addActionError(e.getMessage());
			logger.debug(e.getMessage(), e);
		}

		return INPUT;
	}

	public String doAddGroup() {
		try {
			processGeneral();

			// trap the error message because we still want to get the group mappings processed for the view page
			if (unsubscribedGroup != null && unsubscribedGroup.length() > 0) {
				try {
					crowdClient.addUserToGroup(name, unsubscribedGroup);
				} catch (Exception e) {
					addActionError(e.getMessage());
					logger.debug(e.getMessage(), e);
				}
			}

			// populate our memberships for the view page
			processMemberships();

			return SUCCESS;

		} catch (Exception e) {
			addActionError(e.getMessage());
			logger.debug(e.getMessage(), e);
		}

		return INPUT;
	}

	public String doRemoveGroup() {
		try {
			processGeneral();

			// add the user to the group
			if (removeGroup != null && removeGroup.length() > 0) {
				crowdClient.removeUserFromGroup(name, removeGroup);
			}

			// populate our memberships for the view page
			processMemberships();

			return SUCCESS;

		} catch (Exception e) {
			addActionError(e.getMessage());
			logger.debug(e.getMessage(), e);
		}

		return INPUT;
	}

	private int getParameterCount(String attribute) {
		int count = 0;

		logger.debug("searching attribute: " + attribute);

		Enumeration parameterNames = ServletActionContext.getRequest().getParameterNames();

		while (parameterNames.hasMoreElements()) {
			String parameterName = (String) parameterNames.nextElement();
			if (parameterName.matches("(" + attribute + "){1}\\d+")) {
				String number = parameterName.substring(attribute.length());

				// match the larger value
				int current = Integer.parseInt(number);
				if (current > count) {
					count = current;
				}
			}
		}

		return count;
	}

	public String getRemoveGroup() {
		return removeGroup;
	}

	public void setRemoveGroup(String removeGroup) {
		this.removeGroup = removeGroup;
	}

	public String getUnsubscribedGroup() {
		return unsubscribedGroup;
	}

	public void setUnsubscribedGroup(String unsubscribedGroup) {
		this.unsubscribedGroup = unsubscribedGroup;
	}
}
