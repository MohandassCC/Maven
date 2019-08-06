package com.cc.setup.data;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.Set;

import org.bson.Document;

import com.cc.setup.bean.AdmGroup;
import com.cc.setup.bean.AdmGroupPermission;
import com.cc.setup.bean.AdmModule;
import com.cc.setup.bean.AdmPermission;
import com.cc.setup.common.GenericDaoException;
import com.cc.setup.property.GetPropertyDetails;
import com.cc.setup.util.PasswordEncryptorDecryptorAES;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.DBCursor;
import com.mongodb.Mongo;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.util.JSON;

public class MongoExecution {
	
	public  DB mongoDatabase =null;

	public List<GetDataResponseBean> getDetails(GetDataBean getDataBean)
			throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		mongoDatabase=getMongoClientInstance();
		try {

			Map<String, String> columnDataTypeMap = new HashMap();
			String[] tableListArray = getDataBean.getTableNameList();
			if (getDataBean.getFiltersList() != null
					&& getDataBean.getFiltersList().length > 0) {
				getDataResponseBeanList = getCollectionData(tableListArray,
						mongoDatabase, columnDataTypeMap,
						getDataBean.getFiltersList());

			} else {
				getDataResponseBeanList = getCollectionData(tableListArray,
						mongoDatabase, columnDataTypeMap);
			}

		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}
		
		return getDataResponseBeanList;
	}

