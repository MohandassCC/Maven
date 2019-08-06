package com.cc.setup.util;

import java.util.List;

public class DbReadListBean {

	private String dbReadId;
	private List<DBReadDetailsBean>  dbReadbean;

	public List<DBReadDetailsBean> getDbReadbean() {
		return dbReadbean;
	}

	public void setDbReadbean(List<DBReadDetailsBean> dbReadbean) {
		this.dbReadbean = dbReadbean;
	}

	public String getDbReadId() {
		return dbReadId;
	}

	public void setDbReadId(String dbReadId) {
		this.dbReadId = dbReadId;
	}
	 
	 
	 
	
}
