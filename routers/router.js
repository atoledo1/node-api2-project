const express = require("express");

const Posts = require("../data/db");

const router = express.Router();

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (title === "" || contents === "" || title === null || contents === null) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post",
    });
  } else
    Posts.insert(req.body)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
});

router.post("/:id/comments", (req, res) => {
  if (!req.params.id) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else if (req.body === "") {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    Posts.insertComment(req.body)
      .then((post) => {
        res.status(201).json(req.body);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: "There was an error while saving the comment to the database",
        });
      });
  }
});

router.get("/", (req, res) => {
  Posts.find(req.body)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Posts.findById(id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  Posts.findPostComments(id)
    .then((post) => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Posts.remove(id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const post = req.body;
  const { id } = req.params;
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    Posts.update(id, post)
      .then((updated) => {
        if (updated) {
          res.status(200).json(updated);
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ error: "The post information could not be modified" });
      });
  }
});

module.exports = router;
