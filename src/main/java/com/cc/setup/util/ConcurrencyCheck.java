package com.cc.setup.util;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.cc.setup.common.GenericDaoException;
import com.cc.setup.data.DataBaseInteraction;

public class ConcurrencyCheck {

	public DataBaseInteraction dataBaseInteraction = new DataBaseInteraction();
	
	public String checkForConcurrentUpdate(String entity, String idName, Integer idValue, String lastModifiedString) throws GenericDaoException {
		String returnLastModified = null;
		
		try {
			Connection connection = dataBaseInteraction.getConnection();
			Statement stmt = connection.createStatement();
			
			Timestamp lastModifiedFromDbList = null;
			Timestamp lastModified = null;
			String queryLastModified = "select lastModified from " + entity + " where " + idName + " = " + idValue;
		
			ResultSet rs=stmt.executeQuery(queryLastModified);
			Timestamp lastModifiedFromDb=null;
			while(rs.next()){
				lastModifiedFromDb = rs.getTimestamp("LASTMODIFIED");
			}
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			
			Date parsedDate = dateFormat.parse(lastModifiedFromDb.toString());
			lastModifiedFromDbList = new java.sql.Timestamp(parsedDate.getTime());
			
			System.out.println("lastModifiedFromDbList:"+lastModifiedFromDbList);
			
			Date parsedDate1 = dateFormat.parse(lastModifiedString);
			lastModified = new java.sql.Timestamp(parsedDate1.getTime());
			
			System.out.println("lastModified:"+lastModified);
			
			long diff = lastModifiedFromDbList.getTime() - lastModified.getTime();
			if (diff != 0) {
				returnLastModified = "Data changed since last retrieval. Kindly refresh and then do the changes";
			}
			System.out.println("diff:"+diff);
		} catch (Exception e) {
			try {
				throw new GenericDaoException(e.getMessage());
			} catch (Exception e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}  
		return returnLastModified;
	}
	
	
public static void main(String[] args) throws GenericDaoException {
	
	ConcurrencyCheck chk=new ConcurrencyCheck();
	      try {
			chk.checkForConcurrentUpdate("REMOVEDUPLICATES", "REMOVEDUPID",15, "2018-09-26 14:22:04.172531");
		} catch (GenericDaoException e) {
			throw new GenericDaoException(e.getMessage());
		}
	
	
}
}
