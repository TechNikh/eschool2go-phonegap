var app = {};
app.db = null;
// app.insertVideoRecord(entries[i].name, filePathWithoutExt, fileExt);
app.insertVideoRecord = function(name, path, extension) {
  app.db.transaction(function(tx) {
    tx.executeSql(
        "INSERT INTO cache_video_files(name, path, extension) VALUES (?,?,?)",
        [ name, path, extension ], app.onSuccess, app.onError);
  });
}

app.insertImageRecord = function(name, path, extension) {
  app.db.transaction(function(tx) {
    tx.executeSql(
        "INSERT INTO cache_image_files(name, path, extension) VALUES (?,?,?)",
        [ name, path, extension ], app.onSuccess, app.onError);
  });
}
// app.insertYAMLrecord(fileEntry.name, filePathWithoutExt, fileExt, doc.title);
app.insertYAMLrecord = function(name, path, extension, type, offline_file,
    displayName, description) {
  var path_array = path.split("/");
  path_array.shift();
  var unified_path = path_array.join('/');
  app.db
      .transaction(function(tx) {
        tx
            .executeSql(
                "INSERT INTO cache_yaml_files(name, path, unified_path, extension, type, offline_file, display_name, description) VALUES (?,?,?,?,?,?,?,?)",
                [ name, path, unified_path, extension, type, offline_file,
                    displayName, description ], app.onSuccess, app.onError);
      });
}

app.prepareCacheTables = function() {
  // Drop table
  app.db.transaction(function(tx) {
    tx.executeSql("DROP TABLE IF EXISTS cache_video_files", app.onSuccess,
        app.onError);
  });
  // Create table
  app.db
      .transaction(function(tx) {
        tx
            .executeSql(
                'CREATE TABLE IF NOT EXISTS cache_video_files (id integer primary key, name text, path text, extension text)',
                app.onSuccess, app.onError);
      });

  // Drop table
  app.db.transaction(function(tx) {
    tx.executeSql("DROP TABLE IF EXISTS cache_image_files", app.onSuccess,
        app.onError);
  });
  // Create table
  app.db
      .transaction(function(tx) {
        tx
            .executeSql(
                'CREATE TABLE IF NOT EXISTS cache_image_files (id integer primary key, name text, path text, extension text)',
                app.onSuccess, app.onError);
      });

  // Drop table
  app.db.transaction(function(tx) {
    tx.executeSql("DROP TABLE IF EXISTS cache_yaml_files", app.onSuccess,
        app.onError);
  });
  // Create table
  /*
   * type: video/article
   */
  app.db
      .transaction(function(tx) {
        tx
            .executeSql(
                'CREATE TABLE IF NOT EXISTS cache_yaml_files (id integer primary key, name text, path text, unified_path text, extension text, type text, offline_file text, display_name text, description text)',
                app.onSuccess, app.onError);
      });
}

app.onSuccess = function(tx, r) {
  // console.log("Your SQLite query was successful!");
  $.mobile.loading('hide');	
}

app.onSuccessWithCallback = function(tx, r,callback) {
  // console.log("Your SQLite query was successful!");
  callback();
  $.mobile.loading('hide');	
}

app.onError = function(tx, e) {

  console.log("SQLite Error: " + JSON.stringify(e));
  // SQLite Error: {"rows":{"length":0},"rowsAffected":0}
  if (e.message) {
    navigator.notification.alert("SQLite Error: " + e.message);
  }
}

app.insertDiscussionPoints = function(title,question,callback){
	//Create Discussion table if already not exists
	$.mobile.loading('show');
	app.db
      .transaction(function(tx) {
        tx
            .executeSql(
                'CREATE TABLE IF NOT EXISTS discussion_points (Id integer primary key AUTOINCREMENT, Discussion_Point text,Discussion_Title_Point text,Answer text)',
                app.privateInsertDiscussionPoints(title,question,callback), app.onError);
      });
}

app.privateInsertDiscussionPoints = function(title,question,callback){
	app.db.transaction(function(tx) {
		tx.executeSql(
			"INSERT INTO discussion_points (Discussion_Title_Point,Discussion_Point) VALUES (?,?)",
			[title,question], function(transaction, result){app.onSuccessWithCallback(transaction,result,callback);}, app.onError);
	  });
}

app.updateDiscussionAnswer = function(id,answer){
	app.db.transaction(function(tx) {
		tx.executeSql(
			"UPDATE discussion_points SET  Answer = ? WHERE Id = ?",
			[answer,id], app.onSuccess, app.onError);
	  });
}

