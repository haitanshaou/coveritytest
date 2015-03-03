/*
 * Copyright (c) 2005 Authentisoft, LLC. All Rights Reserved.
 */
package com.atlassian.crowd.security.demo.action.group;

import com.atlassian.crowd.embedded.api.SearchRestriction;
import com.atlassian.crowd.model.group.Group;
import com.atlassian.crowd.search.builder.Combine;
import com.atlassian.crowd.search.builder.Restriction;
import com.atlassian.crowd.search.query.entity.restriction.NullRestriction;
import com.atlassian.crowd.search.query.entity.restriction.constants.GroupTermKeys;
import com.atlassian.crowd.security.demo.action.AbstractBrowser;
import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class BrowseGroups extends AbstractBrowser {

	private String active;

	private String name;

	public String execute() {
		try {
			// build our search attributes
			List<SearchRestriction> searchRestrictions = new ArrayList<SearchRestriction>();

			// restrict by the active status
			if (StringUtils.isNotBlank(active)) {
				searchRestrictions.add(Restriction.on(GroupTermKeys.ACTIVE).exactlyMatching(Boolean.valueOf(active)));
			}

			// restrict by the name
			if (StringUtils.isNotBlank(name)) {
				searchRestrictions.add(Restriction.on(GroupTermKeys.NAME).exactlyMatching(name));
			}

			SearchRestriction searchRestriction;
			if (searchRestrictions.isEmpty()) {
				searchRestriction = new NullRestriction() {
				};
			} else {
				searchRestriction = Combine.allOf(searchRestrictions.toArray(new SearchRestriction[0]));
			}

			// run the search
			List<Group> groups = crowdClient.searchGroups(searchRestriction, resultsStart, resultsPerPage + 1);

			results = groups;

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}