package com.cc.setup.property;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import com.cc.setup.common.GenericDaoException;
import com.google.gson.Gson;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCursor;
import com.mongodb.Mongo;

public class GetPropertyDetails {
	public static PropertyCollection propertyCollection = getPropertyDetails();

	private static PropertyCollection getPropertyDetails() {
		if (propertyCollection == null) {
			DBCursor cursor = null;
			//PropertyCollection propertyCollection = new PropertyCollection();
			BasicDBObject whereQuery = new BasicDBObject();
			try {
				cursor = getMongoData(whereQuery, "Properties");
				while (cursor.hasNext()) {
					String jsonString = com.mongodb.util.JSON.serialize(cursor.next());
					Gson gson = new Gson();
					propertyCollection = gson.fromJson(jsonString, PropertyCollection.class);
				}

			} catch (Exception e) {
				e.printStackTrace();
			}
			
		}
		return propertyCollection;
	}
	
	public static Properties getMongoProperties(){
		Properties property = new Properties();
		try {
			ClassLoader loader = Thread.currentThread().getContextClassLoader();
			InputStream stream = loader.getResourceAsStream("ConnectionDetails.properties");
			property.load(stream);
		} catch (IOException e) {
			e.printStackTrace();

		}
		return property;
	}

	public static DBCursor getMongoData(BasicDBObject query, String collection) throws GenericDaoException {
		Properties property = getMongoProperties();
		String type = "";
		DBCursor cursor = null;
		Mongo mongo = null;
		try {

			mongo = new Mongo(property.getProperty("mongourl"), Integer.parseInt(property.get("mongoport").toString()));
			DB db = mongo.getDB(property.getProperty("mongodbname"));
			cursor = db.getCollection(collection).find(query);
		} catch (Exception e) {

		} finally {

			mongo = null;
			query = null;
			collection = null;
		}
		return cursor;
	}

	public static void main(String args[]) {
		GetPropertyDetails getPropertyDetails = new GetPropertyDetails();
		PropertyCollection propertyCollection = GetPropertyDetails.propertyCollection;
		System.out.println("completed");
	}
}
