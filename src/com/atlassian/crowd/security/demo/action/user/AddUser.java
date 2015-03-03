/*
 * Copyright (c) 2005 Authentisoft, LLC. All Rights Reserved.
 */
package com.atlassian.crowd.security.demo.action.user;

import com.atlassian.crowd.embedded.api.PasswordCredential;
import com.atlassian.crowd.exception.*;
import com.atlassian.crowd.model.user.User;
import com.atlassian.crowd.security.demo.action.BaseAction;
import com.atlassian.crowd.security.demo.model.DemoUser;

public class AddUser extends BaseAction {

	private User user;

	protected String name;

	protected String password;

	protected String passwordConfirm;

	protected String firstname;

	protected String lastname;

	protected String email;

	protected boolean active;

	public String doDefault() {
		return INPUT;
	}

	public String doUpdate() {
		try {
			// check for errors
			doValidation();
			if (hasErrors() || hasActionErrors()) {
				return INPUT;
			}

			// build our user object
			user = DemoUser.newInstance(name, firstname, lastname, active, email, firstname + " " + lastname);

			// our password
			PasswordCredential credentials = new PasswordCredential(password);

			// have the Crowd server add it
			crowdClient.addUser(user, credentials);

			return SUCCESS;

		} catch (Exception e) {
			addActionError(e.getMessage());
			logger.debug(e.getMessage(), e);
		}

		return INPUT;
	}

	protected void doValidation() {

		if (name == null || name.equals("")) {
			addFieldError("name", getText("user.name.invalid"));

		} else {
			try {
				crowdClient.getUser(name);

				// this isn't good, this name already exist
				addFieldError("name", getText("invalid.namealreadyexist"));

			} catch (UserNotFoundException e) {
				// ignore
			} catch (Exception e) {
				addActionError(e.getMessage());
				logger.debug(e.getMessage(), e);
			}
		}

		if (password != null && !password.equals("")) {

			if (passwordConfirm == null || passwordConfirm.equals("")) {
				addFieldError("password", getText("user.password.invalid"));
				addFieldError("confirmPassword", "");

			} else if (!password.equals(passwordConfirm)) {
				addFieldError("password", getText("user.passwordconfirm.nomatch"));
				addFieldError("confirmPassword", "");
			}

		} else {
			addFieldError("password", getText("user.password.invalid"));
			addFieldError("confirmPassword", "");
		}
	}

	public User getUser() {
		return user;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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
