package com.cc.setup.folderandlist;

import java.sql.SQLException;
import java.util.Properties;

import com.cc.setup.common.GenericDaoException;

public class FolderDbMapper {
	/* @Autowired Folder folder; Object getObj; String message; */
	static Properties properties;
	Object value;
	FolderDaoOracle folderDaoOracle = new FolderDaoOracle();

	public Object MapDBandProcessGet(Object dbType, String subType, String id, Object dataObject)
			throws ClassNotFoundException, SQLException, GenericDaoException {
		if (dbType.toString().equalsIgnoreCase("mongo")) {

		} else if (dbType.toString().equalsIgnoreCase("oracle")) {
			value = folderDaoOracle.getFolder(subType, id);
		} else if (dbType.toString().equalsIgnoreCase("couchbase")) {

		}
		return value;
	}

	public Object MapDBandProcessAdd(Object dbType, String type, Object dataObject) throws GenericDaoException {
		if (dbType.toString().equalsIgnoreCase("mongo")) {

		} else if (dbType.toString().equalsIgnoreCase("oracle")) {
			value = folderDaoOracle.addFolder(dbType.toString(), type, dataObject);
		} else if (dbType.toString().equalsIgnoreCase("couchbase")) {

		}
		return value;
	}

	public Object MapDBandProcessEdit(Object dbType, String type, Object dataObject) throws GenericDaoException {
		if (dbType.toString().equalsIgnoreCase("mongo")) {

		} else if (dbType.toString().equalsIgnoreCase("oracle")) {
			value = folderDaoOracle.editFolder(type, type, dataObject);
		} else if (dbType.toString().equalsIgnoreCase("couchbase")) {

		}
		return value;
	}

	public Object MapDBandProcessDelete(Object dbType, String type, String id) throws GenericDaoException {
		if (dbType.toString().equalsIgnoreCase("mongo")) {

		} else if (dbType.toString().equalsIgnoreCase("oracle")) {
			value = folderDaoOracle.deleteFolder(id);
		} else if (dbType.toString().equalsIgnoreCase("couchbase")) {

		}
		return value;
	}

}
