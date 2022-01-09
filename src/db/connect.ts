import config from "config";
import mongoose from "mongoose";
import log from "../logger";

const connect = () => {
  const dbUri = config.get("dbUri") as string;

  return mongoose
    .connect(dbUri)
    .then(() => {
      log.info("Database connected");
    })
    .catch((error) => {
      log.error("Db error", error);
      // process.exit(1);
    });
};

export default connect;
