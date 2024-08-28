const mongoose = require("mongoose");
require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

mongoose.set("strictQuery", true);

const main = async () => {
  await mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.p5atz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  );
  console.log("DB Conectado com sucesso!");
};

main().catch((err) => console.log(err));

module.exports = main;
