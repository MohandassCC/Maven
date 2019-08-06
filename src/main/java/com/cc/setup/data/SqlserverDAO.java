package com.cc.setup.data;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.cc.setup.common.GenericDaoException;
import com.cc.setup.property.GetPropertyDetails;

public class SqlserverDAO implements DataManagerDAOInterface {

	private PostDataBean parentPostBean = new PostDataBean();

	String pattern = "yyyy-MM-dd";
	SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
	String date = simpleDateFormat.format(new Date().getTime());

	public List<GetDataResponseBean> getDetails(GetDataBean getDataBean) throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		ResultSet rsSelect = null;
		try {
			Connection connection = getConnection();
			Map<String, String> columnDataTypeMap = new HashMap();
			StringBuilder stringBuilder = new StringBuilder();
			buildSelectQuery(getDataBean, stringBuilder, connection, columnDataTypeMap);
			rsSelect = connection.prepareStatement(stringBuilder.toString()).executeQuery();
			loadGetDataResponseBeanList(getDataBean, getDataResponseBeanList, rsSelect, columnDataTypeMap);

		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}

		return getDataResponseBeanList;
	}

	private void buildSelectQuery(GetDataBean getDataBean, StringBuilder stringBuilder, Connection connection, Map<String, String> columnDataTypeMap) throws GenericDaoException {
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
					preparedStatement = connection.prepareStatement("SELECT COLUMN_NAME,DATA_TYPE FROM USER_TAB_COLUMNS WHERE TABLE_NAME = ? ORDER BY COLUMN_ID");
					preparedStatement.setString(1, tableName.toUpperCase());
					ResultSet rs = preparedStatement.executeQuery();
					while (rs.next()) {
						columns.append(rs.getString(1) + ",");
						columnDataTypeMap.put(rs.getString(1), rs.getString(2));
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

	private void loadGetDataResponseBeanList(GetDataBean getDataBean, List<GetDataResponseBean> getDataResponseBeanList, ResultSet rsSelect, Map<String, String> columnDataTypeMa) throws SQLException {
		while (rsSelect.next()) {
			GetDataResponseBean getDataResponseBean = new GetDataResponseBean();
			if (getDataBean.getKeyColumn() != null && !getDataBean.getKeyColumn().isEmpty() && !getDataBean.getKeyColumn().equals("")) {
				getDataResponseBean.setKeyColumn(getDataBean.getKeyColumn());
				getDataResponseBean.setKeyValue(rsSelect.getString(getDataBean.getKeyColumn()));
			}
			Map<String, String> columnListMap = new HashMap<String, String>();
			for (String column : getDataBean.getColumnList()) {
				if (column.contains(".")) {
					column = column.substring(column.indexOf(".") + 1, column.length());
				}
				if (columnDataTypeMa.get(column).equalsIgnoreCase("DATE")) {
					columnListMap.put(column.toLowerCase(), rsSelect.getDate(column) + "");
				} else if (columnDataTypeMa.get(column).equalsIgnoreCase("DATETIME")) {
					columnListMap.put(column.toLowerCase(), rsSelect.getTimestamp(column) + "");
				} else if (columnDataTypeMa.get(column).equalsIgnoreCase("TIMESTAMP")) {
					//SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss"); -- 'yyyy-MM-dd'T'HH:mm:ss.SSS'
//					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

					// String xx=ss.parse(rsSelect.getTimestamp(column));
					System.out.println("TimeStamp......................................" + rsSelect.getTimestamp(column));
					if (rsSelect.getTimestamp(column) != null) {
						Long ss = rsSelect.getTimestamp(column).getTime();
						Date date = new Date();
						date.setTime(ss);
						Calendar calendar = Calendar.getInstance();
						calendar.setTime(date);
						calendar.set(Calendar.SECOND, 0); 
						calendar.set(Calendar.MILLISECOND, 0);

						System.out.println("calendar............." + calendar.getTime());
						// System.out.println("Date"+rsSelect.getDate(column));
						// System.out.println("Object"+rsSelect.getObject(column));
						columnListMap.put(column.toLowerCase(), sdf.format(calendar.getTime()) + "");
						// columnListMap.put(column.toLowerCase(), null);
					}
				} else {
					columnListMap.put(column.toLowerCase(), rsSelect.getString(column));
				}
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
				if (parentPostBean.getChildGetBean() != null) {
					parentPostBean = saveData(postDataBeanNew);
				} else {
					saveData(postDataBeanNew);
				}
			}
		}
		postDataBean = parentPostBean;
		return postDataBean;
	}

	private PostDataBean saveTable(PostDataBean postDataBean) throws GenericDaoException {
		StringBuilder stringBuilder = new StringBuilder();
		if ("I".equals(postDataBean.getAction())) {
			buildInsertQuery(postDataBean, stringBuilder);
		} else if ("U".equals(postDataBean.getAction())) {
			buildUpdateQuery(postDataBean, stringBuilder);
		} else if ("IU".equals(postDataBean.getAction())) {
			buildUpsertQuery(postDataBean, stringBuilder);
		}
		return postDataBean;
	}

	private void buildUpsertQuery(PostDataBean postDataBean, StringBuilder stringBuilder) throws GenericDaoException {
		StringBuilder selectString = new StringBuilder();
		// PreparedStatement preparedStatement=null;
		ResultSet rsSelect = null;
		for (Map<String, String> columnValuesMap : postDataBean.getColumnValueMap()) {
			rsSelect = null;
			selectString.append("select * from " + postDataBean.getTableName());
			if (postDataBean.getKeyColumn() != null && !postDataBean.getKeyColumn().isEmpty() && !postDataBean.getKeyColumn().equals("")) {
				selectString.append(" where ");
				if (columnValuesMap.get(postDataBean.getKeyColumn()) != null || columnValuesMap.get(postDataBean.getKeyColumn()).equals("")) {
					selectString.append(postDataBean.getKeyColumn() + " = " + columnValuesMap.get(postDataBean.getKeyColumn()));
				}
			}
			if (columnValuesMap.get(postDataBean.getKeyColumn()).equals("")) {
				selectString.append("null");
			}

			String[] whereList = postDataBean.getWhereList();
			if (whereList != null && whereList.length > 0) {
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
			System.out.println("selectString :" + selectString.toString());
			try (Connection connection1 = getConnection();) {
				rsSelect = connection1.prepareStatement(selectString.toString()).executeQuery();

				if (rsSelect.next()) {
					buildUpdateQueryForUpsert(postDataBean, stringBuilder, columnValuesMap);
				} else {
					stringBuilder.setLength(0);
					buildInsertQuery(postDataBean, stringBuilder, columnValuesMap);
				}
			} catch (Exception e) {
				throw new GenericDaoException(e.getMessage());
			}
			selectString.setLength(0);
		}
	}

	private void buildUpdateQueryForUpsert(PostDataBean webServicePostInput, StringBuilder stringBuilder1, Map<String, String> columnValuesMap) throws GenericDaoException {
		stringBuilder1.append("update " + webServicePostInput.getTableName() + " set ");
		List<Map<String, String>> columnValuesMapList = webServicePostInput.getColumnValueMap();
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append(stringBuilder1);
		Set<String> keySet = columnValuesMap.keySet();
		for (String key : keySet) {

			if ("S".equals(webServicePostInput.getColumnDataTypeMap().get(key))) {
				if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).isEmpty()) {
					stringBuilder.append(key + "='" + columnValuesMap.get(key) + "',");
				}
			} else if ("D".equals(webServicePostInput.getColumnDataTypeMap().get(key)) && !key.equals("updatedate")) {
				if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).isEmpty()) {
					stringBuilder.append(key + "= convert(date ,'" + columnValuesMap.get(key) + "'),");
				}else{
					stringBuilder.append(key + "=" + columnValuesMap.get(key) + ",");
				}
			} else if ("T".equals(webServicePostInput.getColumnDataTypeMap().get(key))) {
				if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).isEmpty()) {
//					stringBuilder.append(key + "= convert(datetime ,'" + columnValuesMap.get(key) + "'),");
					stringBuilder.append(key + "= getdate() ,");

				} else{
					stringBuilder.append(key + "=" + columnValuesMap.get(key) + ",");
				}
			
			} else if ("N".equals(webServicePostInput.getColumnDataTypeMap().get(key))) {
				if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).isEmpty()) {
					stringBuilder.append(key + "=" + columnValuesMap.get(key) + ",");

				}
			} else if ("D".equals(webServicePostInput.getColumnDataTypeMap().get(key)) && key.equals("updatedate")) {
				if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).isEmpty()) {
					stringBuilder.append(key + "= convert(date ,'" + date+ "'),");
				}
			}
		}

		stringBuilder.deleteCharAt(stringBuilder.length() - 1);
		if (webServicePostInput.getKeyColumn() != null && !webServicePostInput.getKeyColumn().isEmpty() && !webServicePostInput.getKeyColumn().equals("")) {
			stringBuilder.append(" where ");
			if ("S".equals(webServicePostInput.getColumnDataTypeMap().get(webServicePostInput.getKeyColumn()))) {
				if (webServicePostInput.getKeyValue() != null && !webServicePostInput.getKeyValue().isEmpty()) {
					stringBuilder.append(webServicePostInput.getKeyColumn() + " = '" + webServicePostInput.getKeyValue() + "'");
				} else if (columnValuesMap.get(webServicePostInput.getKeyColumn()) != null || columnValuesMap.get(webServicePostInput.getKeyColumn()).equals("")) {
					stringBuilder.append(webServicePostInput.getKeyColumn() + " = '" + columnValuesMap.get(webServicePostInput.getKeyColumn()) + "'");
				}
			} else if ("D".equals(webServicePostInput.getColumnDataTypeMap().get(webServicePostInput.getKeyColumn()))) {
				if (webServicePostInput.getKeyValue() != null && !webServicePostInput.getKeyValue().isEmpty()) {
					stringBuilder.append(webServicePostInput.getKeyColumn() + "=convert(date ,'" + webServicePostInput.getKeyValue() + "')");
				} else if (columnValuesMap.get(webServicePostInput.getKeyColumn()) != null || columnValuesMap.get(webServicePostInput.getKeyColumn()).equals("")) {
					stringBuilder.append(webServicePostInput.getKeyColumn() + "" + columnValuesMap.get(webServicePostInput.getKeyColumn()));
				}
			} else if ("T".equals(webServicePostInput.getColumnDataTypeMap().get(webServicePostInput.getKeyColumn()))) {
				if (webServicePostInput.getKeyValue() != null && !webServicePostInput.getKeyValue().isEmpty()) {
//					stringBuilder.append(webServicePostInput.getKeyColumn() + "=convert(datetime ,'" + webServicePostInput.getKeyValue() + "')");
					stringBuilder.append(webServicePostInput.getKeyColumn() + "=getdate() ");

				} else if (columnValuesMap.get(webServicePostInput.getKeyColumn()) != null || columnValuesMap.get(webServicePostInput.getKeyColumn()).equals("")) {
					stringBuilder.append(webServicePostInput.getKeyColumn() + "=" + columnValuesMap.get(webServicePostInput.getKeyColumn()));
				}
			} else if ("N".equals(webServicePostInput.getColumnDataTypeMap().get(webServicePostInput.getKeyColumn()))) {
				if (webServicePostInput.getKeyValue() != null && !webServicePostInput.getKeyValue().isEmpty()) {
					stringBuilder.append(webServicePostInput.getKeyColumn() + " = " + webServicePostInput.getKeyValue());
				} else if (columnValuesMap.get(webServicePostInput.getKeyColumn()) != null || columnValuesMap.get(webServicePostInput.getKeyColumn()).equals("")) {
					stringBuilder.append(webServicePostInput.getKeyColumn() + " = " + columnValuesMap.get(webServicePostInput.getKeyColumn()));
				}
			}
		}
		String[] whereList = webServicePostInput.getWhereList();
		if (whereList != null && whereList.length > 0) {
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
		try (Connection connection1 = getConnection();) {
			System.out.println("update query :" + stringBuilder.toString());
			connection1.prepareStatement(stringBuilder.toString()).executeUpdate();
			connection1.commit();
			stringBuilder1.setLength(0);
		} catch (SQLException e) {
			
			throw new GenericDaoException(e.getMessage());
		} catch (ClassNotFoundException e1) {
			
			e1.printStackTrace();
		}

	}

	private PostDataBean buildInsertQuery(PostDataBean postDataBean, StringBuilder stringBuilder, Map<String, String> columnValuesMap) throws GenericDaoException {
		List<Map<String, String>> columnValuesMapList = postDataBean.getColumnValueMap();
		StringBuilder columns = new StringBuilder();
		StringBuilder values = new StringBuilder();
		Set<String> keySet = new HashSet<String>();
		stringBuilder.append("insert into " + postDataBean.getTableName() + " ");
		keySet = columnValuesMap.keySet();
		for (String key : keySet) {
			if (parentPostBean.getKeyColumn() != null && key.toLowerCase().equals(parentPostBean.getKeyColumn().toLowerCase())) {
				columnValuesMap.put(key, parentPostBean.getKeyValue());
			}
			if (key.toLowerCase().equals(postDataBean.getKeyColumn().toLowerCase())) {
				try (Connection connection = getConnection();) {
					ResultSet rs = connection.prepareStatement("select max(" + key + ") from " + postDataBean.getTableName() + "").executeQuery();
					while (rs.next()) {
						columnValuesMap.put(key, rs.getInt(1) + 1 + "");
						postDataBean.setKeyValue(rs.getInt(1) + 1 + "");
					}
				} catch (SQLException e) {
					
					throw new GenericDaoException(e.getMessage());
				} catch (ClassNotFoundException e1) {
					
					e1.printStackTrace();
				}
			}
			columns.append(key + ",");
			if (key.toLowerCase().equals("createdate")) {
				// values.append("'" + new Date() + "',");
				values.append("convert(date ,'" + date + "'),");
			} else if (key.toLowerCase().equals("createuser")) {
				values.append("'admin',");
			} else if (key.toLowerCase().equals("updatedate")) {
				values.append("null,");
			} else if (key.toLowerCase().equals("updateuser")) {
				values.append("null,");
			} else if (key.toLowerCase().equals("lastmodified")) {
				values.append("null,");
			} else if ("S".equals(postDataBean.getColumnDataTypeMap().get(key))) {
				if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
					values.append("'" + columnValuesMap.get(key) + "',");
				} else {
					values.append("null,");
				}
			} else if ("D".equals(postDataBean.getColumnDataTypeMap().get(key))) {
				if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
					values.append("=convert(date ,'" + columnValuesMap.get(key) + "'),");
				} else {
					values.append("null,");
				}
			} else if ("T".equals(postDataBean.getColumnDataTypeMap().get(key))) {
				if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("") ) {
//					values.append("convert(datetime ,'" + columnValuesMap.get(key) + "'),");
//					values.append("CURRENT_TIMESTAMP,");
					values.append("getdate(),");
				} else {
					values.append("null,");
				}
			} else if ("N".equals(postDataBean.getColumnDataTypeMap().get(key))) {
				if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
					values.append(columnValuesMap.get(key) + ",");
				} else {
					values.append("null,");
				}
			}
		}
		columns.deleteCharAt(columns.length() - 1);

		values.deleteCharAt(values.length() - 1);

		stringBuilder.append("(" + columns.toString() + ") values(");
		stringBuilder.append(values.toString() + ")");
		System.out.println("StrQuery:" + stringBuilder);
		try (Connection connection1 = getConnection();) {
			connection1.prepareStatement(stringBuilder.toString()).executeUpdate();
			connection1.commit();
		} catch (SQLException e) {
			
			throw new GenericDaoException(e.getMessage());
		} catch (ClassNotFoundException e1) {
			
			e1.printStackTrace();
		}
		columns.setLength(0);
		values.setLength(0);
		stringBuilder.setLength(0);
		keySet.clear();

		return postDataBean;
	}

	private void buildUpdateQuery(PostDataBean webServicePostInput, StringBuilder stringBuilder1) throws GenericDaoException {
		stringBuilder1.append("update " + webServicePostInput.getTableName() + " set ");
		// StringBuilder stringBuilder = new StringBuilder();
		List<Map<String, String>> columnValuesMapList = webServicePostInput.getColumnValueMap();
		for (Map<String, String> columnValuesMap : columnValuesMapList) {
			StringBuilder stringBuilder = new StringBuilder();
			stringBuilder.append(stringBuilder1);

			Set<String> keySet = columnValuesMap.keySet();
			for (String key : keySet) {

				if ("S".equals(webServicePostInput.getColumnDataTypeMap().get(key))) {
					if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).isEmpty()) {
						stringBuilder.append(key + "='" + columnValuesMap.get(key) + "',");
					}
				} else if ("D".equals(webServicePostInput.getColumnDataTypeMap().get(key)) && !key.equals("updatedate")) {
					if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).isEmpty() && !columnValuesMap.get(key).equals("null")) {
						stringBuilder.append(key + "=convert(date ,'" + columnValuesMap.get(key) + "'),");
					}else {
						stringBuilder.append(key +  "=" + columnValuesMap.get(key) + ",");
					}

				} else if ("T".equals(webServicePostInput.getColumnDataTypeMap().get(key))) {
					if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).isEmpty()) {
//						stringBuilder.append(key + "=convert(datetime ,'" + columnValuesMap.get(key) + "'),");
						stringBuilder.append(key + "=getdate() ,");

					} else {
//						stringBuilder.append(webServicePostInput.getKeyColumn() + "=convert(datetime ,'" + columnValuesMap.get(key) + "'),");
//						stringBuilder.append(webServicePostInput.getKeyColumn() + "=" + null );
						stringBuilder.append(webServicePostInput.getKeyColumn() + "=" + columnValuesMap.get(key) + ",");
					}
				} else if ("N".equals(webServicePostInput.getColumnDataTypeMap().get(key))) {
					if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).isEmpty()) {
						stringBuilder.append(key + "=" + columnValuesMap.get(key) + ",");
					}
				} else if ("C".equals(webServicePostInput.getColumnDataTypeMap().get(key))) {
					if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).isEmpty()) {
						stringBuilder.append(key + "='" + columnValuesMap.get(key) + "',");

					}
				} else if ("D".equals(webServicePostInput.getColumnDataTypeMap().get(key)) && key.equals("updatedate")) {
					stringBuilder.append(key + "=convert(date ,'" + date + "'),");
				}
			}

			stringBuilder.deleteCharAt(stringBuilder.length() - 1);
			if (webServicePostInput.getKeyColumn() != null && !webServicePostInput.getKeyColumn().isEmpty() && !webServicePostInput.getKeyColumn().equals("")) {
				stringBuilder.append(" where ");
				if ("S".equals(webServicePostInput.getColumnDataTypeMap().get(webServicePostInput.getKeyColumn()))) {
					if (webServicePostInput.getKeyValue() != null && !webServicePostInput.getKeyValue().isEmpty()) {
						stringBuilder.append(webServicePostInput.getKeyColumn() + " = '" + webServicePostInput.getKeyValue() + "'");
					} else if (columnValuesMap.get(webServicePostInput.getKeyColumn()) != null || columnValuesMap.get(webServicePostInput.getKeyColumn()).equals("")) {
						stringBuilder.append(webServicePostInput.getKeyColumn() + " = '" + columnValuesMap.get(webServicePostInput.getKeyColumn()) + "'");
					}
				} else if ("D".equals(webServicePostInput.getColumnDataTypeMap().get(webServicePostInput.getKeyColumn()))) {
					if (webServicePostInput.getKeyValue() != null && !webServicePostInput.getKeyValue().isEmpty()) {
						stringBuilder.append(webServicePostInput.getKeyColumn() + "=convert(date ,'" + webServicePostInput.getKeyValue() + "')");
					} else if (webServicePostInput.getKeyValue() != null && columnValuesMap.get(webServicePostInput.getKeyColumn()) != null
							|| columnValuesMap.get(webServicePostInput.getKeyColumn()).equals("")) {
//						stringBuilder.append(webServicePostInput.getKeyColumn() + "=convert(date ,'" + columnValuesMap.get(webServicePostInput.getKeyColumn()) + "')");
						stringBuilder.append(webServicePostInput.getKeyColumn() + " = " + columnValuesMap.get(webServicePostInput.getKeyColumn()));
					}
				} else if ("T".equals(webServicePostInput.getColumnDataTypeMap().get(webServicePostInput.getKeyColumn()))) {
					if (webServicePostInput.getKeyValue() != null && !webServicePostInput.getKeyValue().isEmpty()) {
						stringBuilder.append(webServicePostInput.getKeyColumn() + "=convert(datetime ,'" + webServicePostInput.getKeyValue() + "')");
					} else if (webServicePostInput.getKeyValue() != null && columnValuesMap.get(webServicePostInput.getKeyColumn()) != null
							|| columnValuesMap.get(webServicePostInput.getKeyColumn()).equals("")) {
//						stringBuilder.append(webServicePostInput.getKeyColumn() + "=convert(datetime ,'" + columnValuesMap.get(webServicePostInput.getKeyColumn()) + "')");
						stringBuilder.append(webServicePostInput.getKeyColumn() +  " = " + columnValuesMap.get(webServicePostInput.getKeyColumn()));

					}
				} else if ("N".equals(webServicePostInput.getColumnDataTypeMap().get(webServicePostInput.getKeyColumn()))) {
					if (webServicePostInput.getKeyValue() != null && !webServicePostInput.getKeyValue().isEmpty()) {
						stringBuilder.append(webServicePostInput.getKeyColumn() + " = " + webServicePostInput.getKeyValue());
					} else if (columnValuesMap.get(webServicePostInput.getKeyColumn()) != null || columnValuesMap.get(webServicePostInput.getKeyColumn()).equals("")) {
						stringBuilder.append(webServicePostInput.getKeyColumn() + " = " + columnValuesMap.get(webServicePostInput.getKeyColumn()));
					}
				} else if ("C".equals(webServicePostInput.getColumnDataTypeMap().get(webServicePostInput.getKeyColumn()))) {
					if (webServicePostInput.getKeyValue() != null && !webServicePostInput.getKeyValue().isEmpty()) {
						stringBuilder.append(webServicePostInput.getKeyColumn() + " = '" + webServicePostInput.getKeyValue() + "'");
					} else if (columnValuesMap.get(webServicePostInput.getKeyColumn()) != null || columnValuesMap.get(webServicePostInput.getKeyColumn()).equals("")) {
						stringBuilder.append(webServicePostInput.getKeyColumn() + " = '" + columnValuesMap.get(webServicePostInput.getKeyColumn()) + "'");
					}
				}
			}
			String[] whereList = webServicePostInput.getWhereList();
			if (whereList != null && whereList.length > 0) {
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
			try (Connection connection1 = getConnection();) {
				System.out.println("update query :" + stringBuilder.toString());
				connection1.prepareStatement(stringBuilder.toString()).executeUpdate();
				connection1.commit();
				stringBuilder.setLength(0);
			} catch (SQLException e) {
				
				throw new GenericDaoException(e.getMessage());
			} catch (ClassNotFoundException e1) {
				
				e1.printStackTrace();
			}
		}
	}

	private PostDataBean buildInsertQuery(PostDataBean postDataBean, StringBuilder stringBuilder) throws GenericDaoException {
		List<Map<String, String>> columnValuesMapList = postDataBean.getColumnValueMap();
		StringBuilder columns = new StringBuilder();
		StringBuilder values = new StringBuilder();
		Set<String> keySet = new HashSet<String>();

		for (Map<String, String> columnValuesMap : columnValuesMapList) {
			stringBuilder.append("insert into " + postDataBean.getTableName() + " ");
			keySet = columnValuesMap.keySet();
			for (String key : keySet) {
				if (parentPostBean.getKeyColumn() != null && key.toLowerCase().equals(parentPostBean.getKeyColumn().toLowerCase())) {
					columnValuesMap.put(key, parentPostBean.getKeyValue());
				}
				if (key.toLowerCase().equals(postDataBean.getKeyColumn().toLowerCase())) {
					try (Connection connection = getConnection();) {
						ResultSet rs = connection.prepareStatement("select max(" + key + ") from " + postDataBean.getTableName() + "").executeQuery();
						while (rs.next()) {
							columnValuesMap.put(key, rs.getInt(1) + 1 + "");
							postDataBean.setKeyValue(rs.getInt(1) + 1 + "");
						}
					} catch (SQLException e) {
						
						throw new GenericDaoException(e.getMessage());
					} catch (ClassNotFoundException e1) {
						
						e1.printStackTrace();
					}
				}
				columns.append(key + ",");
				if (key.toLowerCase().equals("createdate")) {
					// values.append("'" + new Date() + "',");

					values.append("convert(date ,'" + date + "'),");
				} else if (key.toLowerCase().equals("createuser")) {
					values.append("'admin',");
				} else if (key.toLowerCase().equals("updatedate")) {
					values.append("null,");

				} else if (key.toLowerCase().equals("updateuser")) {
					values.append("null,");
				} else if (key.toLowerCase().equals("lastmodified")) {
					values.append("null,");

				} else if ("S".equals(postDataBean.getColumnDataTypeMap().get(key))) {
					if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
						values.append("'" + columnValuesMap.get(key) + "',");
					} else {
						values.append("null,");
					}
				} else if ("D".equals(postDataBean.getColumnDataTypeMap().get(key))) {
					if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
						values.append("convert(date ,'" + columnValuesMap.get(key) + "'),");
					} else {
						values.append("null,");
					}
				} else if ("T".equals(postDataBean.getColumnDataTypeMap().get(key))) {
//					if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
						if (columnValuesMap.get(key) != null && columnValuesMap.get(key)!= null ) {

						values.append("convert(datetime ,'" + columnValuesMap.get(key) + "'),");
					} else {
						values.append("null,");
					}
				} else if ("N".equals(postDataBean.getColumnDataTypeMap().get(key))) {
					if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
						values.append(columnValuesMap.get(key) + ",");
					} else {
						values.append("null,");
					}
				} else if ("C".equals(postDataBean.getColumnDataTypeMap().get(key))) {
					if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
						values.append("'" + columnValuesMap.get(key) + "',");
					} else {
						values.append("null,");
					}
				}
			}
			columns.deleteCharAt(columns.length() - 1);

			values.deleteCharAt(values.length() - 1);

			stringBuilder.append("(" + columns.toString() + ") values(");
			stringBuilder.append(values.toString() + ")");
			System.out.println("StrQuery:" + stringBuilder);
			try (Connection connection1 = getConnection();) {
				connection1.prepareStatement(stringBuilder.toString()).executeUpdate();
				connection1.commit();
			} catch (SQLException e) {
				
				throw new GenericDaoException(e.getMessage());
			} catch (ClassNotFoundException e1) {
				
				e1.printStackTrace();
			}
			columns.setLength(0);
			values.setLength(0);
			stringBuilder.setLength(0);
			keySet.clear();
		}
		return postDataBean;
	}

