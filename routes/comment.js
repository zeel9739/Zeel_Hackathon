const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Comment = require("../models/comment")

router.post('/post/comment/:userid', (req, res, next) => {
    const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        user: req.params.userid,
        recipe: req.body.recipeid,
        comment: req.body.comment
    });
    comment
        .save()
        .then(docs => {
            const response = {
                message: 'handling post request in /comment',
                createdComment: docs
            }
            return res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/getonecomment/:commentId', (req, res, next) => {
    const id = req.params.commentId;
    Comment.findById(id)
        .select(' userid recipeid comment rating visibility ')
        .populate({
            path: 'user',
            populate: {path: 'avtid'}
            })
        .exec()
        .then(comment => {
            if (!comment) {
                return res.status(404).json({
                    message: "Comment not found"
                });
            }
            res.status(200).json({
                Comment: comment,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/comment"
                }
            });
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//without avatar
router.get("/getCommentRecipe/:recipeId", (req, res) => {
    Comment.find({ recipe: req.params.recipeId })
        .select('user recipe comment time')
        .populate('user', ['username'])
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

//with avatar
// router.get("/getCommentRecipe/:recipeId", (req, res) => {
//     Comment.find({ recipe: req.params.recipeId })
//     .select(' userid recipeid comment rating visibility ')
//     .populate({
//         path: 'user',
//         populate: {path: 'avtid'}
//         })
//     .exec()
//     .then(comment => {
//         if (!comment) {
//             return res.status(404).json({
//                 message: "Comment not found"
//             });
//         }
//         res.status(200).json({
//             Comment: comment,
//             request: {
//                 type: "GET",
//                 url: "http://localhost:3000/comment"
//             }
//         });
//     })
//     .catch(err => {
//         // console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });
// })

router.get("/get/Allcomment", (req, res) => {
    Comment.find()
        .select('user recipe comment time')
        .populate('user', ['username'])
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
})


router.delete('/delete/comment/:commentId', (req, res, next) => {
    const id = req.params.commentId;
    Comment.deleteOne({ _id: id })
        .exec()
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;