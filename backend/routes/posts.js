const express = require('express');
const multer = require('multer');

const router = express.Router();
const Post = require("../models/post");

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let err = new Error("Invalid Mime Type");
        if (isValid) {
            err = null;
        }
        cb(err, "backend/images");
    },
    filename: (req, file, cb) => {
        let temp = file.originalname.toLocaleLowerCase();
        console.log(temp[0]);
        temp = temp + '';
        const name = temp.split(" ").join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + "." + ext);
    }
});

router.post("", multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post Added sucessfully',
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    });
});

router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        console.log(result);
        res.status(200).json({ message: "Update Sucessful" })
    });
});

router.get('', (req, res, next) => {
    Post.find().then(documents => {
        console.log(documents);
        res.status(200).json({
            message: 'fetched sucessfully',
            posts: documents
        });
    });
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(400).json({ message: 'Post Not Found!' });
        }
    });
});

// ":" is a dynamic path segment 
router.delete('/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        console.log(req.params.id);
        res.status(200).json({ message: "Post Deleted!" });
    });
});

module.exports = router;