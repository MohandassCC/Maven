package com.cc.setup.folderandlist;


public class FolderListView {
/*
	public Object getListView(String folderId) {
		Object allObjects = null;
		Object getObject = null;
		Object getObject1 = null;
		Object getObject2 = null;
		Object getObject3 = null;
		Map<String, Object> finalList = new HashMap<String, Object>();
		List<FileEntity> fileEntities = new ArrayList<FileEntity>();
		FileDaoOracle fileDaoOracle = new FileDaoOracle();
		try {
			fileEntities = fileDaoOracle.getFileEntity(folderId, "0");
			getObject = fileEntities.toArray();
		} catch (Exception e) {
			// TODO: handle exception

		}

		List<FtpEntity> ftpEntities = new ArrayList<FtpEntity>();
		try {
			FtpDaoOracle ftpDaoOracle = new FtpDaoOracle();
			ftpEntities = ftpDaoOracle.getFtpEntity(folderId, "0");
			getObject1 = ftpEntities.toArray();
		} catch (Exception e) {
			

		}

		List<ExternalDb> externalDbs = new ArrayList<ExternalDb>();
		ExternalDbOracle externalDbOracle = new ExternalDbOracle();
		try {
			externalDbs = externalDbOracle.getExternalDbList(folderId, "0");
			getObject2 = externalDbs.toArray();
		} catch (Exception e2) {
			

		}

		List<TaskEntity> taskEntities = new ArrayList<TaskEntity>();
		TaskDaoOracle taskDaoOracle = new TaskDaoOracle();
		try {
			taskEntities = taskDaoOracle.getTaskEntity(folderId, "0");
			getObject3 = taskEntities.toArray();
		} catch (Exception e) {
			

		}

		 List<ExportEntity> exportEntities = new ArrayList<ExportEntity>(); ExportDaoOracle
		 * exportDaoOracle = new ExportDaoOracle(); try { exportEntities =
		 * exportDaoOracle.getExportEntity(folderId, "0"); getObject4 = taskEntities.toArray(); }
		 * catch (Exception e) { 
		 * 
		 * } 

		finalList.put("fileList", getObject);
		finalList.put("ftpList", getObject1);
		finalList.put("externalDbList", getObject2);
		finalList.put("otherList", getObject3);
		allObjects = finalList;

		return allObjects;
	}*/
}
