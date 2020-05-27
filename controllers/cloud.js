const router = require('express').Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const Cloud = require('./../models/cloud'); //Cloud Model
var AWS = require('aws-sdk');
//router.use(bodyParser.json());                  //midsetup
//router.use(bodyParser.urlencoded({ extended: true }));

//default router to check cloud controller working
router.all(
    '/',
    function (req, res) {
        return res.json({
            status: true,
            message: 'Cloud controller working....'
        });
    }
);

//add cloud router 

var awsfile3; var temp;
router.post(
    '/addcloud/:userid',
    [
        //check fields are not empty
        check('cloudnickname').not().isEmpty().trim().escape(),
        check('cloudtype').not().isEmpty().trim().escape(),
        check('accessKeyId').not().isEmpty().trim().escape(),
        check('secretAccessKey').not().isEmpty().trim().escape(),
    ],
    function (req, res) {

        if (req.params.userid) {
            //check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    status: false,
                    message: 'Form Validation error..',
                    errors: errors.array()
                });
            }
            awsfile3 = { "accessKeyId": req.body.accessKeyId, "secretAccessKey": req.body.secretAccessKey }
            AWS.config.update(awsfile3);

            //api for aws security token service

            var sts = new AWS.STS({ apiVersion: '2011-06-15' });

            sts.getCallerIdentity(function (err, data) {
                if (err);
                else {
                    var Account_No = (data.Account);
                    var Arnarray = data.Arn.split("/");
                }

                //got account id and account name of the above AWS API

                temp = new Cloud({
                    userid: req.params.userid,
                    cloudnickname: req.body.cloudnickname,
                    cloudtype: req.body.cloudtype,
                    accessKeyId: req.body.accessKeyId,
                    secretAccessKey: req.body.secretAccessKey,
                    accountid: Account_No,
                    accountname: Arnarray[1],

                });

                //save cloud data in Cloud schema

                temp.save(function (error, result) {
                    //check error
                    if (error) {
                        return res.json({
                            status: false,
                            message: 'Cloud Account Fail',
                            error: error
                        });
                    }
                    //if ok
                    return res.json({
                        status: true,
                        message: 'Cloud Account Added Successfully',
                        result: result
                    });
                });
            });
        }
        else {
            return res.json({
                status: false,
                message: 'User id not provided......'
            });
        }
    }
);

//Get current users cloud data by userid.
router.get('/find/:userid', function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Cloud.find({ userid: req.params.userid })
        // ..and populate all of the notes associated with it
        .populate("userid")
        .then(function (result) {
            // If we were able to successfully find an cloud with the given id, send it back to the client
            res.json(result);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

//Get cloud data by cloudnickname

router.get(
    '/findCloud/:cloudnickname',

    function (req, res) {

        Cloud.findOne({ cloudnickname: req.params.cloudnickname }, function (error, result) {

            if (error) {
                return res.json({
                    status: false,
                    message: 'DB Find Fail.....',
                    error: error
                });
            }//if ok
            return res.json({
                status: true,
                message: 'DB Find Success.....',
                result: result
            });
        });
    }
);

//delete cloud account
router.delete(
    '/deleteCloud/:id',
    function (req, res) {
        if (req.params.id) //check id is empty or not
        {
            Cloud.deleteOne(
                {
                    _id: req.params.id,
                },

                function (error, result) {
                    if (error) {
                        return res.json({
                            status: false,
                            message: 'DB Delete Fail....',
                            error: error
                        });
                    }
                    return res.json({
                        status: true,
                        message: 'DB Delete Success..',
                        result: result
                    });
                }
            );

        } else {
            return res.json({
                status: false,
                message: 'cloudnickname not provided......'
            });
        }
    }
);

//update cloud account
router.put(
    '/updateCloud/:id',
    function (req, res) {
        if (req.params.id) //check id is empty or not
        {
            Cloud.findByIdAndUpdate(
                req.params.id,
                // {$set: req.body},
                { $set: { cloudnickname: req.body.cloudnickname, accessKeyId: req.body.accessKeyId, secretAccessKey: req.body.secretAccessKey } },


                function (error, result) {

                    if (error) {
                        return res.json({
                            status: false,
                            message: 'DB Update Fail....',
                            error: error
                        });
                    }//if ok
                    return res.json({
                        status: true,
                        message: 'DB Update Success..',
                        result: result
                    });
                }
            );

        } else {
            return res.json({
                status: false,
                message: 'Id not provided......'
            });
        }
    }

);
module.exports = router; 