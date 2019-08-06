package com.cc.setup.util;

import java.sql.Timestamp;
import java.util.Date;

public class MetaData {
	private Integer metadatadetailid;
	private Integer metadataid;
	private String sourceentity;
	private String sourceattribute;
	private String attributedatatype;
	private Integer attributedatalength;
	private String attributemandatoryflag;
	private String keyattributeflag;
	private Integer attributesortorder;
	private String attributetitle;
	private Date createdate;
	private String createuser;
	private Date updatedate;
	private String updateuser;
	private Timestamp lastmodified;
	private String inputsourceid;
	
	public Integer getMetadatadetailid() {
		return metadatadetailid;
	}
	public Integer getMetadataid() {
		return metadataid;
	}
	public String getSourceentity() {
		return sourceentity;
	}
	public String getSourceattribute() {
		return sourceattribute;
	}
	public String getAttributedatatype() {
		return attributedatatype;
	}
	public Integer getAttributedatalength() {
		return attributedatalength;
	}
	public String getAttributemandatoryflag() {
		return attributemandatoryflag;
	}
	public String getKeyattributeflag() {
		return keyattributeflag;
	}
	public Integer getAttributesortorder() {
		return attributesortorder;
	}
	public String getAttributetitle() {
		return attributetitle;
	}
	public Date getCreatedate() {
		return createdate;
	}
	public String getCreateuser() {
		return createuser;
	}
	public Date getUpdatedate() {
		return updatedate;
	}
	public String getUpdateuser() {
		return updateuser;
	}
	public Timestamp getLastmodified() {
		return lastmodified;
	}
	public String getInputsourceid() {
		return inputsourceid;
	}
	public void setMetadatadetailid(Integer metadatadetailid) {
		this.metadatadetailid = metadatadetailid;
	}
	public void setMetadataid(Integer metadataid) {
		this.metadataid = metadataid;
	}
	public void setSourceentity(String sourceentity) {
		this.sourceentity = sourceentity;
	}
	public void setSourceattribute(String sourceattribute) {
		this.sourceattribute = sourceattribute;
	}
	public void setAttributedatatype(String attributedatatype) {
		this.attributedatatype = attributedatatype;
	}
	public void setAttributedatalength(Integer attributedatalength) {
		this.attributedatalength = attributedatalength;
	}
	public void setAttributemandatoryflag(String attributemandatoryflag) {
		this.attributemandatoryflag = attributemandatoryflag;
	}
	public void setKeyattributeflag(String keyattributeflag) {
		this.keyattributeflag = keyattributeflag;
	}
	public void setAttributesortorder(Integer attributesortorder) {
		this.attributesortorder = attributesortorder;
	}
	public void setAttributetitle(String attributetitle) {
		this.attributetitle = attributetitle;
	}
	public void setCreatedate(Date createdate) {
		this.createdate = createdate;
	}
	public void setCreateuser(String createuser) {
		this.createuser = createuser;
	}
	public void setUpdatedate(Date updatedate) {
		this.updatedate = updatedate;
	}
	public void setUpdateuser(String updateuser) {
		this.updateuser = updateuser;
	}
	public void setLastmodified(Timestamp lastmodified) {
		this.lastmodified = lastmodified;
	}
	public void setInputsourceid(String inputsourceid) {
		this.inputsourceid = inputsourceid;
	} 	
}
