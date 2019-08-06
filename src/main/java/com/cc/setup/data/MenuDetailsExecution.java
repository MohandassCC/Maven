package com.cc.setup.data;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.cc.setup.bean.AdmGroup;
import com.cc.setup.bean.AdmGroupPermission;
import com.cc.setup.bean.AdmMenu;
import com.cc.setup.bean.AdmModule;
import com.cc.setup.bean.AdmPermission;
import com.cc.setup.bean.AdmUserGroup;
import com.cc.setup.bean.MenuItems;
import com.cc.setup.bean.SubMenuItems;
import com.cc.setup.common.GenericDaoException;
import com.cc.setup.property.GetPropertyDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.util.JSON;

public class MenuDetailsExecution {
	public  DB mongoDatabase =null;
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
	public  List<String> getDataFromCollectionById(String findKey,
			String findValue, String collectionName) {
		
		List<String> outputJson = new ArrayList<String>();
		try {
		mongoDatabase = getMongoClientInstance();
		
			BasicDBObject criteria = new BasicDBObject();
			criteria.append(findKey, findValue);
			// Getting the iterable object
			DBCursor cursor = (DBCursor)mongoDatabase.getCollection(
					collectionName).find(criteria).iterator();
			DBObject doc = null;
			while (cursor.hasNext()) {
				 doc=cursor.next();
				 doc.removeField("_id");
				
				outputJson.add(doc.toString());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return outputJson;
	}

	public List<MenuItems> getMenuList(String userName) {
		List<MenuItems> menuList = new ArrayList<MenuItems>();
		List<AdmGroupPermission> admGroupPermissionList = new ArrayList<AdmGroupPermission>();
		List<AdmGroup> admGroupList = new ArrayList<AdmGroup>();
		List<AdmModule> admModuleList = new ArrayList<AdmModule>();
		List<AdmPermission> admPermissionList = new ArrayList<AdmPermission>();
		List<AdmUserGroup> admUserGroupList = new ArrayList<AdmUserGroup>();
		List<AdmMenu> admMenuList = new ArrayList<AdmMenu>();

		Map<String, String> moduleCodeModuleUrlMap = new HashMap();
		Map<String, String> menuParentCodeMenuCodeMap = new HashMap();
		StringBuilder menubuilder = new StringBuilder();

		List<String> jsonstring = getDataFromCollectionById(
				"augaususername", userName, "adm_user_groups".toUpperCase());
		System.out.println(jsonstring);
		for (String json : jsonstring) {

			try {

				AdmUserGroup admUserGroup = new ObjectMapper().readValue(json,
						AdmUserGroup.class);
				admUserGroupList.add(admUserGroup);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}

		for (AdmUserGroup admUserGroup : admUserGroupList) {
			List<String> groupPermissinstring = getDataFromCollectionById("agpagrcode",
							admUserGroup.getAugagrcode(),
							"adm_group_permissions".toUpperCase());
			for (String json : groupPermissinstring) {

				try {
					AdmGroupPermission admGroupPermission = new ObjectMapper()
							.readValue(json, AdmGroupPermission.class);
					admGroupPermissionList.add(admGroupPermission);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			}
		}
		for (AdmGroupPermission admGroupPermission : admGroupPermissionList) {
			List<String> permissionstring =getDataFromCollectionById("apncode",
							admGroupPermission.getAgpapncode(),
							"adm_permissions".toUpperCase());

			for (String json : permissionstring) {

				try {
					AdmPermission admPermission = new ObjectMapper().readValue(
							json, AdmPermission.class);
					admPermissionList.add(admPermission);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			}
		}

		for (AdmPermission admPermission : admPermissionList) {
			List<String> modulestring = getDataFromCollectionById("amdcode",
							admPermission.getApnamdcode(),
							"adm_modules".toUpperCase());

			for (String json : modulestring) {

				try {
					AdmModule admModule = new ObjectMapper().readValue(json,
							AdmModule.class);
					admModuleList.add(admModule);
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			}
		}
		for (AdmModule admModule : admModuleList) {
			moduleCodeModuleUrlMap.put(admModule.getAmdcode(),
					admModule.getAmdurl());
			List<String> menustring = getDataFromCollectionById(
					"amnamdcode", admModule.getAmdcode(),
					"adm_menus".toUpperCase());

			for (String json : menustring) {

				try {
					AdmMenu admMenu = new ObjectMapper().readValue(json,
							AdmMenu.class);
					if(admMenu.getAmntargetwindow().equals("M")){
					if (admMenu.getAmnparentamncode() != null
							&& !admMenu.getAmntype().equals("M")) {
						menuParentCodeMenuCodeMap.put(
								admMenu.getAmnparentamncode(),
								admMenu.getAmncode());
					}
					admMenuList.add(admMenu);
					}
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			}
		}
		for (AdmMenu admMenu : admMenuList) {
			String url = moduleCodeModuleUrlMap.get(admMenu.getAmnamdcode());
			// main menu
			if (admMenu.getAmntype().equals("M")) {
				MenuItems menuModel = new MenuItems();
				menuModel.setUrl(url);
				menuModel.setMenuId(admMenu.getAmnsortorder());
				menuModel.setName(admMenu.getAmnname());
				menuModel.setParentCode(admMenu.getAmnparentamncode());
				menuModel.setType(admMenu.getAmntype());
				menuModel.setModuleCode(admMenu.getAmnmodulecode());
				if (admMenu.getAmntype().equals("M")) {

					menuModel.setSubMenu(true);
					menuModel.setSortOrder(admMenu.getAmnsortorder());
					menuModel.setSubMenuItems(getSubMenuList(
							menuParentCodeMenuCodeMap, moduleCodeModuleUrlMap,
							admMenuList, admMenu.getAmncode(), "P"));
				} else {
					menuModel.setSubMenu(false);
					menuModel.setSortOrder(admMenu.getAmnsortorder());

				}
				menuList.add(menuModel);

			}
		}

		// menubuilder.append("}");
		System.out.println("menubuilder: " + menubuilder.toString());
		return menuList;

	}

	public List<SubMenuItems> getSubMenuList(
			Map<String, String> menuParentCodeMenuCodeMap,
			Map<String, String> moduleCodeModuleUrlMap,
			List<AdmMenu> admMenuList, String amnCode, String menuType) {
		StringBuilder menubuilder = new StringBuilder();
		List<SubMenuItems> subMenuItemsList = new ArrayList<SubMenuItems>();

		if (menuParentCodeMenuCodeMap.size() > 0
				&& menuParentCodeMenuCodeMap.get(amnCode) != null) {

			for (AdmMenu admMenu : admMenuList) {
				if (admMenu.getAmnparentamncode().equals(amnCode)) {// 1st level
																	// submenu
					if (admMenu.getAmntype().equals(menuType)) {
						SubMenuItems subMenuItems = new SubMenuItems();

						menubuilder.append("{");
						String url = moduleCodeModuleUrlMap.get(admMenu
								.getAmnamdcode());

						subMenuItems.setUrl(url);
						subMenuItems.setMenuId(admMenu.getAmnsortorder());
						subMenuItems.setName(admMenu.getAmnname());
						subMenuItems.setParentCode(admMenu
								.getAmnparentamncode());
						subMenuItems.setSortOrder(admMenu.getAmnsortorder());
						subMenuItems.setSubMenuId(admMenu.getAmnsortorder());

						if (admMenu.getAmntype().equals(menuType)) {
							subMenuItems.setSubmenus(true);
							getSubMenuList(menuParentCodeMenuCodeMap,
									moduleCodeModuleUrlMap, admMenuList,
									admMenu.getAmncode(), "P1");
						} else {
							subMenuItems.setSubmenus(false);

						}
						subMenuItemsList.add(subMenuItems);
					}
				}

			}			

		}

		return subMenuItemsList;

	}

	public static void main(String args[]) {
		MenuDetailsExecution menuDetailsExecution = new MenuDetailsExecution();
		menuDetailsExecution.getMenuList("nagils");
	}

}