//	public  String getMenuList(String userName) {
//		List<AdmGroupPermission> admGroupPermissionList = new ArrayList<AdmGroupPermission>();
//		List<AdmGroup> admGroupList = new ArrayList<AdmGroup>();
//		List<AdmModule> admModuleList = new ArrayList<AdmModule>();
//		List<AdmPermission> admPermissionList = new ArrayList<AdmPermission>();
//		List<AdmUserGroup> admUserGroupList = new ArrayList<AdmUserGroup>();
//		List<AdmMenu> admMenuList = new ArrayList<AdmMenu>();
//		
//		Map<String,String> moduleCodeModuleUrlMap=new HashMap();
//		Map<String,String> menuParentCodeMenuCodeMap=new HashMap();
//		StringBuilder menubuilder=new StringBuilder();
//		
//		
//		
//		List<String> jsonstring = mongoDBConfig.getDataFromCollectionById(
//				"augaususername", userName,
//				"adm_user_groups".toUpperCase());
//		System.out.println(jsonstring);
//		for (String json : jsonstring) {
//
//			try {
//
//				AdmUserGroup admUserGroup = new ObjectMapper().readValue(json,
//						AdmUserGroup.class);
//				admUserGroupList.add(admUserGroup);
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//
//		}
//
//		for (AdmUserGroup admUserGroup : admUserGroupList) {
//			List<String> groupPermissinstring = mongoDBConfig
//					.getDataFromCollectionById("agpagrcode",
//							admUserGroup.getAugagrcode(),
//							"adm_group_permissions".toUpperCase());
//			for (String json : groupPermissinstring) {
//
//				try {
//					AdmGroupPermission admGroupPermission = new ObjectMapper()
//							.readValue(json, AdmGroupPermission.class);
//					admGroupPermissionList.add(admGroupPermission);
//				} catch (IOException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				}
//
//			}
//		}
//		for (AdmGroupPermission admGroupPermission : admGroupPermissionList) {
//			List<String> permissionstring = mongoDBConfig
//					.getDataFromCollectionById("apncode",
//							admGroupPermission.getAgpapncode(),
//							"adm_permissions".toUpperCase());
//
//			for (String json : permissionstring) {
//
//				try {
//					AdmPermission admPermission = new ObjectMapper().readValue(
//							json, AdmPermission.class);
//					admPermissionList.add(admPermission);
//				} catch (IOException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				}
//
//			}
//		}
//
//		for (AdmPermission admPermission : admPermissionList) {
//			List<String> modulestring = mongoDBConfig
//					.getDataFromCollectionById("amdcode",
//							admPermission.getApnamdcode(),
//							"adm_modules".toUpperCase());
//
//			for (String json : modulestring) {
//
//				try {
//					AdmModule admModule = new ObjectMapper().readValue(json,
//							AdmModule.class);
//					admModuleList.add(admModule);
//				} catch (IOException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				}
//
//			}
//		}
//		for (AdmModule admModule : admModuleList) {
//			moduleCodeModuleUrlMap.put(admModule.getAmdcode(), admModule.getAmdurl());
//			List<String> menustring = mongoDBConfig.getDataFromCollectionById(
//					"amnamdcode", admModule.getAmdcode(),
//					"adm_menus".toUpperCase());
//
//			for (String json : menustring) {
//
//				try {
//					AdmMenu admMenu = new ObjectMapper().readValue(json,
//							AdmMenu.class);
//					if(admMenu.getAmnparentamncode()!=null &&!admMenu.getAmntype().equals("M")){
//					menuParentCodeMenuCodeMap.put(admMenu.getAmnparentamncode(), admMenu.getAmncode());
//					}
//					admMenuList.add(admMenu);
//				} catch (IOException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				}
//
//			}
//		}
//		for (AdmMenu admMenu : admMenuList) {
//			String url=moduleCodeModuleUrlMap.get(admMenu.getAmnamdcode());
//			//main menu
//			if(admMenu.getAmntype().equals("M")){
//			menubuilder.append("{");
//			menubuilder.append("\"url\":\"").append(url).append("\",");
//
//			menubuilder.append("\"menuId\":\"").append(admMenu.getAmnsortorder()).append("\",");
//								menubuilder.append("\"name\":\"").append(admMenu.getAmnname()).append("\",");
//								menubuilder.append("\"parentCode\":\"").append(admMenu.getAmnparentamncode()).append("\",");
//								menubuilder.append("\"type\":\"").append(admMenu.getAmntype()).append("\",");
//								menubuilder.append("\"moduleCode\":\"").append(admMenu.getAmnmodulecode()).append("\",");	
//							//	if(admMenu.getAmntype().equals("M")||admMenu.getAmntype().equals("P")){
//								if(admMenu.getAmntype().equals("M")){
//								menubuilder.append("\"subMenu\":\"").append("true\",");
//								menubuilder.append("\"subMenuItems\":[");
//								menubuilder.append(getSubMenuList(menuParentCodeMenuCodeMap,moduleCodeModuleUrlMap,admMenuList,admMenu.getAmncode(),"P"));
//								
//								
//								menubuilder.append("]");
//								menubuilder.append("}");
//								}
//								else{
//									menubuilder.append("\"subMenu\":\"").append("false\",");
//									menubuilder.append("\"subMenuItems\":\"[]");
//									menubuilder.append("}");
//								}
//								//
//								
//								
//			
//		}
//		}
//		
//		//menubuilder.append("}");
//		System.out.println("menubuilder: "+menubuilder.toString());
//		return "";
//
//	}
//	
//	
//	public  String  getSubMenuList(Map<String,String> menuParentCodeMenuCodeMap,Map<String,String> moduleCodeModuleUrlMap, List<AdmMenu> admMenuList,String amnCode,String menuType)
//	{
//		StringBuilder menubuilder=new StringBuilder();
//		
//		
//		if(menuParentCodeMenuCodeMap.size()>0 && menuParentCodeMenuCodeMap.get(amnCode)!=null)
//		{
//			
//			for (AdmMenu admMenu : admMenuList) {
//			if(admMenu.getAmnparentamncode().equals(amnCode))
//			{//1st level submenu
//				if(admMenu.getAmntype().equals(menuType)){
//			
//				menubuilder.append("{");
//				String url=moduleCodeModuleUrlMap.get(admMenu.getAmnamdcode());
//				
//				menubuilder.append("\"url\":\"").append(url).append("\",");
//
//				menubuilder.append("\"menuId\":\"").append(admMenu.getAmnsortorder()).append("\",");
//									menubuilder.append("\"name\":\"").append(admMenu.getAmnname()).append("\",");
//									menubuilder.append("\"parentCode\":\"").append(admMenu.getAmnparentamncode()).append("\",");
//									menubuilder.append("\"type\":\"").append(admMenu.getAmntype()).append("\",");
//									menubuilder.append("\"moduleCode\":\"").append(admMenu.getAmnmodulecode()).append("\",");	
//									//if(admMenu.getAmntype().equals("M")||admMenu.getAmntype().equals("P")){
//										if(admMenu.getAmntype().equals(menuType)){
//									menubuilder.append("\"subMenu\":\"").append("true\",");
//									menubuilder.append("\"subMenuItems\":[");
//									getSubMenuList(menuParentCodeMenuCodeMap,moduleCodeModuleUrlMap,admMenuList,admMenu.getAmncode(),"P1");
//									menubuilder.append("]");
//									menubuilder.append("}").append(",");
//									}
//									else{
//										menubuilder.append("\"subMenu\":\"").append("false\",");
//										menubuilder.append("\"subMenuItems\":[]");
//										menubuilder.append("}");
//									}
//									//
//			}
//			}
//				
//			}
//			menubuilder.deleteCharAt(menubuilder.lastIndexOf(","));
//			
//		}
//		
//		return menubuilder.toString();
//		
//	}

	
	public List<GetDataResponseBean> getData2(GetDataBean getDataBean)
			throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		List<AdmGroupPermission> admGroupPermissionList = new ArrayList<AdmGroupPermission>();
		List<AdmGroup> admGroupList = new ArrayList<AdmGroup>();
		List<AdmModule> admModuleList = new ArrayList<AdmModule>();
		List<AdmPermission> admPermissionList = new ArrayList<AdmPermission>();

		// ResultSet rsSelect = null;
