package com.cc.setup.util;

import java.util.HashMap;
import java.util.Map;

import com.cc.setup.bean.AdmGroup;
import com.cc.setup.bean.AdmModule;

public class ApplicationVariables {
	public static Map<String, Class> tableClassMap = getTableClassMap();
	
public  static Map<String, Class> getTableClassMap()
{
	tableClassMap=new HashMap<String, Class>();
	tableClassMap.put("ADM_MODULES", AdmModule.class);
	tableClassMap.put("ADM_GROUPS", AdmGroup.class);
	return tableClassMap;
	
}
}
