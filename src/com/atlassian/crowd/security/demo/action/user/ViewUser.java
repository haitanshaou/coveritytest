/*
 * Copyright (c) 2005 Authentisoft, LLC. All Rights Reserved.
 */
package com.atlassian.crowd.security.demo.action.user;

import com.atlassian.crowd.exception.*;
import com.atlassian.crowd.model.group.Group;
import com.atlassian.crowd.model.user.User;
import com.atlassian.crowd.search.query.entity.restriction.NullRestrictionImpl;
import com.atlassian.crowd.security.demo.Constants;
import com.atlassian.crowd.security.demo.action.BaseAction;

import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.List;

public class ViewUser extends BaseAction {
	protected User user;

	private List<Group> groups;

	protected List<Group> subscribedGroups;

	protected List<Group> unsubscribedGroups;

	protected String name;

	protected String description;

	protected boolean active;

	protected String firstname;

	protected String lastname;

	protected String email;

	protected String password;

	protected String passwordConfirm;

	public String doDefault() {
		try {
			processGeneral();
			processMemberships();

		} catch (Exception e) {
			addActionError(e.getMessage());
			logger.debug(e.getMessage(), e);
		}

		return SUCCESS;
	}

	protected void processGeneral() throws InvalidAuthorizationTokenException, RemoteException,
			ApplicationPermissionException, UserNotFoundException, InvalidAuthenticationException, OperationFailedException {
		user = crowdClient.getUser(name);

		active = user.isActive();
		firstname = user.getFirstName();
		lastname = user.getLastName();
		email = user.getEmailAddress();
	}

	protected void processMemberships() throws InvalidAuthorizationTokenException, RemoteException,
			ApplicationPermissionException, InvalidAuthenticationException, OperationFailedException {
		// find all the groups
		groups = crowdClient.searchGroups(NullRestrictionImpl.INSTANCE, 0, Constants.ALL_RESULTS);

		// setup our list for the view page
		processGroups();
	}

	protected List<Group> processGroups() {
		unsubscribedGroups = new ArrayList<Group>();
		subscribedGroups = new ArrayList<Group>();

		try {
			subscribedGroups = crowdClient.getGroupsForUser(user.getName(), 0, Constants.ALL_RESULTS);
			unsubscribedGroups = new ArrayList<Group>(groups);
			unsubscribedGroups.removeAll(subscribedGroups);
		} catch (Exception e) {
			logger.warn(e.getMessage(), e);
		}

		return unsubscribedGroups;
	}

	public User getUser() {
		return user;
	}

	public List getSubscribedGroups() {
		return subscribedGroups;
	}

	public List getUnsubscribedGroups() {
		return unsubscribedGroups;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPasswordConfirm() {
		return passwordConfirm;
	}

	public void setPasswordConfirm(String passwordConfirm) {
		this.passwordConfirm = passwordConfirm;
	}

}