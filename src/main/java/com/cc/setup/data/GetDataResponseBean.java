package com.cc.setup.data;

import java.util.HashMap;
import java.util.Map;

public class GetDataResponseBean {
	private String wsCode;	
	private String keyColumn;
	private String keyValue;
	private Map<String, String> columnList = new HashMap<String, String>();
	private String message;
	
	public String getKeyColumn() {
		return keyColumn;
	}
	public void setKeyColumn(String keyColumn) {
		this.keyColumn = keyColumn;
	}
	public Map<String, String> getColumnList() {
		return columnList;
	}
	public void setColumnList(Map<String, String> columnList) {
		this.columnList = columnList;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getWsCode() {
		return wsCode;
	}
	public void setWsCode(String wsCode) {
		this.wsCode = wsCode;
	}
	public String getKeyValue() {
		return keyValue;
	}
	public void setKeyValue(String keyValue) {
		this.keyValue = keyValue;
	}	
	
}