//		try {
//
//			Map<String, String> columnDataTypeMap = new HashMap();
//			String[] tableListArray = getDataBean.getTableNameList();
//			String[] filtersList = getDataBean.getTableNameList();
//			for (int i = 0; i < tableListArray.length; i++) {
//				MongoCursor cursor = MongoDBConfig
//						.getMongoCursor(tableListArray[i].toUpperCase());
//				// Map<String, Class> tableClassMap
//				// =ApplicationVariables.getTableClassMap();
//				while (cursor.hasNext()) {
//					Document doc = (Document) cursor.next();
//					if (tableListArray[i].equals("adm_group_permissions")) {
//						AdmGroupPermission admGroupPermission = new ObjectMapper()
//								.convertValue(cursor.next(),
//										AdmGroupPermission.class);
//						admGroupPermissionList.add(admGroupPermission);
//					} else if (tableListArray[i].equals("adm_groups")) {
//						AdmGroup admGroup = new ObjectMapper().convertValue(
//								cursor.next(), AdmGroup.class);
//						admGroupList.add(admGroup);
//					} else if (tableListArray[i].equals("adm_modules")) {
//						AdmModule admModule = new ObjectMapper().convertValue(
//								cursor.next(), AdmModule.class);
//						admModuleList.add(admModule);
//					}
//
//				}
//				cursor.close();
//
//			}
//			if (admGroupPermissionList.size() > 0) {
//				List<String> moduleList = new ArrayList();
//				for (AdmGroupPermission admGroupPermission : admGroupPermissionList) {
//					for (AdmPermission admPermission : admPermissionList) {
//						if (admGroupPermission.getAGP_APN_CODE().equals(
//								admPermission.getAPN_CODE())) {
//							moduleList.add(admPermission.getAPN_AMD_CODE());
//						}
//					}
//
//				}
//				if (moduleList.size() > 0) {
//					for (AdmModule admModule : admModuleList) {
//						if (moduleList.contains(admModule.getAMD_CODE())) {
//							// moduleList.add(admPermission.getApn_amd_code());
//						}
//
//					}
//
//				}
//
//			}
//
//		} catch (Exception e) {
//			throw new GenericDaoException(e.getMessage());
//		}

		return getDataResponseBeanList;
	}

	public List<GetDataResponseBean> deleteData(GetDataBean getDataBean)
			throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		mongoDatabase=getMongoClientInstance();
		try {

			Map<String, String> columnDataTypeMap = new HashMap();
			String[] tableListArray = getDataBean.getTableNameList();
			if (getDataBean.getFiltersList() != null
					&& getDataBean.getFiltersList().length > 0) {
				getDataResponseBeanList = removeCollectionData(tableListArray,
						mongoDatabase, getDataBean);

			}

		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}

		return getDataResponseBeanList;
	}

	public List<GetDataResponseBean> softDeleteData(GetDataBean getDataBean)
			throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		mongoDatabase=getMongoClientInstance();
		try {

			String[] tableListArray = getDataBean.getTableNameList();
			String[] filterList = getDataBean.getFiltersList();
			BasicDBObject criteria = new BasicDBObject();
			Document setData = new Document();
			if (tableListArray[0].equals("adm_users")) {

				criteria.append("aususername", filterList[0].split("=")[1]);
				setData.append("ausdeleteflag", "Y");
			} else if (tableListArray[0].equals("adm_groups")) {
				criteria.append("agrcode", filterList[0].split("=")[1]);
				setData.append("agrdeleteflag", "Y");
			}
			DBCollection collection =  mongoDatabase
					.getCollection(tableListArray[0].toUpperCase());
			DBCursor cursor =(DBCursor) collection.find(criteria).iterator();
			DBObject doc = null;
			while (cursor.hasNext()) {
				doc = cursor.next();
			}
			BasicDBObject update = new BasicDBObject();
			update.append("$set", setData);
			// To update single Document
			collection.update(doc, update);

		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}

		return getDataResponseBeanList;
	}

	public boolean validationCheck(GetDataBean getDataBean)
			throws GenericDaoException {
		boolean canDelete = true;
		mongoDatabase=getMongoClientInstance();
		try {
			String[] tableListArray = getDataBean.getTableNameList();
			String[] filterList = getDataBean.getFiltersList();
			BasicDBObject criteria = new BasicDBObject();

			if (tableListArray[0].equals("adm_users")) {
				criteria.append("aug_aus_username", filterList[0].split("=")[1]);
			} else if (tableListArray[0].equals("adm_groups")) {
				criteria.append("aug_agr_code", filterList[0].split("=")[1]);

			}

			DBCollection collection =  mongoDatabase
					.getCollection("adm_user_groups".toUpperCase());

		DBCursor cursor = (DBCursor) collection.find(criteria).iterator();
			while (cursor.hasNext()) {
				// Document doc = cursor.next();
				// if (doc.isEmpty()) {
				// canDelete = true;
				// } else {
				canDelete = false;
				break;
				// }

			}
		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}
		return canDelete;
	}

	public List<GetDataResponseBean> removeCollectionData(
			String[] tableListArray, DB mongoDatabase,
			GetDataBean getDataBean) throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		mongoDatabase=getMongoClientInstance();
		try {
			if (tableListArray != null && tableListArray.length == 1) {

				MongoCollection collection = (MongoCollection) mongoDatabase
						.getCollection(tableListArray[0].toUpperCase());
				BasicDBObject criteria = new BasicDBObject();
				String[] filterList = getDataBean.getFiltersList();

				for (int i = 0; i < filterList.length; i++) {

					criteria.append(filterList[i].split("=")[0],
							filterList[i].split("=")[1]);

				}
				collection.deleteOne(criteria);

			}
		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}
		return getDataResponseBeanList;

	}

	public List<GetDataResponseBean> getCollectionData(String[] tableListArray,
			DB mongoDatabase, Map<String, String> columnDataTypeMap)
			throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		mongoDatabase=getMongoClientInstance();
		try {
			if (tableListArray != null && tableListArray.length == 1) {

				DBCollection collection = mongoDatabase
						.getCollection(tableListArray[0].toUpperCase());

				DBCursor cursor = (DBCursor) collection.find().iterator();
				while (cursor.hasNext()) {
					GetDataResponseBean getDataResponseBean = new GetDataResponseBean();
					// setcolumnDataTypeMap(columnDataTypeMap, collection);
					getDataResponseBean.setKeyColumn("");
					getDataResponseBean.setKeyValue("");
					getDataResponseBean.setMessage("");
					getDataResponseBean.setWsCode("");
					DBObject doc =  cursor.next();
					Map<String, String> columnList = new HashMap<String, String>();
					for(String column:doc.keySet())
					{
						columnList.put(column, doc.get(column) + "");	
					}
					getDataResponseBean.setColumnList(columnList);
					getDataResponseBeanList.add(getDataResponseBean);
				}

			} else if (tableListArray != null && tableListArray.length == 1) {
				for (int i = 0; i < tableListArray.length; i++) {
					Map<String, String> columnList = new HashMap<String, String>();
					DBCollection collection = mongoDatabase
							.getCollection(tableListArray[i].toUpperCase());

					DBCursor cursor = (DBCursor)collection.find().iterator();
					while (cursor.hasNext()) {
						DBObject doc = cursor.next();
						GetDataResponseBean getDataResponseBean = new GetDataResponseBean();
						// setcolumnDataTypeMap(columnDataTypeMap, collection);
						getDataResponseBean.setKeyColumn("");
						getDataResponseBean.setKeyValue("");
						getDataResponseBean.setMessage("");
						getDataResponseBean.setWsCode("");
						//Map<String, String> columnList = new HashMap<String, String>();
						for(String column:doc.keySet())
						{
							columnList.put(column, doc.get(column) + "");	
						}
						getDataResponseBean.setColumnList(columnList);
						getDataResponseBeanList.add(getDataResponseBean);
					}

					// mongoCollectionDataList.add(collection);
				}
			}
		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}
		return getDataResponseBeanList;

	}

	public List<GetDataResponseBean> getCollectionData(String[] tableListArray,
			DB mongoDatabase, Map<String, String> columnDataTypeMap,
			String[] filterList) throws GenericDaoException {
		List<GetDataResponseBean> getDataResponseBeanList = new ArrayList<GetDataResponseBean>();
		mongoDatabase=getMongoClientInstance();

		try {

			if (tableListArray != null && tableListArray.length == 1) {
				DBCollection collection = mongoDatabase
						.getCollection(tableListArray[0].toUpperCase());
				DBCursor cursor = null;
				StringBuilder filterBuilder = new StringBuilder();
				BasicDBObject criteria = new BasicDBObject();
			//	if (filterList.length > 1) {
					// filterBuilder.append("and(");
					for (int i = 0; i < filterList.length; i++) {

						criteria.append(filterList[i].split("=")[0],
								filterList[i].split("=")[1]);

					}
//					// filterBuilder.append(")");
//					cursor = (DBCursor) collection.find(criteria).iterator();
//				} else {
//					cursor = (DBCursor) collection.find(
//							 (Filters.eq(filterList[0].split("=")[0],
//									filterList[0].split("=")[1]))).iterator();
						cursor = (DBCursor) collection.find(criteria).iterator();
				//}
				while (cursor.hasNext()) {
					GetDataResponseBean getDataResponseBean = new GetDataResponseBean();
					// setcolumnDataTypeMap(columnDataTypeMap, collection);
					getDataResponseBean.setKeyColumn("");
					getDataResponseBean.setKeyValue("");
					getDataResponseBean.setMessage("");
					getDataResponseBean.setWsCode("");
					DBObject doc =  cursor.next();			
					
					Map<String, String> columnList = new HashMap<String, String>();
					for(String column:doc.keySet())
					{
						columnList.put(column, doc.get(column) + "");	
					}
//					Set<Entry<String, Object>> entries = doc.entrySet();
//					for (Entry<String, Object> entry : entries) {
//						String fieldName = entry.getKey();
//						columnList.put(fieldName, doc.get(fieldName) + "");
//
//					}
					getDataResponseBean.setColumnList(columnList);
					if ("adm_users".equals(tableListArray[0])) {
						String password = PasswordEncryptorDecryptorAES
								.getDecryptedPassword(getDataResponseBean
										.getColumnList().get("auspassword"));
						getDataResponseBean.getColumnList().put("auspassword",
								password);
					}

					getDataResponseBeanList.add(getDataResponseBean);
				}

			} else if (tableListArray != null && tableListArray.length > 1) {
				for (int i = 0; i < tableListArray.length; i++) {
					Map<String, String> columnList = new HashMap<String, String>();
					DBCollection collection = mongoDatabase
							.getCollection(tableListArray[i].toUpperCase());
					DBCursor cursor = null;
					cursor =  (DBCursor)collection.find().iterator();
					while (cursor.hasNext()) {
						DBObject doc =  cursor.next();		
						GetDataResponseBean getDataResponseBean = new GetDataResponseBean();
						// setcolumnDataTypeMap(columnDataTypeMap, collection);
						getDataResponseBean.setKeyColumn("");
						getDataResponseBean.setKeyValue("");
						getDataResponseBean.setMessage("");
						getDataResponseBean.setWsCode("");
							
						
						
						for(String column:doc.keySet())
						{
							columnList.put(column, doc.get(column) + "");	
						}

//						Set<Entry<String, Object>> entries = doc.entrySet();
//						for (Entry<String, Object> entry : entries) {
//							String fieldName = entry.getKey();
//							columnList.put(fieldName, doc.get(fieldName) + "");
//						}
						getDataResponseBean.setColumnList(columnList);
						if ("adm_users".equals(tableListArray[i])) {
							String password = PasswordEncryptorDecryptorAES
									.getDecryptedPassword(getDataResponseBean
											.getColumnList()
											.get("auspassword"));
							getDataResponseBean.getColumnList().put(
									"auspassword", password);
						}
						getDataResponseBeanList.add(getDataResponseBean);
					}

					// mongoCollectionDataList.add(collection);
				}
			}
		} catch (Exception e) {
			throw new GenericDaoException(e.getMessage());
		}

		return getDataResponseBeanList;

	}

	public void setcolumnDataTypeMap(Map<String, String> columnDataTypeMap,
			MongoCollection collection) throws GenericDaoException {
		mongoDatabase=getMongoClientInstance();
		FindIterable<Document> iterDoc = collection.find();
		MongoCursor<Document> cursor = iterDoc.iterator();
		while (cursor.hasNext()) {
			Document doc = cursor.next();

			Set<Entry<String, Object>> entries = doc.entrySet();
			for (Entry<String, Object> entry : entries) {
				String fieldName = entry.getKey();
				Object name = doc.get(fieldName);
				String typeString = name == null ? "null" : name.getClass()
						.toString();
				System.out.println(fieldName + ":" + typeString);
				typeString = getType(typeString);

				System.out.println(fieldName + ":" + typeString);
				columnDataTypeMap.put(fieldName, typeString);
			}

		}

	}

	private String getType(String typeString) {
		if (typeString.endsWith("String")) {
			typeString = "S";
		} else if (typeString.endsWith("Integer")) {
			typeString = "N";
		} else if (typeString.endsWith("Date")) {
			typeString = "D";
		}
		return typeString;
	}

