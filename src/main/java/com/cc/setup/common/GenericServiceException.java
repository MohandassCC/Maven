package com.cc.setup.common;

@SuppressWarnings("serial")
public class GenericServiceException extends GenericCheckedException {

	public GenericServiceException(String msg, Throwable cause) {
		super(msg, cause);
	}

	public GenericServiceException(String msg) {
		super(msg);
	}

	@Override
	public String getMessage() {
		return super.getMessage();
	}
}
