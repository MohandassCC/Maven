package com.cc.setup.bean;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MenuItems {

	private String menuId;
	private String name;
	private String parentCode;
	private String sortOrder;
	private String type;
	private String moduleCode;
	private String module;
	private boolean subMenu;
	

	// private String menuURL;
	private String url;
	private List<SubMenuItems> subMenuItems = new ArrayList<SubMenuItems>();
	private Map<String,String> userSessionIdMap=new HashMap<String,String>();

	
	public Map<String, String> getUserSessionIdMap() {
		return userSessionIdMap;
	}

	public void setUserSessionIdMap(Map<String, String> userSessionIdMap) {
		this.userSessionIdMap = userSessionIdMap;
	}

	public String getMenuId() {
		return menuId;
	}

	public void setMenuId(String menuId) {
		this.menuId = menuId;
	}

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	/*
	 * public String getMenuURL() { return menuURL; }
	 * 
	 * public void setMenuURL(String menuURL) { this.menuURL = menuURL; }
	 */
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getParentCode() {
		return parentCode;
	}

	public void setParentCode(String parentCode) {
		this.parentCode = parentCode;
	}

	public String getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(String sortOrder) {
		this.sortOrder = sortOrder;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getModuleCode() {
		return moduleCode;
	}

	public void setModuleCode(String moduleCode) {
		this.moduleCode = moduleCode;
	}

	public boolean isSubMenu() {
		return subMenu;
	}

	public void setSubMenu(boolean subMenu) {
		this.subMenu = subMenu;
	}

	public List<SubMenuItems> getSubMenuItems() {
		return subMenuItems;
	}

	public void setSubMenuItems(List<SubMenuItems> subMenuItems) {
		this.subMenuItems = subMenuItems;
	}

}
