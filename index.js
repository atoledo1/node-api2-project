require('dotenv').config();

const express = require("express");

const postsRouter = require("./routers/router.js");

const server = express();

const port = process.env.PORT || 8000;
server.use(express.json());

server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send(`
        <h1>API</h>
       
    `);
});

server.listen(8000, () => {
  console.log(`server on http://localhost:8000`);
});
