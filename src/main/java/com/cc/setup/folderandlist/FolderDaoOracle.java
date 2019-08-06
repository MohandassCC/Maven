package com.cc.setup.folderandlist;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;

import com.cc.setup.common.GenericDaoException;
import com.cc.setup.data.DataBaseInteraction;


public class FolderDaoOracle implements FolderCRUDLinker {
	public DataBaseInteraction dataBaseInteraction = new DataBaseInteraction();
	public Map<String, String> mongoDetails;

	@Override
	public List<Folder> getFolder(String subType, String id) throws SQLException, ClassNotFoundException, GenericDaoException {
		dataBaseInteraction = new DataBaseInteraction();
		Connection connection = dataBaseInteraction.getConnection();
		Statement stmt = connection.createStatement();
		subType = subType.toLowerCase();
		ResultSet rsScheduleImport = null;
		if ("0".equalsIgnoreCase(id)) {
			rsScheduleImport = stmt.executeQuery("select * from ORC_FOLDER where FLD_FOLDER_TYPE='" + subType
					+ "' order by FLD_ID asc ");
		} else {
			rsScheduleImport = stmt.executeQuery("select * from ORC_FOLDER where FLD_ID=" + id);
		}
		List<Folder> folderList = new ArrayList<Folder>();

		while (rsScheduleImport.next()) {
			Folder folder = new Folder();
			folder.setId(rsScheduleImport.getInt("FLD_ID"));
			folder.setShortName(rsScheduleImport.getString("FLD_SHORT_NAME"));
			folder.setLongName(rsScheduleImport.getString("FLD_LONG_NAME"));
			folder.setParentFldId(rsScheduleImport.getInt("FLD_PARENT_FLD_ID"));
			folder.setViewType(rsScheduleImport.getString("FLD_VIEW_TYPE"));
			folder.setFolderType(rsScheduleImport.getString("FLD_FOLDER_TYPE"));
			folder.setFolderSubType(rsScheduleImport.getString("FLD_SUB_TYPE"));
			folder.setCreateUser(rsScheduleImport.getString("FLD_CREATE_USER"));
			folder.setCreateDate(rsScheduleImport.getDate("FLD_CREATE_DATE"));
			folder.setUpdateUser(rsScheduleImport.getString("FLD_UPDATE_USER"));
			folder.setUpdateDate(rsScheduleImport.getDate("FLD_UPDATE_DATE"));
			folder.setLastModified(rsScheduleImport.getTimestamp("FLD_LAST_MODIFIED"));
			folderList.add(folder);
		}
		try {
			connection.close();
		} catch (Exception e) {

		}

		return folderList;
	}

	@Override
	public String addFolder(String subType, String id, Object object) throws GenericDaoException {
		dataBaseInteraction = new DataBaseInteraction();
		Connection connection = null;
		try {
			connection = dataBaseInteraction.getConnection();
		} catch (ClassNotFoundException | SQLException e2) {
			
			e2.printStackTrace();
		}
		ObjectMapper objectmapper = new ObjectMapper();
		Folder folder = null;
		String message = null;

		try {
			String folderjson = object.toString();
			try {
				folder = objectmapper.readValue(folderjson, Folder.class);
			} catch (IOException e1) {
				
				e1.printStackTrace();
			}

			folder.setId(dataBaseInteraction.getSequenceId("FLD_ID"));
			DateFormat datePattern = new SimpleDateFormat("dd/MM/yyyy");
			Date date = new Date();
			System.out.println(date);
			String currentDate = datePattern.format(date);
			Date date2 = null;
			try {
				date2 = datePattern.parse(currentDate);
			} catch (ParseException e) {
				
				throw new GenericDaoException(e.getMessage());
			}
			folder.setCreateDate(date);
			folder.setUpdateDate(date);
			folder.setParentFldId(0);
			folder.setCreateUser("cc");
			folder.setUpdateUser("cc");
			folder.setFolderType(folder.getFolderType().toLowerCase());
			Timestamp fromTS1 = new Timestamp(date2.getTime());
			folder.setLastModified(null);
			Statement stmt = connection.createStatement();
			String addQuery = "INSERT INTO ORC_FOLDER (FLD_ID,FLD_SHORT_NAME,FLD_LONG_NAME,FLD_PARENT_FLD_ID,"
					+ "FLD_VIEW_TYPE,FLD_FOLDER_TYPE,FLD_CREATE_USER,FLD_CREATE_DATE,FLD_UPDATE_USER,"
					+ "FLD_UPDATE_DATE,FLD_LAST_MODIFIED) VALUES (" + folder.getId() + ",'" + folder.getShortName()
					+ "','" + folder.getLongName() + "'," + folder.getParentFldId() + ",'" + folder.getViewType()
					+ "','" + folder.getFolderType() + "','" + folder.getCreateUser() + "',null,'"
					+ folder.getUpdateUser() + "',null," + folder.getLastModified() + ")";
			System.out.println(addQuery);
			ResultSet rsScheduleImport2 = stmt.executeQuery(addQuery);

			/* StringBuilder insertQuery = new StringBuilder();
			 * insertQuery.append("insert into TEMPTAB values(?,?)"); PreparedStatement prep =
			 * connection.prepareStatement(addQuery); for (int i = 0; i < count.size(); i++) {
			 * String value = count.get(i).toString(); prep.setString(1, value); prep.setString(2,
			 * value); prep.addBatch(); prep.executeBatch(); } */
			message = "success";
			dataBaseInteraction.updateSequence("FLD_ID", folder.getId());
			try {
				connection.close();
			} catch (Exception e) {

			}
		} catch (SQLException e) {
			
			throw new GenericDaoException(e.getMessage());
		}
		return message;
	}

