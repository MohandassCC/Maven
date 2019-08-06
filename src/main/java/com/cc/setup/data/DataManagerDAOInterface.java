package com.cc.setup.data;

import java.util.List;

import com.cc.setup.common.GenericDaoException;

public interface DataManagerDAOInterface {
	public List<GetDataResponseBean> getDetails(GetDataBean webServiceGet) throws GenericDaoException;
	public PostDataBean saveData(PostDataBean webServicePostInput) throws GenericDaoException;	
}