//	public SourceConfiguration getSourceDetails(Integer sourceId) throws GenericDaoException {
//		SourceConfiguration sourceConfig = new SourceConfiguration();
//
//		PreparedStatement prestmt = null;
//		try {
//			Connection connection = getConnection();
//			String selectTableSQL = "select * from SOURCE_CONFIGURATION where SOURCEID=" + sourceId;
//			prestmt = connection.prepareStatement(selectTableSQL);
//			ResultSet rs = prestmt.executeQuery(selectTableSQL);
//			while (rs.next()) {
//				sourceConfig.setSourcedriver(rs.getString("SOURCEDRIVER"));
//				sourceConfig.setSourceusername(rs.getString("SOURCEUSERNAME"));
//				sourceConfig.setSourcepassword(rs.getString("SOURCEPASSWORD"));
//				sourceConfig.setSourcedbinstance(rs.getString("SOURCEDBINSTANCE"));
//				sourceConfig.setSourceurl(rs.getString("SOURCEURL"));
//			}
//
//		} catch (Exception e) {
//			throw new GenericDaoException(e.getMessage());
//		}
//
//		return sourceConfig;
//	}

	// private PostDataBean buildInsertQuery(PostDataBean postDataBean, StringBuilder stringBuilder) {
	// List<Map<String, String>> columnValuesMapList = postDataBean.getColumnValueMap();
	// StringBuilder columns = new StringBuilder();
	// StringBuilder values = new StringBuilder();
	// Set<String> keySet = new HashSet<String>();
	//
	// String pattern = "yy-dd-MM";
	// SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
	// String date = simpleDateFormat.format(new Date().getTime());
	//
	//
	// for (Map<String, String> columnValuesMap : columnValuesMapList) {
	// stringBuilder.append("insert into " + postDataBean.getTableName() + " ");
	// keySet = columnValuesMap.keySet();
	// for (String key : keySet) {
	// if (parentPostBean.getKeyColumn() != null && key.toLowerCase().equals(parentPostBean.getKeyColumn().toLowerCase())) {
	// columnValuesMap.put(key, parentPostBean.getKeyValue());
	// }
	// if (key.toLowerCase().equals(postDataBean.getKeyColumn().toLowerCase())) {
	// try (Connection connection = getConnection();) {
	// ResultSet rs = connection.prepareStatement("select max(" + key + ") from " + postDataBean.getTableName() + "").executeQuery();
	// while (rs.next()) {
	// columnValuesMap.put(key, rs.getInt(1) + 1 + "");
	// postDataBean.setKeyValue(rs.getInt(1) + 1 + "");
	// }
	// } catch (SQLException e) {
	// 
	// throw new GenericDaoException(e.getMessage());
	// } catch (ClassNotFoundException e1) {
	// 
	// e1.printStackTrace();
	// }
	// }
	// columns.append(key + ",");
	// if (key.toLowerCase().equals("createdate")) {
	// // values.append("'" + new Date() + "',");
	//
	//
	// values.append("to_date('" + date+ "','yyyy-mm-dd'),");
	// } else if (key.toLowerCase().equals("createuser")) {
	// values.append("'admin',");
	// } else if (key.toLowerCase().equals("updatedate")) {
	// values.append("to_date('" + date+ "','yyyy-mm-dd'),");
	//
	//
	// } else if (key.toLowerCase().equals("updateuser")) {
	// values.append("null,");
	// } else if (key.toLowerCase().equals("lastmodified")) {
	// values.append("to_timestamp('" +date + "','yyyy-mm-dd hh24:mi:ss'),");
	//
	// } else if ("S".equals(postDataBean.getColumnDataTypeMap().get(key))) {
	// if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
	// values.append("'" + columnValuesMap.get(key) + "',");
	// } else {
	// values.append("null,");
	// }
	// } else if ("D".equals(postDataBean.getColumnDataTypeMap().get(key))) {
	// if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
	// values.append("to_date('" + columnValuesMap.get(key) + "','yyyy-mm-dd'),");
	// } else {
	// values.append("null,");
	// }
	// } else if ("T".equals(postDataBean.getColumnDataTypeMap().get(key))) {
	// if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
	// values.append("to_timestamp('" + columnValuesMap.get(key) + "','yyyy-mm-dd hh24:mi:ss'),");
	// } else {
	// values.append("null,");
	// }
	// }else if ("N".equals(postDataBean.getColumnDataTypeMap().get(key))) {
	// if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
	// values.append(columnValuesMap.get(key) + ",");
	// } else {
	// values.append("null,");
	// }
	// }
	// else if ("C".equals(postDataBean.getColumnDataTypeMap().get(key))) {
	// if (columnValuesMap.get(key) != null && !columnValuesMap.get(key).equals("")) {
	// values.append("'" + columnValuesMap.get(key) + "',");
	// } else {
	// values.append("null,");
	// }
	// }
	// }
	// columns.deleteCharAt(columns.length() - 1);
	//
	// values.deleteCharAt(values.length() - 1);
	//
	// stringBuilder.append("(" + columns.toString() + ") values(");
	// stringBuilder.append(values.toString() + ")");
	// System.out.println("StrQuery:" + stringBuilder);
	// try (Connection connection1 = getConnection();) {
	// connection1.prepareStatement(stringBuilder.toString()).executeUpdate();
	// connection1.commit();
	// } catch (SQLException e) {
	// 
	// throw new GenericDaoException(e.getMessage());
	// } catch (ClassNotFoundException e1) {
	// 
	// e1.printStackTrace();
	// }
	// columns.setLength(0);
	// values.setLength(0);
	// stringBuilder.setLength(0);
	// keySet.clear();
	// }
	// return postDataBean;
	// }
	//
}