	@Override
	public String editFolder(String subType, String id, Object object) throws GenericDaoException {
		Connection connection = null;
		try {
			connection = dataBaseInteraction.getConnection();
		} catch (ClassNotFoundException | SQLException e2) {
			
			e2.printStackTrace();
		}
		ObjectMapper objectmapper = new ObjectMapper();
		Folder folder = null;
		String message = null;
		try {
			String folderjson = object.toString();
			try {
				folder = objectmapper.readValue(folderjson, Folder.class);
			} catch (IOException e1) {
				
				e1.printStackTrace();
			}

			DateFormat datePattern = new SimpleDateFormat("dd/MM/yyyy");
			DateFormat datePattern2 = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

			Date date = new Date();
			System.out.println(date);
			String currentDate = datePattern.format(date);
			String lastModifiedDate = datePattern2.format(date);
			Date date2 = null;
			try {
				date2 = datePattern.parse(currentDate);
			} catch (ParseException e) {
				
				throw new GenericDaoException(e.getMessage());
			}
			folder.setUpdateDate(date);
			folder.setParentFldId(0);
			folder.setCreateUser("cc");
			folder.setUpdateUser("cc");
			Timestamp timestamp = dataBaseInteraction.getLastModified(lastModifiedDate);
			folder.setLastModified(timestamp);
			folder.setUpdateDate(date2);
			String updateQuery = "UPDATE ORC_FOLDER SET FLD_SHORT_NAME=?, FLD_LONG_NAME=?, FLD_VIEW_TYPE=?, FLD_FOLDER_TYPE=?,"
					+ "FLD_UPDATE_USER=?,FLD_UPDATE_DATE=?,FLD_LAST_MODIFIED=? WHERE FLD_ID=?";
			PreparedStatement preparedStatement = null;
			preparedStatement = connection.prepareStatement(updateQuery);
			preparedStatement.setString(1, folder.getShortName());
			preparedStatement.setString(2, folder.getLongName());
			preparedStatement.setString(3, folder.getViewType());
			preparedStatement.setString(4, folder.getFolderType());
			preparedStatement.setString(5, folder.getUpdateUser());
			preparedStatement.setObject(6, currentDate);
			preparedStatement.setObject(7, timestamp);
			preparedStatement.setInt(8, folder.getId());
			preparedStatement.executeUpdate();
			/* StringBuilder insertQuery = new StringBuilder();
			 * insertQuery.append("insert into TEMPTAB values(?,?)"); PreparedStatement prep =
			 * connection.prepareStatement(addQuery); for (int i = 0; i < count.size(); i++) {
			 * String value = count.get(i).toString(); prep.setString(1, value); prep.setString(2,
			 * value); prep.addBatch(); prep.executeBatch(); } */
			message = "success";
			try {
				connection.close();
			} catch (Exception e) {

			}
		} catch (SQLException e) {			
			throw new GenericDaoException(e.getMessage());
		}
		return message;
	}

	@Override
	public String deleteFolder(String id) throws GenericDaoException {
		String message = "Error";
		dataBaseInteraction = new DataBaseInteraction();
		Connection connection = null;
		try {
			connection = dataBaseInteraction.getConnection();
			Statement stmt = connection.createStatement();
			ResultSet rs = stmt.executeQuery("DELETE FROM ORC_FOLDER WHERE FLD_ID=" + id);
			message = "Deleted successfully";
		} catch (ClassNotFoundException | SQLException e2) {
			
			e2.printStackTrace();
			message = e2.getMessage();
		}
		try {
			connection.close();
		} catch (Exception e) {

		}
		return message;
	}

}
