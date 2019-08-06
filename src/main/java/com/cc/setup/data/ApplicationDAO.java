package com.cc.setup.data;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.cc.setup.common.FunctionListChildBean;
import com.cc.setup.common.FunctionListParentBean;
import com.cc.setup.common.GenericDaoException;
import com.cc.setup.property.GetPropertyDetails;

public class ApplicationDAO {

	public List<GetDataResponseBean> getData(GetDataBean getDataBean)
			throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		if (getDataBean.getModuleCode() != null
				&& getDataBean.getModuleCode().equals("admin")) {
			MongoExecution mongoExecution = new MongoExecution();
			getDataResponseBeanList = mongoExecution.getDetails(getDataBean);
			

		} else {
			if ("oracle".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb()
					.toLowerCase())) {
				OracleDAO oracleDAO = new OracleDAO();
				getDataResponseBeanList = oracleDAO.getDetails(getDataBean);
			} else if ("mysql".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb()
					.toLowerCase())) {
				MysqlDAO mysqlDAO = new MysqlDAO();
				getDataResponseBeanList = mysqlDAO.getDetails(getDataBean);
			} else if ("sqlserver".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb()
					.toLowerCase())) {
				SqlserverDAO sqlserverDAO = new SqlserverDAO();
				getDataResponseBeanList = sqlserverDAO.getDetails(getDataBean);
			}
		}

		return getDataResponseBeanList;
	}
	
	public List<GetDataResponseBean> getData2(GetDataBean getDataBean)
			throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		if (getDataBean.getModuleCode() != null
				&& getDataBean.getModuleCode().equals("admin")) {
			MongoExecution mongoExecution = new MongoExecution();
			getDataResponseBeanList = mongoExecution.getData2(getDataBean);
			

		}

		return getDataResponseBeanList;
	}
	
	
	

	public PostDataResponseBean saveData(PostDataBean postDataBean)
			throws GenericDaoException {
		PostDataResponseBean postDataResponseBean = new PostDataResponseBean();
		if (postDataBean.getModuleCode() != null
				&& postDataBean.getModuleCode().equals("admin")) {
			MongoExecution MongoExecution = new MongoExecution();
			MongoExecution.saveData(postDataBean);
			

		} else {
			if ("oracle".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb()
					.toLowerCase())) {
				OracleDAO oracleDAO = new OracleDAO();
				oracleDAO.saveData(postDataBean);
			} else if ("mysql".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb()
					.toLowerCase())) {
				MysqlDAO mysqlDAO = new MysqlDAO();
				mysqlDAO.saveData(postDataBean);
			} else if ("sqlserver".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb()
					.toLowerCase())) {
				SqlserverDAO sqlserverDAO = new SqlserverDAO();
				sqlserverDAO.saveData(postDataBean);
			}
		}
		postDataResponseBean.setKeyColumn(postDataBean.getKeyColumn());
		postDataResponseBean.setKeyValue(postDataBean.getKeyValue());
		postDataResponseBean.setMessage("success");

		return postDataResponseBean;
	}
		

	public List<GetDataResponseBean> deleteData(GetDataBean getDataBean)
			throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		if (getDataBean.getModuleCode() != null
				&& getDataBean.getModuleCode().equals("admin")) {
			GetDataResponseBean getDataResponseBean = new GetDataResponseBean();
			MongoExecution MongoExecution = new MongoExecution();
			String[] tableListArray = getDataBean.getTableNameList();
			if (tableListArray[0].equals("adm_users")
					|| tableListArray[0].equals("adm_groups")) {
				if (MongoExecution.validationCheck(getDataBean)) {

					getDataResponseBeanList = MongoExecution
							.softDeleteData(getDataBean);
				} else {

					getDataResponseBean.setMessage(
							" Can not delete.It is in User group List");
					getDataResponseBeanList.add(getDataResponseBean);
				throw new GenericDaoException(" Can not delete.It is in User group List");
				}
				
				getDataResponseBean.setMessage(
						" success");
				getDataResponseBeanList.add(getDataResponseBean);
			} else {
				getDataResponseBeanList = MongoExecution.deleteData(getDataBean);
				getDataResponseBean.setMessage(
						" success");
				getDataResponseBeanList.add(getDataResponseBean);
			}

		}

		else {
			if ("oracle".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb()
					.toLowerCase())) {
				OracleDAO oracleDAO = new OracleDAO();
				getDataResponseBeanList = oracleDAO.getDetails(getDataBean);
			} else if ("mysql".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb()
					.toLowerCase())) {
				MysqlDAO mysqlDAO = new MysqlDAO();
				getDataResponseBeanList = mysqlDAO.getDetails(getDataBean);
			} else if ("sqlserver".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb()
					.toLowerCase())) {
				SqlserverDAO sqlserverDAO = new SqlserverDAO();
				getDataResponseBeanList = sqlserverDAO.getDetails(getDataBean);
			}
		}

		return getDataResponseBeanList;
	}

	public List<GetDataResponseBean> getRemoteData(GetDataBean getDataBean)
			throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		if ("oracle".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb().toLowerCase())) {

			OracleRemoteDAO oracleDAO = new OracleRemoteDAO();
			getDataResponseBeanList = oracleDAO.getDetails(getDataBean);
		} else if ("mysql".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb()
				.toLowerCase())) {

			OracleRemoteDAO oracleDAO = new OracleRemoteDAO();
			getDataResponseBeanList = oracleDAO.getDetails(getDataBean);
		} else if ("sqlserver".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb()
				.toLowerCase())) {

			OracleRemoteDAO oracleDAO = new OracleRemoteDAO();
			getDataResponseBeanList = oracleDAO.getDetails(getDataBean);
		}
		return getDataResponseBeanList;
	}

	public List<GetDataResponseBean> getRemoteColumnDetails(
			GetDataBean getDataBean) throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		if ("oracle".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb().toLowerCase())) {
			OracleRemoteDAO oracleDAO = new OracleRemoteDAO();
			getDataResponseBeanList = oracleDAO.getColumnDetails(getDataBean);
		} else if ("mysql".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb()
				.toLowerCase())) {
			OracleRemoteDAO oracleDAO = new OracleRemoteDAO();
			getDataResponseBeanList = oracleDAO.getColumnDetails(getDataBean);
		} else if ("sqlserver".equals(GetPropertyDetails.propertyCollection.getDbPropertyArray().getApplicationDb()
				.toLowerCase())) {
			OracleRemoteDAO oracleDAO = new OracleRemoteDAO();
			getDataResponseBeanList = oracleDAO.getColumnDetails(getDataBean);
		}
		return getDataResponseBeanList;
	}

	// for angular js UI Tree Structure
	public ArrayList<FunctionListParentBean> getFunctionList()
			throws GenericDaoException {
		DataBaseInteraction dataBaseInteraction = new DataBaseInteraction();
		ArrayList<FunctionListParentBean> returnList = new ArrayList<FunctionListParentBean>();
		ArrayList<String> functionHeader = new ArrayList();
		ArrayList<String> categorylist = new ArrayList();
		ResultSet rsSelect = null;
		try {
			Connection connection = dataBaseInteraction.getConnection();
			PreparedStatement stmt = connection
					.prepareStatement("select functioncategoryid,functionname,functiondescription ,functionid from validationfunctions");
			rsSelect = stmt.executeQuery();
			while (rsSelect.next()) {
				functionHeader.add(rsSelect.getString("functionname"));
			}
			Set set = new HashSet();
			for (String S : functionHeader) {
				if (!set.contains(S)) {
					categorylist.add(S);
				}
				set.add(S);
			}
			for (String categ : categorylist) {
				FunctionListParentBean functionnamebean = new FunctionListParentBean();
				ArrayList subList = null;
				subList = new ArrayList();
				for (int i = 0; i < categorylist.size(); i++) {
					if (categ.equals(categorylist.get(i))) {
						PreparedStatement stmt1 = connection
								.prepareStatement("select functioncategoryid,functionname,functiondescription ,functionid "
										+ "from validationfunctions where functionname ='"
										+ categ + "'");
						rsSelect = stmt1.executeQuery();
						while (rsSelect.next()) {
							FunctionListChildBean subFunctionList = new FunctionListChildBean();
							subFunctionList.setFunctionId(rsSelect
									.getString("functionid"));
							subFunctionList.setFunctionHeader(rsSelect
									.getString("functiondescription"));
							subList.add(subFunctionList);
						}

						functionnamebean.setFunctionHeader(categ);
					}

				}
				functionnamebean.setChilddata(subList);
				returnList.add(functionnamebean);
			}
		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}
		return returnList;

	}

	// for angular js UI Tree Structure for Derived fileds and Transformation
	public ArrayList<FunctionListParentBean> getDerivedFieldTreeStucture()
			throws GenericDaoException {
		DataBaseInteraction dataBaseInteraction = new DataBaseInteraction();
		ArrayList<FunctionListParentBean> returnList = new ArrayList<FunctionListParentBean>();
		ArrayList<String> functionHeader = new ArrayList();
		ArrayList<String> categorylist = new ArrayList();
		ResultSet rsSelect = null;
		try {
			Connection connection = dataBaseInteraction.getConnection();
			PreparedStatement stmt = connection
					.prepareStatement("select tsf_id,tsf_category_name,tsf_name,tsf_usage,tsf_desc from  transformation_functions");
			rsSelect = stmt.executeQuery();
			while (rsSelect.next()) {
				functionHeader.add(rsSelect.getString("tsf_category_name"));
			}
			Set set = new HashSet();
			for (String S : functionHeader) {
				if (!set.contains(S)) {
					categorylist.add(S);
				}
				set.add(S);
			}
			for (String categ : categorylist) {
				FunctionListParentBean functionnamebean = new FunctionListParentBean();
				ArrayList subList = null;
				subList = new ArrayList();
				for (int i = 0; i < categorylist.size(); i++) {
					if (categ.equals(categorylist.get(i))) {
						PreparedStatement stmt1 = connection
								.prepareStatement("select tsf_id,tsf_category_name,tsf_name,tsf_usage,tsf_desc from  transformation_functions where tsf_category_name ='"
										+ categ + "'");
						rsSelect = stmt1.executeQuery();
						while (rsSelect.next()) {
							FunctionListChildBean subFunctionList = new FunctionListChildBean();
							subFunctionList.setFunctionId(rsSelect
									.getString("tsf_usage"));
							subFunctionList.setFunctionHeader(rsSelect
									.getString("tsf_name"));
							subList.add(subFunctionList);
						}

						functionnamebean.setFunctionHeader(categ);
					}

				}
				functionnamebean.setChilddata(subList);
				returnList.add(functionnamebean);
			}
		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}
		return returnList;

	}
	
	public Connection getConnection() throws ClassNotFoundException, SQLException, GenericDaoException {
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
}
