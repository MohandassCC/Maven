package com.cc.setup.util;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;

import com.cc.setup.common.GenericDaoException;
import com.cc.setup.data.ApplicationDAO;
import com.cc.setup.data.DataBaseInteraction;
import com.cc.setup.data.GetDataBean;
import com.cc.setup.data.GetDataResponseBean;
import com.cc.setup.property.GetPropertyDetails;
import com.fasterxml.jackson.databind.ObjectMapper;


public class RemoteDataDaoImpl {

	DBConnectionManager dbConn=new DBConnectionManager();
	
	@Autowired
	DataBaseInteraction dataBaseInteraction=new DataBaseInteraction();
	
	public List<GetDataResponseBean> getUserTableList(Integer sourceId) throws GenericDaoException {
		
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		ResultSet rsSelect = null;
		Map<String, String> columnList=getSourceConfiguration(sourceId);
		String getTableQuery=null;
		if(columnList.get("driver").contains("mysql")){
			getTableQuery="SELECT DISTINCT TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='"+columnList.get("username")+"'";
		}
		else
		{
			getTableQuery="SELECT distinct TABLE_NAME FROM USER_TAB_COLUMNS";
		}
		Connection conn=getSourceConfigurationDetails(sourceId);
		PreparedStatement preparedStatement;
		try {
			  preparedStatement=conn.prepareStatement(getTableQuery);
			  rsSelect=preparedStatement.executeQuery();
			while (rsSelect.next()) {
				GetDataResponseBean getDataResponseBean = new GetDataResponseBean();

				Map<String, String> columnListMap = new HashMap<String, String>();

					columnListMap.put("tablename", rsSelect.getString("TABLE_NAME"));
				
				getDataResponseBean.setColumnList(columnListMap);
				getDataResponseBeanList.add(getDataResponseBean);
			}

		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}

		return getDataResponseBeanList;
	}
	
		public List<GetDataResponseBean> getUserTableColumns(Integer sourceId,String tableName) throws GenericDaoException {
				
				List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
				
				Map<String, String> columnList=getSourceConfiguration(sourceId);
				String getTableQuery=null;
				if(columnList.get("driver").contains("mysql")){
					getTableQuery=" SELECT COLUMN_NAME,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME =? ORDER BY ORDINAL_POSITION";
				}
				else
				{
					getTableQuery="SELECT COLUMN_NAME,DATA_TYPE,DATA_LENGTH FROM USER_TAB_COLUMNS WHERE TABLE_NAME = ? ORDER BY COLUMN_ID";
				}
				
				ResultSet rsSetCol = null;
				Connection connection=getSourceConfigurationDetails(sourceId);
				PreparedStatement preparedStatement;
				try {
					
		
					preparedStatement = connection.prepareStatement(getTableQuery);
					preparedStatement.setString(1, tableName.toUpperCase());
					rsSetCol = preparedStatement.executeQuery();
					while (rsSetCol.next()) {
						GetDataResponseBean getDataResponseBean = new GetDataResponseBean();
		
						Map<String, String> columnListMap = new HashMap<String, String>();
		
						columnListMap.put("columnname", rsSetCol.getString("COLUMN_NAME"));
						columnListMap.put("datatype", rsSetCol.getString("DATA_TYPE"));
						
						if(columnList.get("driver").contains("mysql"))
						{
							columnListMap.put("dataLength", rsSetCol.getString("CHARACTER_MAXIMUM_LENGTH"));
						}
							
						else{
							columnListMap.put("dataLength", rsSetCol.getString("DATA_LENGTH"));	
						
						}
						getDataResponseBean.setColumnList(columnListMap);
						getDataResponseBeanList.add(getDataResponseBean);
					}
		
				} catch (Exception e) {
					throw new GenericDaoException(e.getMessage());
				}
		
				return getDataResponseBeanList;
			}
	
	
	public Connection getSourceConfigurationDetails(Integer sourceId) throws GenericDaoException{		
		 String url = "";    
	     String driverName = "";   
	     String username = "";   
	     String password = "";
	     Connection connection = null;
	     ResultSet rsSet = null;
	     Connection sourceConfigConnection=null;
		try{
			connection = getConnection();
			String query="select * from SOURCE_CONFIGURATION where SOURCEID='"+sourceId+"'";
			rsSet=connection.prepareStatement(query).executeQuery();
			while(rsSet.next()){
				url=rsSet.getString("SOURCEURL");
				driverName=rsSet.getString("SOURCEDRIVER");
				username=rsSet.getString("SOURCEUSERNAME");
			    password=rsSet.getString("SOURCEPASSWORD");
			}
			
			sourceConfigConnection=dbConn.getConnection(url,driverName,username,password);
			
		}catch(Exception e){
			  throw new GenericDaoException(e.getMessage());
		}
		return sourceConfigConnection;
	}
	
