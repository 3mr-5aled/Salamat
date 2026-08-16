const mongoose = require("mongoose");

const dbConnection = () => {
  const dbUri = process.env.db_uri;

  if (!dbUri) {
    console.error(
      "❌ Database Connection Error: Environment variable 'db_uri' is undefined.\n" +
        "Please make sure your environment configuration (e.g., config.env) is set up correctly with a valid MongoDB connection string.\n" +
        "Refer to QUICKSTART.md or README.md for setup instructions."
    );
    console.warn("⚠️ Warning: db_uri is not defined. Database queries will return 503 error.");
    return;
  }

  const dbName = process.env.dbname || "Salamat";

  mongoose
    .connect(dbUri, { dbName })
    .then((conn) => {
      console.log(`Database Connected: ${conn.connection.host} [Database: ${conn.connection.name}]`);
    })
    .catch((err) => {
      console.error(`Database Error: ${err}`);
      console.warn("⚠️ Warning: Express server is running but database is disconnected.");
    });
};

module.exports = dbConnection;
