import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sequelize", "oracledb", "mysql2"],
};

export default nextConfig;
