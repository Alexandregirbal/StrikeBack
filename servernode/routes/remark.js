const express = require('express');
const router = express.Router();
let User = require('../models/user.model');
const Remark = require('../models/remark.model');
const Answer = require('../models/answer.model');
const Notification = require('../models/notification.model');
const Report = require('../models/report.model');
let AuthToken = require('../models/authToken.model');
var uuid = require('uuid'); //je sais pas trop ce que c'est

////GET REQUESTS

//http://localhost:5000/remarks/?id=5e500b859febd9351c7bdac2
router.get('/', (req, res, next) => {
    Remark.findOne({
        _id: req.query.id
    })
        .then((remark) => res.status(200).json(remark))
        .catch(err => res.status(400).json('Error:' + err))
});

router.get('/find', (req, res, next) => {
    Remark.find({ $text: { $search: req.query.search } })
        .then((remarks) => res.status(200).json(remarks))
        .catch(err => res.status(400).json('Error:' + err))
});


router.get('/count', (req, res, next) => {
    Remark.countDocuments()
        .then((total) => {
            res.status(200).json(total)
        })
        .catch(err => res.status(400).json('Error:' + err))
});

//http://localhost:5000/remarks/findByUserId?token=5e500b859febd9351c7bdac2
router.get('/findByUserId', (req, res, next) => {
    AuthToken.findById(req.query.token)
        .then((token) => {
            Remark.find({
                userId: token.userId
            })
                .then((remarks) => res.status(200).json(remarks))
                .catch(err => res.status(400).json('Error:' + err))
        })
        .catch(err => {
            res.status(401).json('Authentication Error: ' + err)
        })
});

//http://localhost:5000/remarks/sorted/date?order=1&skip=0&number=4
router.get('/sorted/date', (req, res, next) => {
    const order = req.query.order; // -1 ou 1
    const skip = req.query.skip; // nombre de remarks renvoyes
    const number = req.query.number; // num de page a renvoyer

    Remark.find(
        {})
        .sort({ 'date': order })
        .skip(skip * 1)
        .limit(number * 1)
        .then((remarks) => res.status(200).json(remarks))
        .catch(err => res.status(400).json('Error:' + err))
});

//http://localhost:5000/remarks/sorted/heard?order=1&skip=0&number=4
router.get('/sorted/heard', (req, res, next) => {
    const order = req.query.order; // -1 ou 1
    const skip = req.query.skip; // nombre de remarks renvoyes
    const number = req.query.number; // num de page a renvoyer

    Remark.find(
        {})
        .sort({ 'heard': order })
        .skip(skip * 1)
        .limit(number * 1)
        .then((remarks) => res.status(200).json(remarks))
        .catch(err => res.status(400).json('Error:' + err))
});

////POST REQUESTS

//http://localhost:5000/remarks/add
router.route('/add').post((req, res) => {

    AuthToken.findById(req.query.token)
        .then((token) => {
            const userId = token.userId;
            const title = req.body.title;
            const text = req.body.text;
            const image = req.body.image;
            const newRemark = new Remark({ userId, title, text, image })
            newRemark.save()
                .then((rem) => res.status(200).send(rem._id)) //attention pas en json
                .catch(err => {
                    res.status(400).json('Error: ' + err)
                })
        })
        .catch(err => {
            res.status(401).json('Authentication Error: ' + err)
        })

});

////PUT REQUESTS

//
router.put('/heard', (req, res, next) => {
    AuthToken.findById(req.query.token)
        .then((token) => {
            // User.findById(token.userId)
            // .then(
            // )
            User.findOneAndUpdate(
                { _id: token.userId },
                { $push: { heards: req.query.id } },
                { useFindAndModify: false })
                .then(
                    Remark.findOneAndUpdate(
                        {
                            _id: req.query.id
                        },
                        {
                            $inc: { heard: 1 }
                        },
                        { useFindAndModify: false } //to avoid deprecation warning
                    )
                        .then(() => res.status(200).json('Remark heard one more time.'))
                        .catch(err => res.status(400).json('Error:' + err))
                )
        })
        .catch(err => {
            res.status(401).json('Authentication Error: ' + err)
        })
});

router.put('/heard/decrement', (req, res, next) => {
    AuthToken.findById(req.query.token)
        .then((token) => {
            User.findOneAndUpdate(
                { _id: token.userId },
                { $pull: { heards: req.query.id } },
                { useFindAndModify: false })
                .then(
                    Remark.findOneAndUpdate(
                        {
                            _id: req.query.id
                        },
                        {
                            $inc: { heard: -1 }
                        },
                        { useFindAndModify: false } //to avoid deprecation warning
                    )
                        .then(() => res.status(200).json('Remark heard one less time.'))
                        .catch(err => res.status(400).json('Error:' + err))
                )
        })
});

//http://localhost:5000/remarks/image
router.put('/image', (req, res, next) => {
    AuthToken.findById(req.query.token)
        .then((token) => {
            const url = req.body.url
            const remarkId = req.body.id
            Remark.findOneAndUpdate(
                {
                    _id: remarkId,
                    userId: token.userId
                }, {
                $set: {
                    image: url
                }
            },
                { useFindAndModify: false } //to avoid deprecation warning
            )
                .then(() => res.status(200).json('Image updated'))
                .catch(err => res.status(400).json('Error:' + err))
        })
        .catch(err => {
            res.status(401).json('Authentication Error: ' + err)
        })

});


////DELETE REQUESTS

//http://localhost:5000/remarks/delete?id=5e57d25f4b249c3a740985dd
router.delete('/delete', (req, res, next) => {
    var message = ''
    AuthToken.findById(req.query.token)
        .then((token) => {
            User.findById(token.userId)
                .then((user) => {
                    if (user.admin) {
                        //delete the remark
                        Remark.findOneAndDelete({
                            _id: req.query.id
                        })
                            .then(() => {
                                message = message + "The remark has been deleted. "
                                //delete answers linked to this remark
                                Answer.deleteMany({
                                    remarkId: req.query.id
                                })
                                    .then((answers) => {
                                        message = message + "Answers associated with the remark have been deleted. "
                                        //delete notifications linked to this remark
                                        Notification.findOneAndDelete({
                                            postId: req.query.id
                                        })
                                            .then(() => {
                                                message = message + "The notification associated with the remark has been deleted."
                                                //delete notifications linked to this remark
                                                Report.findOneAndDelete({
                                                    postId: req.query.id
                                                })
                                                    .then(() => {
                                                        message = message + "The report associated with the remark has been deleted."
                                                        res.status(200).json({ message: message, numberAnswersDeleted: answers.deletedCount })
                                                    })
                                                    .catch(err => res.status(400).json('Error:' + err))
                                            })
                                            .catch(err => res.status(400).json('Error:' + err))
                                    })
                                    .catch(err => res.status(400).json('Error:' + err))

                            })
                            .catch(err => res.status(400).json('Error:' + err))
                    } else {
                        res.status(403).json('Permission Error:' + err)
                    }
                }).catch(err => res.status(401).json('Token Error:' + err))
        }).catch(err => { res.status(401).json('Authentication Error: ' + err) })
});

module.exports = router;