package com.cc.setup.folderandlist;

import java.sql.Timestamp;
import java.util.Date;

public class Folder {

	private Integer id;
	private String shortName;
	private String longName;
	private Integer parentFldId;
	private String viewType;
	private String folderType;
	private String folderSubType;
	private String createUser;
	private Date createDate;
	private String updateUser;
	private Date updateDate;
	private Timestamp lastModified;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	public String getLongName() {
		return longName;
	}

	public void setLongName(String longName) {
		this.longName = longName;
	}

	public Integer getParentFldId() {
		return parentFldId;
	}

	public void setParentFldId(Integer parentFldId) {
		this.parentFldId = parentFldId;
	}

	public String getViewType() {
		return viewType;
	}

	public void setViewType(String viewType) {
		this.viewType = viewType;
	}

	public String getFolderType() {
		return folderType;
	}

	public void setFolderType(String folderType) {
		this.folderType = folderType;
	}

	public String getFolderSubType() {
		return folderSubType;
	}

	public void setFolderSubType(String folderSubType) {
		this.folderSubType = folderSubType;
	}

	public String getCreateUser() {
		return createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public Timestamp getLastModified() {
		return lastModified;
	}

	public void setLastModified(Timestamp lastModified) {
		this.lastModified = lastModified;
	}

}
