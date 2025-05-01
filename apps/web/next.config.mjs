import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheHandler: path.resolve("node_modules/@chrono-cache/next/dist/index.js"),
};

export default nextConfig;
