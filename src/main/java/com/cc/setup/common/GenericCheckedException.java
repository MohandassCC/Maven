package com.cc.setup.common;

import org.springframework.core.NestedCheckedException;

@SuppressWarnings("serial")
public class GenericCheckedException extends NestedCheckedException {

	public GenericCheckedException(String msg, Throwable cause) {
		super(msg, cause);
	}

	public GenericCheckedException(String msg) {
		super(msg);
	}

	@Override
	public String getMessage() {
		return super.getMessage();
	}

}