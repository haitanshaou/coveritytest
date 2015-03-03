/*
 * Copyright (c) 2005 Authentisoft, LLC. All Rights Reserved.
 */
package com.atlassian.crowd.security.demo.action.group;

import com.atlassian.crowd.exception.*;
import com.atlassian.crowd.model.group.Group;
import com.atlassian.crowd.security.demo.action.BaseAction;
import com.atlassian.crowd.security.demo.model.DemoGroup;

public class AddGroup extends BaseAction {
	private Group group;

	private boolean active;

	private String groupDescription;

	private String name;

	public String doUpdate() {
		try {
			// check for errors
			doValidation();
			if (hasErrors() || hasActionErrors()) {
				return INPUT;
			}

			// build our group object
			group = DemoGroup.newInstance(name, active, groupDescription);

			// have the security server add it
			crowdClient.addGroup(group);

			return SUCCESS;

		} catch (Exception e) {
			addActionError(e.getMessage());
			logger.debug(e.getMessage(), e);
		}

		return INPUT;
	}

	public String doDefault() {
		return INPUT;
	}

	protected void doValidation() throws ApplicationPermissionException, InvalidAuthenticationException,
			OperationFailedException {

		if (name == null || name.equals("")) {
			addFieldError("name", getText("group.name.invalid"));

		} else {
			try {
				crowdClient.getGroup(name);

				// this isn't good, this name already exist
				addFieldError("name", getText("invalid.namealreadyexist"));

			} catch (GroupNotFoundException e) {
				// ignore
			}
		}
	}

	public Group getGroup() {
		return group;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getGroupDescription() {
		return groupDescription;
	}

	public void setGroupDescription(String groupDescription) {
		this.groupDescription = groupDescription;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}