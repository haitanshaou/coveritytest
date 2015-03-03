/*
 * Copyright (c) 2005 Authentisoft, LLC. All Rights Reserved.
 */
package com.atlassian.crowd.security.demo.action.user;

import com.atlassian.crowd.exception.*;
import com.atlassian.crowd.security.demo.action.BaseAction;

public class RemoveUser extends BaseAction {

	private String name;

	public String doDefault() {
		try {
			// make sure the user exist, display errors if there is a problem
			crowdClient.getUser(name);
		} catch (Exception e) {
			addActionError(e.getMessage());
			logger.debug(e.getMessage(), e);
		}

		return INPUT;
	}

	public String doUpdate() {
		try {

			crowdClient.removeUser(name);

			return SUCCESS;

		} catch (Exception e) {
			addActionError(e.getMessage());
			logger.debug(e.getMessage(), e);

		}

		return INPUT;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}