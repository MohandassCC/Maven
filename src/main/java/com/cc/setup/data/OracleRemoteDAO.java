package com.cc.setup.data;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.cc.setup.common.GenericDaoException;
import com.cc.setup.property.GetPropertyDetails;

public class OracleRemoteDAO implements DataManagerDAOInterface {

	private PostDataBean parentPostBean = new PostDataBean();

	public List<GetDataResponseBean> getDetails(GetDataBean getDataBean) throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		ResultSet rsSelect = null;
		try {
			Connection connection = getConnection();

			StringBuilder stringBuilder = new StringBuilder();
			stringBuilder.append("SELECT distinct TABLE_NAME FROM USER_TAB_COLUMNS");
			//buildSelectQuery(getDataBean, stringBuilder, connection);
			rsSelect = connection.prepareStatement(stringBuilder.toString()).executeQuery();

			loadGetDataResponseBeanList(getDataBean, getDataResponseBeanList, rsSelect,"tablename","TABLE_NAME");

		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}

		return getDataResponseBeanList;
	}
	
	public List<GetDataResponseBean> getColumnDetails(GetDataBean getDataBean) throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		ResultSet rsSelect = null;
		try {
			Connection connection = getConnection();

			StringBuilder stringBuilder = new StringBuilder();
			//stringBuilder.append("SELECT COLUMN_NAME FROM USER_TAB_COLUMNS WHERE TABLE_NAME ="+getDataBean.getTableNameList()+" ORDER BY COLUMN_IDS");
			//buildSelectQuery(getDataBean, stringBuilder, connection);
			
			for (String tableName : getDataBean.getTableNameList()) {
				PreparedStatement preparedStatement;
				
				try {
					preparedStatement = connection.prepareStatement("SELECT COLUMN_NAME FROM USER_TAB_COLUMNS WHERE TABLE_NAME = ? ORDER BY COLUMN_ID");
					preparedStatement.setString(1, tableName.toUpperCase());
					rsSelect = preparedStatement.executeQuery();
//					while (rs.next()) {
//						columns.append(rs.getString(1) + ",");
//					}
				} catch (SQLException e) {
					
					throw new GenericDaoException(e.getMessage());
				}
			}
			//String qry=stringBuilder.toString();
			//rsSelect = connection.prepareStatement(qry).executeQuery();

			loadGetDataResponseBeanList(getDataBean, getDataResponseBeanList, rsSelect,"columnname","COLUMN_NAME");

		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}

		return getDataResponseBeanList;
	}

	
	

	private void buildSelectQuery(GetDataBean getDataBean, StringBuilder stringBuilder, Connection connection) throws GenericDaoException {
		stringBuilder.append("select ");
		// if (getDataBean.getKeyColumn() != null &&
		// !getDataBean.getKeyColumn().isEmpty()
		// && !getDataBean.getKeyColumn().equals("")) {
		// stringBuilder.append(getDataBean.getKeyColumn() + ",");
		// }
		if (getDataBean.getColumnList()[0].equals("*")) {
			StringBuilder columns = new StringBuilder();
			for (String tableName : getDataBean.getTableNameList()) {
				PreparedStatement preparedStatement;
				try {
					preparedStatement = connection.prepareStatement("SELECT * FROM USER_TAB_COLUMNS  ");
					//preparedStatement.setString(1, tableName.toUpperCase());
					ResultSet rs = preparedStatement.executeQuery();
					while (rs.next()) {
						columns.append(rs.getString(1) + ",");
					}
				} catch (SQLException e) {
					
					throw new GenericDaoException(e.getMessage());
				}	
			}
			getDataBean.setColumnList(columns.toString().split(","));
		}
		
 		for (String columnName : getDataBean.getColumnList()) {
			stringBuilder.append(columnName.toUpperCase() + ",");			
		}
 		stringBuilder.deleteCharAt(stringBuilder.length() - 1);
		stringBuilder.append(" from ");
		for (String tableName : getDataBean.getTableNameList()) {
			stringBuilder.append(tableName + ",");
		}
		stringBuilder.deleteCharAt(stringBuilder.length() - 1);
		String[] filterList = getDataBean.getFiltersList();
		if (filterList != null && filterList.length > 0) {
			stringBuilder.append(" where ");
			for (int i = 0; i < filterList.length; i++) {
				stringBuilder.append(filterList[i]);
				if (i < (filterList.length - 1)) {
					stringBuilder.append(" and ");
				}
			}
		}
		if (getDataBean.getJoinsList() != null && getDataBean.getJoinsList().length > 0) {
			int q = 1;
			for (String joinCond : getDataBean.getJoinsList()) {
				if (filterList != null && filterList.length > 0) {
					stringBuilder.append(" and ");
				}
				stringBuilder.append(joinCond);
				if (q < getDataBean.getJoinsList().length) {
					stringBuilder.append(" and ");
				}
				q++;
			}
		}
		System.out.println("select query is :" + stringBuilder.toString());
	}

	private void loadGetDataResponseBeanList(GetDataBean getDataBean, List<GetDataResponseBean> getDataResponseBeanList, ResultSet rsSelect,String key,String columnName) throws SQLException {
		while (rsSelect.next()) {
			GetDataResponseBean getDataResponseBean = new GetDataResponseBean();
//			if (getDataBean.getKeyColumn() != null && !getDataBean.getKeyColumn().isEmpty() && !getDataBean.getKeyColumn().equals("")) {
//				getDataResponseBean.setKeyColumn(getDataBean.getKeyColumn());
//				String keyValue=String.valueOf(rsSelect.getInt(getDataBean.getKeyColumn().toUpperCase()));
//				getDataResponseBean.setKeyValue(keyValue);
//			}
			Map<String, String> columnListMap = new HashMap<String, String>();
			for (String column : getDataBean.getColumnList()) {
//				if (column.contains(".")) {
//					column = column.substring(column.indexOf(".") + 1, column.length());
//				}
				columnListMap.put(key, rsSelect.getString(columnName));
			}
			getDataResponseBean.setColumnList(columnListMap);
			getDataResponseBeanList.add(getDataResponseBean);
		}
	}

	private Connection getConnection() throws ClassNotFoundException, SQLException, GenericDaoException {
		Connection connection = null;
		try {
			Class.forName(GetPropertyDetails.propertyCollection.getDbPropertyArray().getJdbcdriver());
			String url = GetPropertyDetails.propertyCollection.getDbPropertyArray().getJdbcurl();
			String username = GetPropertyDetails.propertyCollection.getDbPropertyArray().getUsername();
			String password = GetPropertyDetails.propertyCollection.getDbPropertyArray().getPassword();
			connection = DriverManager.getConnection(url, username, password);
		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}
		// Class.forName("oracle.jdbc.driver.OracleDriver");
		//
		// Connection connection = DriverManager.getConnection(
		// "jdbc:oracle:thin:NEW_APP_OWNER/NEW_APP_OWNER@192.168.1.15:1521:SYS15ORA",
		// "NEW_APP_OWNER",
		// "NEW_APP_OWNER");
		return connection;
	}

	public PostDataBean saveData(PostDataBean postDataBean) throws GenericDaoException {
		parentPostBean = saveTable(postDataBean);
		while (parentPostBean.getChildGetBean() != null && parentPostBean.getChildGetBean().size() > 0) {
			for (PostDataBean postDataBeanNew : parentPostBean.getChildGetBean()) {
				parentPostBean = saveData(postDataBeanNew);
			}
		}
		return postDataBean;
	}

	private PostDataBean saveTable(PostDataBean postDataBean) throws GenericDaoException {
		Connection connection = null;
		try {
			connection = getConnection();
			StringBuilder stringBuilder = new StringBuilder();
			if ("I".equals(postDataBean.getAction())) {
				buildInsertQuery(postDataBean, stringBuilder, connection);
			} else if ("U".equals(postDataBean.getAction())) {
				buildUpdateQuery(postDataBean, stringBuilder, connection);
			} else if ("IU".equals(postDataBean.getAction())) {
				buildUpsertQuery(postDataBean, connection, stringBuilder);
			}
		} catch (SQLException e) {
			throw new GenericDaoException(e.getMessage());
		} catch (ClassNotFoundException e) {
			
			throw new GenericDaoException(e.getMessage());
		}
		connection = null;
		return postDataBean;
	}

	private void buildUpsertQuery(PostDataBean postDataBean, Connection connection, StringBuilder stringBuilder) throws SQLException, GenericDaoException {
		StringBuilder selectString = new StringBuilder();
		selectString.append("select * from " + postDataBean.getTableName());
		if (postDataBean.getKeyColumn() != null && !postDataBean.getKeyColumn().isEmpty() && !postDataBean.getKeyColumn().equals("")) {
			selectString.append(" where ");
			selectString.append(postDataBean.getKeyColumn() + " = " + postDataBean.getKeyValue());
		}
		String[] whereList = postDataBean.getWhereList();
		if (whereList.length > 0) {
			if (selectString.toString().contains(" where ")) {
				selectString.append(" and ");
			} else {
				selectString.append(" where ");
			}
			for (int i = 0; i < whereList.length; i++) {
				selectString.append(whereList[i]);
				if (i < (whereList.length - 1)) {
					selectString.append(" and ");
				}
			}
		}
		ResultSet rsSelect = null;
		rsSelect = connection.prepareStatement(selectString.toString()).executeQuery();
		if (rsSelect.next()) {
			buildUpdateQuery(postDataBean, stringBuilder, connection);
		} else {
			buildInsertQuery(postDataBean, stringBuilder, connection);
		}
	}

	private void buildUpdateQuery(PostDataBean webServicePostInput, StringBuilder stringBuilder, Connection connection) throws GenericDaoException {
		stringBuilder.append("update " + webServicePostInput.getTableName() + " set ");
		List<Map<String, String>> columnValuesMapList = webServicePostInput.getColumnValueMap();
		for (Map<String, String> columnValuesMap : columnValuesMapList) {
			Set<String> keySet = columnValuesMap.keySet();
			for (String key : keySet) {
				if ("S".equals(webServicePostInput.getColumnDataTypeMap().get(key)) || "D".equals(webServicePostInput.getColumnDataTypeMap().get(key))) {
					stringBuilder.append(key + "='" + columnValuesMap.get(key) + "',");
				} else if ("N".equals(webServicePostInput.getColumnDataTypeMap().get(key))) {
					stringBuilder.append(key + "=" + columnValuesMap.get(key) + ",");
				}
			}
		}
		stringBuilder.deleteCharAt(stringBuilder.length() - 1);
		if (webServicePostInput.getKeyColumn() != null && !webServicePostInput.getKeyColumn().isEmpty() && !webServicePostInput.getKeyColumn().equals("")) {
			stringBuilder.append(" where ");
			if ("S".equals(webServicePostInput.getColumnDataTypeMap().get(webServicePostInput.getKeyColumn()))
					|| "D".equals(webServicePostInput.getColumnDataTypeMap().get(webServicePostInput.getKeyColumn()))) {
				stringBuilder.append(webServicePostInput.getKeyColumn() + " = '" + webServicePostInput.getKeyValue() + "'");
			} else if ("N".equals(webServicePostInput.getColumnDataTypeMap().get(webServicePostInput.getKeyColumn()))) {
				stringBuilder.append(webServicePostInput.getKeyColumn() + " = " + webServicePostInput.getKeyValue());
			}
		}
		String[] whereList = webServicePostInput.getWhereList();
		if (whereList.length > 0) {
			if (stringBuilder.toString().contains(" where ")) {
				stringBuilder.append(" and ");
			} else {
				stringBuilder.append(" where ");
			}
			for (int i = 0; i < whereList.length; i++) {
				stringBuilder.append(whereList[i]);
				if (i < (whereList.length - 1)) {
					stringBuilder.append(" and ");
				}
			}
		}
		try {
			connection.prepareStatement(stringBuilder.toString()).executeUpdate();
			connection.commit();
		} catch (SQLException e) {
			
			throw new GenericDaoException(e.getMessage());
		}

	}

	private PostDataBean buildInsertQuery(PostDataBean postDataBean, StringBuilder stringBuilder, Connection connection) throws GenericDaoException {
		List<Map<String, String>> columnValuesMapList = postDataBean.getColumnValueMap();
		StringBuilder columns = new StringBuilder();
		StringBuilder values = new StringBuilder();
		Set<String> keySet = new HashSet<String>();
		for (Map<String, String> columnValuesMap : columnValuesMapList) {
			stringBuilder.append("insert into " + postDataBean.getTableName() + " ");
			keySet = columnValuesMap.keySet();
			for (String key : keySet) {
				if (key.toLowerCase().equals(parentPostBean.getKeyColumn())) {
					columnValuesMap.put(key, parentPostBean.getKeyValue());
				}
				if (key.toLowerCase().equals(postDataBean.getKeyColumn())) {
					try {
						ResultSet rs = connection.prepareStatement("select max(" + key + ") from " + postDataBean.getTableName() + "").executeQuery();
						while (rs.next()) {
							columnValuesMap.put(key, rs.getInt(1) + 1 + "");
							postDataBean.setKeyValue(rs.getInt(1) + 1 + "");
						}
					} catch (SQLException e) {
						
						throw new GenericDaoException(e.getMessage());
					}
				}
				columns.append(key + ",");
				if ("S".equals(postDataBean.getColumnDataTypeMap().get(key)) || "D".equals(postDataBean.getColumnDataTypeMap().get(key))) {
					if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
						values.append("'" + columnValuesMap.get(key) + "',");
					} else {
						values.append("null,");
					}
				} else if ("N".equals(postDataBean.getColumnDataTypeMap().get(key))) {
					values.append(columnValuesMap.get(key) + ",");
				}
			}
			columns.deleteCharAt(columns.length() - 1);
			
			values.deleteCharAt(values.length() - 1);
			
			stringBuilder.append("(" + columns.toString() + ") values(");
			stringBuilder.append(values.toString() + ")");
			try {
				connection.prepareStatement(stringBuilder.toString()).executeUpdate();
				connection.commit();
			} catch (SQLException e) {
				
				throw new GenericDaoException(e.getMessage());
			}
			columns.setLength(0);
			values.setLength(0);
			stringBuilder.setLength(0);
			keySet.clear();
		}
		return postDataBean;
	}
}
