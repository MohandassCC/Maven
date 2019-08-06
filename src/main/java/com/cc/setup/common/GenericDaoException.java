package com.cc.setup.common;

@SuppressWarnings("serial")
public class GenericDaoException extends GenericCheckedException {

	public GenericDaoException(String msg, Throwable cause) {
		super(msg, cause);
	}

	public GenericDaoException(String msg) {
		super(msg);
	}

	@Override
	public String getMessage() {
		return super.getMessage();
	}
}
