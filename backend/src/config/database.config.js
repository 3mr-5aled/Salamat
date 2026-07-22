const mongoose = require("mongoose");

const dbConnection = () => {
  const dbUri = process.env.db_uri;

  if (!dbUri) {
    console.error(
      "❌ Database Connection Error: Environment variable 'db_uri' is undefined.\n" +
        "Please make sure your environment configuration (e.g., config.env) is set up correctly with a valid MongoDB connection string.\n" +
        "Refer to QUICKSTART.md or README.md for setup instructions."
    );
    process.exit(1);
  }

  mongoose
    .connect(dbUri)
    .then((conn) => {
      console.log(`Database Connected: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.error(`Database Error: ${err}`);
      console.warn("⚠️ Warning: Express server is running but database is disconnected.");
    });
};

module.exports = dbConnection;
