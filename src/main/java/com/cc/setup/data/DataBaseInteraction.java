package com.cc.setup.data;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.springframework.stereotype.Component;

import com.cc.setup.common.GenericDaoException;
import com.cc.setup.property.GetPropertyDetails;

@Component
public class DataBaseInteraction {

	public Connection connection;

	public Connection getConnection() throws SQLException, ClassNotFoundException, GenericDaoException {
		this.connection = null;
		try {
			Class.forName(GetPropertyDetails.propertyCollection.getDbPropertyArray().getJdbcdriver());
			String url = GetPropertyDetails.propertyCollection.getDbPropertyArray().getJdbcurl();
			String username = GetPropertyDetails.propertyCollection.getDbPropertyArray().getUsername();
			String password = GetPropertyDetails.propertyCollection.getDbPropertyArray().getPassword();
			connection = DriverManager.getConnection(url, username, password);
		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}
		return connection;

	}

	public Integer getSequenceId(String type) throws GenericDaoException {
		Integer Id = null;
		try {
			Connection connection = getConnection();
			Statement stmt = connection.createStatement();
			ResultSet rsScheduleImport = stmt
					.executeQuery("select IMP_NEXT_VALUE from IMPORT_MAX_SEQUENCES where IMP_ENTITY='" + type + "'");
			while (rsScheduleImport.next()) {
				Id = rsScheduleImport.getInt("IMP_NEXT_VALUE");
			}
			/*
			 * Statement stmt2 = connection.createStatement(); String
			 * updateQuery = "UPDATE IMPORT_MAX_SEQUENCES SET IMP_NEXT_VALUE=" +
			 * (Id + 1) + " where IMP_ENTITY='" + type + "'";
			 * connection.prepareStatement(updateQuery).executeUpdate();
			 */

		} catch (SQLException e) {
			
			throw new GenericDaoException(e.getMessage());
		} catch (ClassNotFoundException e) {
			
			throw new GenericDaoException(e.getMessage());
		}

		return Id;
	}

	public Timestamp getLastModified(String currentDate) throws GenericDaoException {
		DateFormat datePattern = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		java.util.Date parsedTimeStamp = null;
		try {
			parsedTimeStamp = datePattern.parse(currentDate);
		} catch (ParseException e) {
			
			throw new GenericDaoException(e.getMessage());
		}
		Timestamp timestamp = new Timestamp(parsedTimeStamp.getTime());

		return timestamp;

	}

	public Boolean updateSequence(String type, Integer id) throws GenericDaoException {
		Boolean updated = false;
		try {
			Connection connection = getConnection();
			String updateQuery = "UPDATE IMPORT_MAX_SEQUENCES SET IMP_NEXT_VALUE=" + (id + 1) + " where IMP_ENTITY='"
					+ type + "'";
			connection.prepareStatement(updateQuery).executeUpdate();
			updated = true;
		} catch (SQLException s) {

		} catch (ClassNotFoundException e) {
			
			throw new GenericDaoException(e.getMessage());
		}
		return updated;
	}

	public Integer getWorkflowSequenceId(String type) throws GenericDaoException {
		Integer Id = null;
		try {
			Connection connection = getConnection();
			Statement stmt = connection.createStatement();
			ResultSet rsScheduleImport = stmt.executeQuery("select NEXT_VAL from WORKFLOW_MAXSEQUENCE where KEY_COL='"
					+ type + "'");
			while (rsScheduleImport.next()) {
				Id = rsScheduleImport.getInt("NEXT_VAL");
			}
			// Statement stmt2 = connection.createStatement();
			// String updateQuery = "UPDATE WORKFLOW_MAXSEQUENCE SET NEXT_VAL="
			// + (Id + 1) +
			// " where KEY_COL='" + type
			// + "'";
			// connection.prepareStatement(updateQuery).executeUpdate();
			connection.close();
		} catch (SQLException e) {
			
			throw new GenericDaoException(e.getMessage());
		} catch (ClassNotFoundException e) {
			
			throw new GenericDaoException(e.getMessage());
		}

		return Id;
	}

	public Boolean updateWorkflowSequence(String type, Integer id) throws GenericDaoException {
		Boolean updated = false;
		try {
			Connection connection = getConnection();
			String updateQuery = "UPDATE WORKFLOW_MAXSEQUENCE SET NEXT_VAL=" + (id + 1) + " where KEY_COL='" + type
					+ "'";
			connection.prepareStatement(updateQuery).executeUpdate();
			updated = true;
			connection.close();

		} catch (SQLException s) {

		} catch (ClassNotFoundException e) {
			
			throw new GenericDaoException(e.getMessage());
		}
		return updated;
	}
}