	public Map<String, String> getSourceConfiguration(Integer sourceId) throws GenericDaoException{		
		Map<String, String> columnList = new HashMap<String, String>();
	     
	     ResultSet rsSet = null;
	    
		try{ Connection connection =getConnection();
		
			String query="select * from SOURCE_CONFIGURATION where SOURCEID='"+sourceId+"'";
			rsSet=connection.prepareStatement(query).executeQuery();
			while(rsSet.next()){
				
				columnList.put("sourceUrl",rsSet.getString("SOURCEURL"));
				columnList.put("driver",rsSet.getString("SOURCEDRIVER"));
				columnList.put("username",rsSet.getString("SOURCEUSERNAME"));
				columnList.put("password",rsSet.getString("SOURCEPASSWORD"));
			}
			
			
			
		}catch(Exception e){
			  throw new GenericDaoException(e.getMessage());
		}
		return columnList;
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

		return connection;
	}
	
	//to add dbRead Details into metaData workFlow
		public String insertDataintoMetaDataTable(Object object) throws SQLException, GenericDaoException{
		
			
			ObjectMapper objectmapper = new ObjectMapper();
			DbReadListBean bean = null;
			String message = null;
			String filejson = object.toString();
			try {
				bean = objectmapper.readValue(filejson, DbReadListBean.class);
			} catch (IOException e1) {
				
				e1.printStackTrace();
			}
			

			Connection connection = null;
			try {
				connection = dataBaseInteraction.getConnection();
			} catch (ClassNotFoundException | SQLException e1) {
				e1.printStackTrace();
			}
			
			  Integer meteDataId=dataBaseInteraction.getSequenceId("METADATADETAILID");
			PreparedStatement preparedStatement = null;
			preparedStatement = connection.prepareStatement("INSERT INTO WORKFLOWMETADATADETAILS (METADATADETAILID,METADATAID,SOURCEENTITY) "
					+ "VALUES (?,?,?)");

			 bean.setDbReadId(dataBaseInteraction.getSequenceId("FILEID").toString());
	        for(DBReadDetailsBean beanDetails:bean.getDbReadbean())	{
	        	
	        	beanDetails.setReadfromdbid(bean.getDbReadId());

			        try {
			
			        	preparedStatement.setInt(1, meteDataId);
						preparedStatement.setInt(2, Integer.parseInt(beanDetails.getReadfromdbid()));
						preparedStatement.setString(3, beanDetails.getSourceattributename());	
						
						preparedStatement.addBatch();
					} catch (SQLException e) {						
						throw new GenericDaoException(e.getMessage());
					}
					meteDataId=meteDataId+1;
				}
				dataBaseInteraction.updateSequence("METADATADETAILID", meteDataId);
				
				preparedStatement.executeBatch();
				
				dataBaseInteraction.updateSequence("FILEID", Integer.parseInt(bean.getDbReadId()));
				try {
					connection.close();
					preparedStatement.close();
				} catch (SQLException e) {
					
					throw new GenericDaoException(e.getMessage());
				}
				return bean.getDbReadId();
		}
		public void deleteRowId(DeleteRecordPostBean deleteBean) throws GenericDaoException{
			
			Statement stmt=null;
			try{
				Connection connection = dataBaseInteraction.getConnection();
				StringBuilder stringBuilder=new StringBuilder();
				    stringBuilder.append("DELETE FROM ");
				    stringBuilder.append(deleteBean.getTableName().toUpperCase());
				    stringBuilder.append(" WHERE "+ deleteBean.getColumnheader().toUpperCase());
				    stringBuilder.append("="+deleteBean.getKeyValue());
				    stmt=connection.createStatement();
				    stmt.executeUpdate(stringBuilder.toString());
	
				
			}catch(Exception e){
				throw new GenericDaoException(e.getMessage());
			}
			
		}

}
