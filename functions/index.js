const functions = require("firebase-functions");
const admin = require("firebase-admin");
const mysql = require("mysql");
 
admin.initializeApp();
 
// Configure the MySQL connection
const mysqlConfig = {
  host: "sql6.freemysqlhosting.net",
  user: "sql6701017",
  password: "gcre8xBzUu",
  database: "sql6701017",
};
 
const connection = mysql.createConnection(mysqlConfig);
 
// Function triggered when a Firestore document is updated
exports.updateMySQLOnFirestoreUpdate = functions.firestore
    .document("user/{docId}")
    .onUpdate((change, context) => {
      const newData = change.after.data();
 
      console.log(newData);
 
      // Extract data you want to update in MySQL
      const { count, username } = newData;
 
      // MySQL query to update corresponding row
      const sqlQuery = "UPDATE user SET count = ?,WHERE username = ?";
 
      const values = [count ?? '', username];
 
      // Execute the MySQL query
      connection.query(sqlQuery, values, (error, results, fields) => {
        if (error) {
          console.error('Error updating MySQL:', error);
          throw new Error('Error updating MySQL');
        }
        console.log('MySQL update successful:', results.affectedRows, 'rows affected');
      });
 
      // Don't forget to close the MySQL connection
      // connection.end();
 
      return null; // Cloud Functions should return a value or Promise
    });