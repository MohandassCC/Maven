package com.cc.setup.common;

import java.util.ArrayList;

public class FunctionListParentBean {

	private String functionHeader;
    private ArrayList<FunctionListChildBean> childdata;
    
    
	public String getFunctionHeader() {
		return functionHeader;
	}
	public void setFunctionHeader(String functionHeader) {
		this.functionHeader = functionHeader;
	}
	public ArrayList<FunctionListChildBean> getChilddata() {
		return childdata;
	}
	public void setChilddata(ArrayList<FunctionListChildBean> childdata) {
		this.childdata = childdata;
	}
	
    
    
}
