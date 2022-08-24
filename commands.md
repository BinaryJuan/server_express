PORT=8080 pm2 start server.js --name="Fork Mode" --watch
PORT=8081 pm2 start server.js --name="Cluster Mode" --watch -i max