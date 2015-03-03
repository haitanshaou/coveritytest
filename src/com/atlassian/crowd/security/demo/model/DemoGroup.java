package com.atlassian.crowd.security.demo.model;

import com.atlassian.crowd.model.group.Group;
import com.atlassian.crowd.model.group.GroupComparator;
import com.atlassian.crowd.model.group.GroupType;

public class DemoGroup implements Group {
	private final String name;

	private final long directoryId;

	private final boolean active;

	private final String description;

	private final GroupType type;

	public DemoGroup(final String name, final long directoryId, final boolean active, final String description,
			final GroupType type) {
		this.name = name;
		this.directoryId = directoryId;
		this.active = active;
		this.description = description;
		this.type = type;
	}

	public GroupType getType() {
		return type;
	}

	public boolean isActive() {
		return active;
	}

	public String getDescription() {
		return description;
	}

	public int compareTo(final Group o) {
		return GroupComparator.compareTo(this, o);
	}

	public long getDirectoryId() {
		return directoryId;
	}

	public String getName() {
		return name;
	}

	@Override
	public boolean equals(final Object o) {
		return GroupComparator.equalsObject(this, o);
	}

	@Override
	public int hashCode() {
		return GroupComparator.hashCode(this);
	}

	public static DemoGroup newInstance(final String name, final boolean active, final String description) {
		return new DemoGroup(name, -1L, active, description, GroupType.GROUP);
	}
}
