package com.cc.setup.data;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public class TestTimeStamp {

	
	
	
	public static void main(String[] args) {
		// TODO Auto-generated method stub

		String pattern = "yy-dd-MM";
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
		Timestamp dt_date = new Timestamp(System.currentTimeMillis());
	
		StringBuilder values = new StringBuilder();
		values.append("to_timestamp('" + dt_date+ "','yyyy-mm-dd hh24:mi:ss')");
		System.out.println("timeStamp:"+dt_date);
		
	}

}
