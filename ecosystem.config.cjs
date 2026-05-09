module.exports = {
  apps: [
    {
      name: 'mybeautyshop',
      script: 'node',
      args: 'dist/index.js',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
