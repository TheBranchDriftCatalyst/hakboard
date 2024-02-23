import BrowserSyncPlugin from "browser-sync-webpack-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          {key: "Access-Control-Allow-Credentials", value: "true"},
          {key: "Access-Control-Allow-Origin", value: "*"}, // replace this your actual origin
          {key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT"},
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
          },
        ]
      }
    ]
  },
  webpack: (config, {dev, isServer}) => {
    const serverSideOrProd = isServer || !dev
    if (!serverSideOrProd)
      config.plugins.push(
        new BrowserSyncPlugin(
          {
            host: '0.0.0.0',
            port: 4000,
            open: false,
            proxy: 'http://localhost:3000/',
          },
          {
            reload: false,
            injectChanges: false,
            ws: true,
          },
        ),
      )

    return config
  },
};

export default nextConfig;
