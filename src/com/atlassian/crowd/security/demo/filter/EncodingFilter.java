package com.atlassian.crowd.security.demo.filter;

import com.atlassian.core.filters.encoding.AbstractEncodingFilter;

/**
 * Sets the character encoding of anything posted/get to an HTTP request.
 */
public class EncodingFilter extends AbstractEncodingFilter {
	/**
	 * Gets the Crowd encoding type.
	 *
	 * @return The default character encoding type.
	 */
	protected String getEncoding() {
		return "UTF-8";

	}

	/**
	 * Gest the Crowd default page content type.
	 *
	 * @return The default content type.
	 */
	protected String getContentType() {
		return "text/html; charset=UTF-8";
	}
}
