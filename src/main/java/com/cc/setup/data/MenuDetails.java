package com.cc.setup.data;

import java.util.ArrayList;
import java.util.List;

import com.cc.setup.bean.MenuItems;

public class MenuDetails {

	public List<MenuItems> getmenu(String userName) {

		MenuDetailsExecution menuDetailsExecution = new MenuDetailsExecution();
		List<MenuItems> menuModels = new ArrayList<MenuItems>();
		//menuModels = menuDetailsExecution.getMenuList();
		
		menuModels = menuDetailsExecution.getMenuList(userName);
		return menuModels;
	}

}
