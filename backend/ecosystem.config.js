module.exports = {
  apps: [
    {
      name: "backend",
      script: "./server.js",
      watch: false,
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    }
  ]
};
