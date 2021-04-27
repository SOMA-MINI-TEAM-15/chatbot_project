module.exports = {
  apps: [
    {
      name: 'server',
      script: 'build/server.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      watch: ['build'],
      ignore_watch: ['node_modules', 'src/logs'],
      watch_delay: 1000,
    },
  ],
};
