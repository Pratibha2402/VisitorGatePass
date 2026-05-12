// import  oracledb from "oracledb";

// function getDbConfig() {
//   const user = process.env.DB_USER ?? process.env.ORACLE_USER;
//   const password = process.env.DB_PASSWORD ?? process.env.ORACLE_PASSWORD;
//   const connectString =
//     process.env.DB_CONNECT ?? process.env.ORACLE_CONNECTION_STRING;
//       console.log("DB Config:", { user, connectString: connectString ? "****" : null });
//         if (!user || !password || !connectString) {
//     throw new Error(
//       "Missing Oracle DB config. Set DB_USER/DB_PASSWORD/DB_CONNECT or ORACLE_USER/ORACLE_PASSWORD/ORACLE_CONNECTION_STRING.",
//     );
//   }

//   return { user, password, connectString };
// }

// export async function getConnection() {
//   return oracledb.getConnection(getDbConfig());
// }

import { Sequelize } from "sequelize";
import oracledb from "oracledb";
import mysql2 from "mysql2";

let dialectModule = null;
if (process.env.DB_DIALECT === "oracle") {
  dialectModule = oracledb;
} else if (process.env.DB_DIALECT === "mysql") {
  dialectModule = mysql2;
}

export const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectModule: dialectModule,
    logging: false, // to:do revert in poduction
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const sequelize_misc = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER_MISC,
  process.env.DB_PASS_MISC,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "oracle",
    dialectModule: oracledb,
    logging: false, // to:do revert in poduction
  }
);