//	public synchronized DB getMongoClientInstance() {
//		MongoDBConfig mongoDBConfig=new MongoDBConfig();
//		if (mongoDatabase == null) {
//			try {
//				mongoDatabase = mongoDBConfig.getMongoClientInstance();
//			} catch (Exception e) {
//				// TODO Auto-generated catch block
//				// e.printStackTrace();
//				System.out.println(e.getMessage());
//			}
//		}
//		return mongoDatabase;
//	}
	
	public DB getMongoClientInstance() throws GenericDaoException {
		Properties property = GetPropertyDetails.getMongoProperties();
		Mongo mongo = null;
		try {
			mongo = new Mongo(property.getProperty("mongourl"), Integer.parseInt(property.get("mongoport").toString()));
			mongoDatabase = mongo.getDB(property.getProperty("mongodbname"));
		} catch (Exception e) {

		} finally {
			mongo = null;
		}
		return mongoDatabase;
	}


	public PostDataBean saveData(PostDataBean webServicePostInput)
			throws GenericDaoException {
		PostDataBean postDataBean = new PostDataBean();
		mongoDatabase=getMongoClientInstance();
		if (webServicePostInput.getAction().equals("I")) {
			for (int i = 0; i < webServicePostInput.getColumnValueMap().size(); i++) {

				Map<String, String> dataMap = webServicePostInput
						.getColumnValueMap().get(i);
				if (webServicePostInput.getTableName().equals("adm_users")) {

					try {
						String userPassword = PasswordEncryptorDecryptorAES
								.doPasswordEncryption(dataMap
										.get("auspassword"));
						dataMap.put("auspassword", userPassword);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

				}
				try {

					DBObject insertObject = (DBObject) JSON
							.parse(new ObjectMapper()
									.writeValueAsString(dataMap));
					Gson gson = new Gson();
					Document document = Document.parse(gson
							.toJson(insertObject));
					document.remove("_id");
					
				
					mongoDatabase.getCollection(
							webServicePostInput.getTableName().toUpperCase())
							.insert(new BasicDBObject(document));
					;
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

		} else if (webServicePostInput.getAction().equals("U")) {
			Gson gson = new Gson();
			Map<String, String> dataMap = webServicePostInput
					.getColumnValueMap().get(0);
			if (webServicePostInput.getTableName().equals("adm_users")) {

				try {
					String userPassword = PasswordEncryptorDecryptorAES
							.doPasswordEncryption(dataMap.get("auspassword"));
					dataMap.put("auspassword", userPassword);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			}
			DBCollection collection = mongoDatabase
					.getCollection(webServicePostInput.getTableName()
							.toUpperCase());
			DBObject updateObject;
			try {
				if (!webServicePostInput.getTableName().equals(
						"adm_user_groups")) {
					updateObject = (DBObject) JSON.parse(new ObjectMapper()
							.writeValueAsString(dataMap));

					Document updateDocument = Document.parse(gson
							.toJson(updateObject));
					updateDocument.remove("_id");
					mongoDatabase.getCollection(
							webServicePostInput.getTableName().toUpperCase())
							.remove(
									new BasicDBObject(webServicePostInput
											.getKeyColumn(),
											webServicePostInput.getKeyValue()));
					mongoDatabase.getCollection(
							webServicePostInput.getTableName().toUpperCase())
							.insert(new BasicDBObject(updateDocument));
				} else {
					updateObject = (DBObject) JSON.parse(new ObjectMapper()
							.writeValueAsString(dataMap));

					Document updateDocument = Document.parse(gson
							.toJson(updateObject));
					updateDocument.remove("_id");

					StringBuilder filterBuilder = new StringBuilder();
					BasicDBObject criteria = new BasicDBObject();
					String[] filterList = webServicePostInput.getWhereList();
					if (webServicePostInput.getWhereList().length > 1) {
						// filterBuilder.append("and(");
						for (int i = 0; i < filterList.length; i++) {

							criteria.append(filterList[i].split("=")[0],
									filterList[i].split("=")[1]);

						}

						mongoDatabase.getCollection(
								webServicePostInput.getTableName()
										.toUpperCase()).remove(criteria);
						mongoDatabase.getCollection(
								webServicePostInput.getTableName()
										.toUpperCase()).insert(new BasicDBObject(updateDocument));
					}
				}
				postDataBean.setKeyColumn(webServicePostInput.getKeyColumn());
				postDataBean.setKeyValue(webServicePostInput.getKeyValue());
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

		return postDataBean;
	}
	public static void main(String ar[]) throws GenericDaoException
	{MongoExecution mongoExecution=new MongoExecution();
		
		DB		mongoDatabase=mongoExecution.getMongoClientInstance();
	DBCollection collection = mongoDatabase
			.getCollection("Bank");
	System.out.println(collection.count());
	BasicDBObject criteria = new BasicDBObject();
	criteria.append("name", "ABC");
	System.out.println(collection.getCount(criteria));
		
	}

}
