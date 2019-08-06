package com.cc.setup.data;

public interface DataManagerDAOInterfaceFactory {
	DataManagerDAOInterface getDAOInterface(String daoClass);
}
