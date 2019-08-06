package com.cc.setup.bean;

public class SubMenuItems {

	private String subMenuId;
	private String name;
	private String parentCode;
	private String menuId;
	private String sortOrder;
	private String url;
	private boolean submenus;
	public String getSubMenuId() {
		return subMenuId;
	}
	public void setSubMenuId(String subMenuId) {
		this.subMenuId = subMenuId;
	}
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
	public String getMenuId() {
		return menuId;
	}
	public void setMenuId(String menuId) {
		this.menuId = menuId;
	}
	public String getSortOrder() {
		return sortOrder;
	}
	public void setSortOrder(String sortOrder) {
		this.sortOrder = sortOrder;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public boolean isSubmenus() {
		return submenus;
	}
	public void setSubmenus(boolean submenus) {
		this.submenus = submenus;
	}
	
	
	@Override
	public String toString() {
		return "SubMenuItems [subMenuId=" + subMenuId + ", name=" + name
				+ ", parentCode=" + parentCode + ", menuId=" + menuId
				+ ", sortOrder=" + sortOrder + ", url=" + url + ", submenus="
				+ submenus + ", getSubMenuId()=" + getSubMenuId()
				+ ", getName()=" + getName() + ", getParentCode()="
				+ getParentCode() + ", getMenuId()=" + getMenuId()
				+ ", getSortOrder()=" + getSortOrder() + ", getUrl()="
				+ getUrl() + ", isSubmenus()=" + isSubmenus() + ", getClass()="
				+ getClass() + ", hashCode()=" + hashCode() + ", toString()="
				+ super.toString() + "]";
	}

}
