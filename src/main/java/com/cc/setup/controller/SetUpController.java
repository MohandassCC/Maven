package com.cc.setup.controller;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.cc.setup.bean.MenuItems;
import com.cc.setup.common.FunctionListParentBean;
import com.cc.setup.common.GenericDaoException;
import com.cc.setup.data.ApplicationDAO;
import com.cc.setup.data.GetDataBean;
import com.cc.setup.data.GetDataResponseBean;
import com.cc.setup.data.MenuDetails;
import com.cc.setup.data.PostDataBean;
import com.cc.setup.data.PostDataResponseBean;
import com.cc.setup.util.ApplicationConstants;
import com.cc.setup.util.DeleteRecordPostBean;
import com.cc.setup.util.RemoteDataDaoImpl;

@Controller
@RequestMapping(value = "/adminsetup")
public class SetUpController {

	@RequestMapping(value = "/getData", method = RequestMethod.POST)
	public ResponseEntity<Object> getData(@RequestBody GetDataBean getDataBean) {
		System.out.println("coming getData");
		List<GetDataResponseBean> getResponseBeanList = new ArrayList<GetDataResponseBean>();
		try {
			ApplicationDAO applicationDAO = new ApplicationDAO();
			getResponseBeanList = applicationDAO.getData(getDataBean);
			System.out.println("returnString in controller");
		} catch (Exception e) {
			Map<String, String> statusMap = new HashMap<String, String>();
			statusMap.put("failure", e.getMessage());
			return new ResponseEntity<Object>(statusMap, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Object>(getResponseBeanList, HttpStatus.OK);
	}
	
	
	@RequestMapping(value = "/getData2", method = RequestMethod.POST)
	public ResponseEntity<Object> getData2(@RequestBody GetDataBean getDataBean) {
		System.out.println("coming getData");
		List<GetDataResponseBean> getResponseBeanList = new ArrayList<GetDataResponseBean>();
		try {
			ApplicationDAO applicationDAO = new ApplicationDAO();
			getResponseBeanList = applicationDAO.getData2(getDataBean);
			System.out.println("returnString in controller");
		} catch (Exception e) {
			Map<String, String> statusMap = new HashMap<String, String>();
			statusMap.put("failure", e.getMessage());
			return new ResponseEntity<Object>(statusMap, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Object>(getResponseBeanList, HttpStatus.OK);
	}

	@RequestMapping(value = "/saveDetails", method = RequestMethod.POST)
	public ResponseEntity<Object> saveDetails(@RequestBody PostDataBean postDataBean) {
		System.out.println("coming into sv saveDetails :" + new Date().toString());
		PostDataResponseBean postDataResponseBean = new PostDataResponseBean();		
		try {
			ApplicationDAO applicationDAO = new ApplicationDAO();
			postDataResponseBean = applicationDAO.saveData(postDataBean);
		} catch (Exception e) {
			postDataResponseBean.setMessage("failure");
			return new ResponseEntity<Object>(postDataResponseBean, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		System.out.println("ending sv saveDetails :" + new Date().toString());
		postDataResponseBean.setKeyColumn(postDataBean.getKeyColumn());
		postDataResponseBean.setKeyValue(postDataBean.getKeyValue());
		postDataResponseBean.setWsCode(postDataBean.getWsCode());
		postDataResponseBean.setMessage("success");
		return new ResponseEntity<Object>(postDataResponseBean, HttpStatus.OK);
	}
	
	
	@RequestMapping(value = "/deleteData", method = RequestMethod.POST)
	public ResponseEntity<Object> deleteData(@RequestBody GetDataBean getDataBean) {
		System.out.println("coming getData");
		List<GetDataResponseBean> getResponseBeanList = new ArrayList<GetDataResponseBean>();

		try {
			ApplicationDAO applicationDAO = new ApplicationDAO();
			
			getResponseBeanList = applicationDAO.deleteData(getDataBean);
			System.out.println("returnString in controller");
		} catch (Exception e) {
			Map<String, String> statusMap = new HashMap<String, String>();
			statusMap.put("failure", e.getMessage());
			return new ResponseEntity<Object>(statusMap, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Object>(getResponseBeanList, HttpStatus.OK);
	}
	
	

	
	
	@RequestMapping(value = "/getRemoteDatatTable", method = RequestMethod.POST)
	public ResponseEntity<Object> getRemoteData(@RequestBody GetDataBean getDataBean) {
		System.out.println("coming getRemoteData");
		List<GetDataResponseBean> getResponseBeanList = new ArrayList<GetDataResponseBean>();
		try {
			ApplicationDAO applicationDAO = new ApplicationDAO();
			getResponseBeanList = applicationDAO.getRemoteData(getDataBean);
			System.out.println("returnString in controller");
		} catch (Exception e) {
			Map<String, String> statusMap = new HashMap<String, String>();
			statusMap.put("failure", e.getMessage());
			return new ResponseEntity<Object>(statusMap, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Object>(getResponseBeanList, HttpStatus.OK);
	}

	@RequestMapping(value = "/getRemoteDatatTableColumns", method = RequestMethod.POST)
	public ResponseEntity<Object> getRemoteDatatTableColumns(@RequestBody GetDataBean getDataBean) {
		System.out.println("coming getRemoteDatatTableColumns");
		List<GetDataResponseBean> getResponseBeanList = new ArrayList<GetDataResponseBean>();
		try {
			ApplicationDAO applicationDAO = new ApplicationDAO();
			getResponseBeanList = applicationDAO.getRemoteColumnDetails(getDataBean);
			System.out.println("returnString in controller");
		} catch (Exception e) {
			Map<String, String> statusMap = new HashMap<String, String>();
			statusMap.put("failure", e.getMessage());
			return new ResponseEntity<Object>(statusMap, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Object>(getResponseBeanList, HttpStatus.OK);
	}

	// to get tableName from remoteData
	@RequestMapping(value = "/getRemoteDatatTableList/{sourceId}", method = RequestMethod.GET)
	public ResponseEntity<Object> getRemoteDatatTableList(@PathVariable("sourceId") String sourceId) {
		List<GetDataResponseBean> getResponseBeanList = new ArrayList<GetDataResponseBean>();
		try {

			RemoteDataDaoImpl removeDAOImpl = new RemoteDataDaoImpl();
			getResponseBeanList = removeDAOImpl.getUserTableList(Integer.parseInt(sourceId));
			System.out.println("returnString in controller");
		} catch (Exception e) {
			Map<String, String> statusMap = new HashMap<String, String>();
			statusMap.put("failure", e.getMessage());
			return new ResponseEntity<Object>(statusMap, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Object>(getResponseBeanList, HttpStatus.OK);
	}

	// to get table column Names
	@RequestMapping(value = "/getRemoteDatatTableColumnHeaders/{sourceId}/{tableName}", method = RequestMethod.GET)
	public ResponseEntity<Object> getRemoteDatatTableColumnHeaders(@PathVariable("sourceId") String sourceId, @PathVariable("tableName") String tableName) {
		List<GetDataResponseBean> getResponseBeanList = new ArrayList<GetDataResponseBean>();
		try {

			RemoteDataDaoImpl removeDAOImpl = new RemoteDataDaoImpl();
			getResponseBeanList = removeDAOImpl.getUserTableColumns(Integer.parseInt(sourceId), tableName);
			System.out.println("returnString in controller");
		} catch (Exception e) {
			Map<String, String> statusMap = new HashMap<String, String>();
			statusMap.put("failure", e.getMessage());
			return new ResponseEntity<Object>(statusMap, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Object>(getResponseBeanList, HttpStatus.OK);
	}




	// to add DbRead Details into metadata table
	@RequestMapping(value = "/addDbReadDetailsIntoMetaData", method = RequestMethod.POST)
	public ResponseEntity<Object> addDbReadDetailsIntoMetaData(@RequestBody String object) throws GenericDaoException {

		String keyValue = null;
		RemoteDataDaoImpl remoteDAOImpl = new RemoteDataDaoImpl();
		try {
			String sourceId = remoteDAOImpl.insertDataintoMetaDataTable(object);
			keyValue = "{\"keyValue\":" + "\"" + sourceId + "\"}";
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return new ResponseEntity<Object>(keyValue, HttpStatus.OK);
	}

	// to delete the Filter and Valiation processBox row Id (Generic Method)
	@RequestMapping(value = "/deleteRowId", method = RequestMethod.POST)
	public ResponseEntity<Object> deleteRowId(@RequestBody DeleteRecordPostBean deleteBean) {
		String message = "{\"message\":" + "\"success \"}";
		RemoteDataDaoImpl removeDAOImpl = new RemoteDataDaoImpl();
		try {
			removeDAOImpl.deleteRowId(deleteBean);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Object>("failure", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<Object>(message, HttpStatus.OK);
	}



	// get tree structure data for validation processbox
	@RequestMapping(value = "/getTreeformatData", method = RequestMethod.GET)
	public ResponseEntity<Object> getTreeStructureData() throws GenericDaoException {
		ApplicationDAO applicatioDao = new ApplicationDAO();

		Object obj = null;
		ArrayList<FunctionListParentBean> categoryFunctions = applicatioDao.getFunctionList();

		obj = categoryFunctions;
		return new ResponseEntity<Object>(obj, HttpStatus.OK);
	}

	// get tree structure data for Derived fileds and Transformation
	@RequestMapping(value = "/getTreeStructureforDerivedField", method = RequestMethod.GET)
	public ResponseEntity<Object> getTreeStructureforDerivedField() throws GenericDaoException {
		ApplicationDAO applicatioDao = new ApplicationDAO();
		Object obj = null;
		ArrayList<FunctionListParentBean> derivedFieldTreeStucture = applicatioDao.getDerivedFieldTreeStucture();
		obj = derivedFieldTreeStucture;
		return new ResponseEntity<Object>(obj, HttpStatus.OK);
	}
	
	@RequestMapping(value = "/setCurrentApplicationUser/{userName}", method = RequestMethod.GET)
	public ResponseEntity<Object> setCurrentApplicationUser(@PathVariable("userName") String userName) {		
		
		try {
			if(userName.contains("'"))
					{
				userName.replace("'", "");
					}		
		
			ApplicationConstants.setUserName(userName);
			
		
		} catch (Exception e) {
			
		System.out.println(e.getMessage());
		}
		return new ResponseEntity(new String("added"), HttpStatus.OK);
	}

	
	
	
	@RequestMapping(value = "/getsetupmenu", method = RequestMethod.GET)
	public List<MenuItems> getSetUpMenu() throws GenericDaoException {
		ApplicationDAO applicatioDao = new ApplicationDAO();
		MenuDetails menudetails = new MenuDetails();
		List<MenuItems> menuModels = new ArrayList<MenuItems>();
		menuModels = menudetails.getmenu("ccadmin");
		//menuModels = menudetails.getmenu(ApplicationConstants.getUserName());
		return menuModels;
		
	}
	
	
}