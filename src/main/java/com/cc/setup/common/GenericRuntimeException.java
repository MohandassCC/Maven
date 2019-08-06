package com.cc.setup.common;

import org.springframework.core.NestedRuntimeException;

public abstract class GenericRuntimeException extends NestedRuntimeException {
	public GenericRuntimeException(String msg, Throwable cause) {
		super(msg, cause);
	}
	
	public GenericRuntimeException(String msg) {
		super(msg);
	}

	@Override
	public String getMessage() {
		return super.getMessage();
	}
}
