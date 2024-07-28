const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup/user', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'this email id is already exists...'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                })
            }
        })
});

router.post('/signin/user', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Auth failed'
                })
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
})


router.post("/update/user", (req, res) => {
    console.log(req)
    console.log(req.body)
    //update quary
    User.updateOne({ _id: req.body._id }, req.body)
        .then(result => {
            res.status(200).json(result);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        })
})

router.get('/get/user', (req, res, next) => {
    User.find()
        //TODO set limit
        .select('username email')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs
            }
            res.status(200).json(response);
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.post('/post/resetPassword/:userid', (req, res, next) => {
    // bcrypt.hash(req.body.password, 10, (err, hash) => {
    User.findOne({ _id: req.params.userid })
        .then(result => {
            bcrypt.compare(req.body.password, result.password, (err, result) => {
                console.log(err)
                if (err) {
                    //return not valid old password\
                    res.status(301).json({
                        error: "old password is wrong!!"
                    });
                }
                else if (result) {
                    bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
                        if (err) res.status(500).json({ err: "internal server err" })
                        User.updateOne({ _id: req.params.userid }, { password: hash })
                            .then(
                                res.status(200).json({ message: "password is reset" })
                            )
                            .catch(err => {
                                console.log(err);
                                res.status(501).json({
                                    error: err
                                });
                            })
                    })
                }
                else {
                    res.status(301).json({
                        error: "old password is wrong!!", err
                    });
                }
            })

        }).catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.get('/get/byusername/:username', (req, res, next) => {
    const regex = new RegExp(req.params.username);
    User.findOne({ username: regex })
        .select("username email -_id")
        .exec()
        .then(docs => {
            const response = {
                user: docs
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

router.get('/getuser/byid/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.findById({ _id: id })
        // .select('rname ulink desc steps ingre ctime visibility playlist Rpic time')
        // .populate('ingre playlist', 'name')
        .exec()
        .then(docs => {
            const response = {
                user: docs
            }
            return res.status(200).json(response);
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/delete/user/:userId', (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(result => {
            return res.status(200).json({
                message: 'user deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        });
})

module.exports = router;