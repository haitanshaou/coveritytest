package com.atlassian.crowd.security.demo.model;

import com.atlassian.crowd.embedded.api.UserComparator;
import com.atlassian.crowd.model.user.User;

public class DemoUser implements User {
	private final String name;

	private final String firstName;

	private final String lastName;

	private final boolean active;

	private final String emailAddress;

	private final String displayName;

	private final long directoryId;

	public DemoUser(final String name, final String firstName, final String lastName, final boolean active,
			final String emailAddress, final String displayName, final long directoryId) {
		this.name = name;
		this.firstName = firstName;
		this.lastName = lastName;
		this.active = active;
		this.emailAddress = emailAddress;
		this.displayName = displayName;
		this.directoryId = directoryId;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public long getDirectoryId() {
		return directoryId;
	}

	public boolean isActive() {
		return active;
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public String getDisplayName() {
		return displayName;
	}

	public int compareTo(final com.atlassian.crowd.embedded.api.User user) {
		return UserComparator.compareTo(this, user);
	}

	public String getName() {
		return name;
	}

	@Override
	public boolean equals(final Object o) {
		return UserComparator.equalsObject(this, o);
	}

	@Override
	public int hashCode() {
		return UserComparator.hashCode(this);
	}

	/**
	 * Creates a new user.
	 */
	public static DemoUser newInstance(final String name, final String firstName, final String lastName,
			final boolean active, final String email, final String displayName) {
		return new DemoUser(name, firstName, lastName, active, email, displayName, -1L);
	}
}
