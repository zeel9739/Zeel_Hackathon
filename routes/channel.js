const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const Channel = require('../models/channel');

router.post('/signup/channel', (req, res, next) => {
    Channel.find({ email: req.body.email })
        .exec()
        .then(channel => {
            if (channel.length >= 1) {
                return res.status(409).json({
                    message: 'this channel email id is already exists...'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const channel = new Channel({
                            _id: new mongoose.Types.ObjectId(),
                            channelname: req.body.channelname,
                            email: req.body.email,
                            password: hash
                        });
                        channel
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'Channel created'
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

router.post('/signin/channel', (req, res, next) => {
    Channel.find({ email: req.body.email })
        .exec()
        .then(channel => {
            if (channel.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, channel[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: channel[0].email,
                            channelId: channel[0]._id
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


router.patch("/update/channel", (req, res) => {
    //update quary
    Channel.updateOne({ _id: req.body._id }, req.body)
        .then(result => {
            res.status(200).json(result);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        })
})

router.get('/get/channel', (req, res, next) => {
    Channel.find()
        //TODO set limit
        // .select('channelname email')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                channels: docs
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

router.post('/post/resetPassword/channel', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        User.find({ $and: [{ _id: req.body._id }, { password: hash }] })
            .then(result => {
                if (result == null) {
                    //return not valid old password
                }
                else {
                    User.updateOne({ _id: req.body._id }, { password: req.body.newPassword }).then(
                        res.send(200).json({ message })
                    )
                }
            }).catch(err => {
                // console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    })

})

router.get('/get/bychannelname/:channelname', (req, res, next) => {
    const regex = new RegExp(req.params.channelname);
    Channel.findOne({ channelname: regex })
        .select('channelname email')

        //TODO
        .populate("recipe_ids avtid")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                channel: docs
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

router.get('/getchannel/byid/:channelId', (req, res, next) => {
    const id = req.params.channelId;
    Channel.findById({ _id: id })
        // .select('rname ulink desc steps ingre ctime visibility playlist Rpic time')
        // .populate('ingre playlist', 'name')
        .exec()
        .then(docs => {
            const response = {
                channel: docs
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

router.delete('/delete/channel/:channelId', (req, res, next) => {
    Channel.deleteOne({ _id: req.params.channelId })
        .exec()
        .then(result => {
            return res.status(200).json({
                message: 'channel deleted'
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