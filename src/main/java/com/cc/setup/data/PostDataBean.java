package com.cc.setup.data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PostDataBean {
	private String moduleCode;
	private String objectCode;
	private String wsCode;	
	private String action;//I or U or IU
	private String tableName;
	private String keyColumn;
	private String keyValue;
	private List<Map<String, String>> columnValueMap = new ArrayList();
	private Map<String, String> columnDataTypeMap = new HashMap<String, String>();
	private String[] whereList;
	private String csrfToken;
	private List<PostDataBean> childGetBean;
	
	public List<PostDataBean> getChildGetBean() {
		return childGetBean;
	}
	public void setChildGetBean(List<PostDataBean> childGetBean) {
		this.childGetBean = childGetBean;
	}

	
	public String getModuleCode() {
		return moduleCode;
	}
	public void setModuleCode(String moduleCode) {
		this.moduleCode = moduleCode;
	}
	public String getObjectCode() {
		return objectCode;
	}
	public void setObjectCode(String objectCode) {
		this.objectCode = objectCode;
	}
	public String getCsrfToken() {
		return csrfToken;
	}
	public void setCsrfToken(String csrfToken) {
		this.csrfToken = csrfToken;
	}
	public String getWsCode() {
		return wsCode;
	}
	public void setWsCode(String wsCode) {
		this.wsCode = wsCode;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}	
	public List<Map<String, String>> getColumnValueMap() {
		return columnValueMap;
	}
	public void setColumnValueMap(List<Map<String, String>> columnValueMap) {
		this.columnValueMap = columnValueMap;
	}
	public String getKeyColumn() {
		return keyColumn;
	}
	public void setKeyColumn(String keyColumn) {
		this.keyColumn = keyColumn;
	}
	public String getKeyValue() {
		return keyValue;
	}
	public void setKeyValue(String keyValue) {
		this.keyValue = keyValue;
	}
	public String[] getWhereList() {
		return whereList;
	}
	public void setWhereList(String[] whereList) {
		this.whereList = whereList;
	}
	public Map<String, String> getColumnDataTypeMap() {
		return columnDataTypeMap;
	}
	public void setColumnDataTypeMap(Map<String, String> columnDataTypeMap) {
		this.columnDataTypeMap = columnDataTypeMap;
	}	
	
}
