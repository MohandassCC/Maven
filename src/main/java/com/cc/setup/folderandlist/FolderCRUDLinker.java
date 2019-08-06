package com.cc.setup.folderandlist;

import java.sql.SQLException;
import java.util.List;

import com.cc.setup.common.GenericDaoException;

public interface FolderCRUDLinker {

	public List<Folder> getFolder(String subType, String id) throws SQLException, ClassNotFoundException, GenericDaoException;

	public String addFolder(String subType, String id, Object object) throws GenericDaoException;

	public String editFolder(String subType, String id, Object object) throws GenericDaoException;

	public String deleteFolder(String id) throws GenericDaoException;

}
