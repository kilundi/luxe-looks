{
  "apps": [
    {
      "name": "luxe-admin",
      "script": "server.js",
      "cwd": "admin",
      "instances": 1,
      "exec_mode": "fork",
      "watch": false,
      "max_memory_restart": "500M",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3001
      },
      "env_development": {
        "NODE_ENV": "development",
        "PORT": 3001
      },
      "error_file": "logs/error.log",
      "out_file": "logs/out.log",
      "time": true,
      "autorestart": true,
      "max_restarts": 10,
      "min_uptime": "10s"
    }
  ]
}
