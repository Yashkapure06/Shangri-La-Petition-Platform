const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://yashkapure06:hu9kC5mavcEu8Vva@cluster0.7tdsg.mongodb.net/";

const connectToMongo = async (retryCount) => {
  const MAX_RETRIES = 3;
  const count = retryCount ?? 0;
  try {
    await mongoose.connect(mongoURI, { dbName: "shangri-la-petition" });
    console.info("Connected to Mongo Successfully");

    return;
  } catch (error) {
    console.error(error);

    const nextRetryCount = count + 1;

    if (nextRetryCount >= MAX_RETRIES) {
      throw new Error("Unable to connect to Mongo!");
    }

    console.info(`Retrying, retry count: ${nextRetryCount}`);

    return await connectToMongo(nextRetryCount);
  }
};

module.exports = connectToMongo;
