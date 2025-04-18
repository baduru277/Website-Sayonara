const mongoose = require("mongoose");

const connectDatabase = () => {
  const dbURI = process.env.DB_URI || "mongodb://127.0.0.1:27017/sayonara";
  // console.log("Connecting to database:", dbURI);

  mongoose
    .connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
      // Further debug output
      if (err.name === 'MongoNetworkError') {
        console.error("MongoNetworkError: Network issues, MongoDB server might not be running.");
      } else if (err.name === 'MongooseServerSelectionError') {
        console.error("MongooseServerSelectionError: Cannot reach MongoDB server.");
      }
    });
};

module.exports = connectDatabase;
