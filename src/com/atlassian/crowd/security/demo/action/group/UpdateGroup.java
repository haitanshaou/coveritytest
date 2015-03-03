package com.atlassian.crowd.security.demo.action.group;

import com.atlassian.crowd.exception.*;
import com.atlassian.crowd.model.group.Group;
import com.atlassian.crowd.security.demo.action.BaseAction;
import com.atlassian.crowd.security.demo.model.DemoGroup;
import org.apache.commons.lang.StringUtils;

/**
 * Action to update a Groups groupDescription and 'active' state
 */
public class UpdateGroup extends BaseAction {
	private String name;

	private boolean active;

	private String groupDescription;

	public String doUpdate() {
		doValidation();
		if (hasErrors()) {
			return ERROR;
		}

		try {
			// check that the group exists
			crowdClient.getGroup(name);

			Group newGroup = DemoGroup.newInstance(name, active, groupDescription);

			// Update the group
			crowdClient.updateGroup(newGroup);
		} catch (GroupNotFoundException e) {
			addActionError("The group you are trying to update does not exist");
		} catch (ApplicationPermissionException e) {
			addActionError("Application does not have permission to perform the operation");
		} catch (CrowdException e) {
			addActionError(e.getMessage());
		}

		return SUCCESS;
	}

	private void doValidation() {
		if (StringUtils.isBlank(name)) {
			addFieldError("name", "You must supply a name field");
		}
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGroupDescription() {
		return groupDescription;
	}

	public void setGroupDescription(String groupDescription) {
		this.groupDescription = groupDescription;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}
}
