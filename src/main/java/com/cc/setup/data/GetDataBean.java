package com.cc.setup.data;

public class GetDataBean {
	private String wsCode;	
	private String[] columnList;
	private String keyColumn;
	private String[] tableNameList;
	private String[] filtersList;		
	private String[] joinsList;	
	private String moduleCode;
	private String objectCode;
	private String csrfToken;
	
	public String getWsCode() {
		return wsCode;
	}
	public void setWsCode(String wsCode) {
		this.wsCode = wsCode;
	}	
	public String[] getTableNameList() {
		return tableNameList;
	}
	public void setTableNameList(String[] tableNameList) {
		this.tableNameList = tableNameList;
	}
	public String getKeyColumn() {
		return keyColumn;
	}
	public void setKeyColumn(String keyColumn) {
		this.keyColumn = keyColumn;
	}
	public String[] getColumnList() {
		return columnList;
	}
	public void setColumnList(String[] columnList) {
		this.columnList = columnList;
	}
	public String[] getFiltersList() {
		return filtersList;
	}
	public void setFiltersList(String[] filtersList) {
		this.filtersList = filtersList;
	}
	public String[] getJoinsList() {
		return joinsList;
	}
	public void setJoinsList(String[] joinsList) {
		this.joinsList = joinsList;
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
}
