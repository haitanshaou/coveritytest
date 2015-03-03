/*
 * Copyright (c) 2005 Authentisoft, LLC. All Rights Reserved.
 */
package com.atlassian.crowd.security.demo.action;

import com.atlassian.crowd.exception.InvalidAuthenticationException;
import com.atlassian.crowd.integration.http.CrowdHttpAuthenticator;
import com.atlassian.crowd.model.user.User;
import com.atlassian.crowd.service.client.CrowdClient;
import com.opensymphony.webwork.ServletActionContext;
import com.opensymphony.xwork.ActionSupport;
import org.apache.log4j.Logger;

import javax.servlet.http.HttpSession;

public class BaseAction extends ActionSupport {
	protected final Logger logger = Logger.getLogger(this.getClass());

	protected int tab = 1;

	protected User remoteUser;

	protected Boolean authenticated = null;

	protected CrowdClient crowdClient;

	protected CrowdHttpAuthenticator crowdHttpAuthenticator;

	public String doDefault() {
		return SUCCESS;
	}

	public String getDisplayName() throws InvalidAuthenticationException {
		if (!isAuthenticated())
			return null;

		String displayName = "";

		User user = getRemoteUser();
		if (user != null) {
			displayName = user.getDisplayName();
		}

		return displayName;
	}

	public User getRemoteUser() throws InvalidAuthenticationException {
		if (!isAuthenticated())
			return null;

		if (remoteUser == null) {

			try {
				// find the user from the authenticated token key.
				remoteUser = crowdHttpAuthenticator.getUser(ServletActionContext.getRequest());
			} catch (Exception e) {
				logger.info(e.getMessage(), e);

				throw new InvalidAuthenticationException("", e);
			}
		}

		return remoteUser;
	}

	/**
	 * Checks if a user is currently authenticated verses the Crowd server. 
	 * @return <code>true</code> if and only if the user is currently authenticated, otherwise <code>false</code>.
	 */
	public boolean isAuthenticated() {
		if (authenticated == null) {
			try {
				authenticated = crowdHttpAuthenticator.isAuthenticated(ServletActionContext.getRequest(),
						ServletActionContext.getResponse());
			} catch (Exception e) {
				logger.info(e.getMessage(), e);
				authenticated = Boolean.FALSE;
			}
		}
		return authenticated;
	}

	protected HttpSession getSession() {
		return ServletActionContext.getRequest().getSession();
	}

	public int getTab() {
		return tab;
	}

	public void setTab(int tab) {
		this.tab = tab;
	}

	public CrowdClient getCrowdClient() {
		return crowdClient;
	}

	public void setCrowdClient(CrowdClient crowdClient) {
		this.crowdClient = crowdClient;
	}

	public CrowdHttpAuthenticator getCrowdHttpAuthenticator() {
		return crowdHttpAuthenticator;
	}

	public void setCrowdHttpAuthenticator(CrowdHttpAuthenticator httpAuthenticator) {
		this.crowdHttpAuthenticator = httpAuthenticator;
	}
}