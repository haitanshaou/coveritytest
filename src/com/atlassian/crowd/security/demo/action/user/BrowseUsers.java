/*
 * Copyright (c) 2005 Authentisoft, LLC. All Rights Reserved.
 */
package com.atlassian.crowd.security.demo.action.user;

import com.atlassian.crowd.embedded.api.SearchRestriction;
import com.atlassian.crowd.model.user.User;
import com.atlassian.crowd.search.builder.Combine;
import com.atlassian.crowd.search.builder.Restriction;
import com.atlassian.crowd.search.query.entity.restriction.NullRestriction;
import com.atlassian.crowd.search.query.entity.restriction.constants.UserTermKeys;
import com.atlassian.crowd.security.demo.action.AbstractBrowser;
import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class BrowseUsers extends AbstractBrowser {

	private String active;

	private String name;

	private String email;

	public String execute() {
		try {
			// build our search attributes
			List<SearchRestriction> searchRestrictions = new ArrayList<SearchRestriction>();

			// restrict by the active status
			if (StringUtils.isNotBlank(active)) {
				searchRestrictions.add(Restriction.on(UserTermKeys.ACTIVE).exactlyMatching(Boolean.valueOf(active)));
			}

			// restrict by the name
			if (StringUtils.isNotBlank(name)) {
				searchRestrictions.add(Restriction.on(UserTermKeys.USERNAME).exactlyMatching(name));
			}

			// restrict by the email
			if (StringUtils.isNotBlank(email)) {
				searchRestrictions.add(Restriction.on(UserTermKeys.EMAIL).exactlyMatching(email));
			}

			SearchRestriction searchRestriction;
			if (searchRestrictions.isEmpty()) {
				searchRestriction = new NullRestriction() {
				};
			} else {
				searchRestriction = Combine.allOf(searchRestrictions.toArray(new SearchRestriction[0]));
			}

			// run the search
			List<User> users = crowdClient.searchUsers(searchRestriction, resultsStart, resultsPerPage + 1);

			results = users;

		} catch (Exception e) {
			addActionError(e.getMessage());
			logger.debug(e.getMessage(), e);
		}

		return SUCCESS;
	}

	public String getActive() {
		return active;
	}

	public void setActive(String active) {
		this.active = active;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}