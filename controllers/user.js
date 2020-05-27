const router = require('express').Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('./../models/user');
//const anotherModel=new User();

 router.use(bodyParser.json());                  //midsetup
router.use(bodyParser.urlencoded({ extended: true }));

//routers here

//default route
router.all(
    '/',
    function (req, res) {
        return res.json({
            status: true,
            message: 'User controller working....'
        });
    }
);

//new user router
router.post(
    '/register',
    [
        //check fields are not empty
        check('username').not().isEmpty().trim().escape(),
        check('password').not().isEmpty().trim().escape(),
        check('email').isEmail().normalizeEmail()

    ],
    function (req, res) {
        //check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: 'Form Validation error..',
                errors: errors.array()
            });
        }

        // hash password code
        const hashedPassword = bcrypt.hashSync(req.body.password);

        //crete new use model
        var temp = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        //insert data into databse
        temp.save(function (error, result) {
            //check error
            if (error) {
                return res.json({
                    status: false,
                    message: 'DB Inserrt Fail...',
                    error: error
                });
            }
            //if ok
            return res.json({
                status: true,
                message: 'DB Insert Success...',
                result: result
            });
        });


       
    }
);


// find user document route

router.get(
    '/find',
    // *** if find according to condition**** '/find/:email', in browser /find/shubh@gamil.com
    function (req, res) {
        //find user document
        User.find(function (error, result) {
            // **** User.find({email:req.params.email},function(error,result){ 
            // **** User.find({email:req.params.email},{password:0}*projection*,function(error,result){ 
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


//update documert
router.put(
    '/update/:email',
    function (req, res) {
        if (req.params.email) //check email is empty or not
        {
            User.update(
                { email: req.params.email },
                {$set:{username:req.body.username}},
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

        }else{
            return res.json({
                status:false,
                message:'Email not provided......'
            });
        }
    }
    
);

//delete
router.delete(
    '/delete/:email',
    function(req,res){
        if (req.params.email) //check email is empty or not
        {
            User.remove(
                { email: req.params.email },
               
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

        }else{
            return res.json({
                status:false,
                message:'Email not provided......'
            });
        }
    }
);



//login route for user
router.post(
    '/login',
    [
         //check fields are not empty
        
         check('password').not().isEmpty().trim().escape(),
         check('email').isEmail().normalizeEmail()
    ],
    function(req,res){
         //check validation errors
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
             return res.status(422).json({
                 status: false,
                 message: 'Form Validation error..',
                 errors: errors.array()
             });
         }

         //check mail exists or not
         User.findOne(
            {email:req.body.email},
            function(error,result){
                if (error) {
                    return res.json({
                        status: false,
                        message: 'DB Read Fail....',
                        error: error
                    });
                }
                //result empty or not
                if(result){
                    //when result variable contain document
                    //match password
                    const isMatch=bcrypt.compareSync(req.body.password,result.password);
                    //check pass is match
                    if(isMatch){
                        //pass matched
                        return res.json({
                            status:true,
                            message:'User exists. Login Success....',
                            result:result
                        });
                    }else{
                        //pass is not matched
                        return res.json({
                            status:false,
                            message:'Password not matched..... Login Fail....'
                            
                        });
                    }
                }else{
                    //userr document don't exists
                        return res.json({
                            status:false,
                            message:'User don\'t exists...',
                           
                        });
                }
            }

         );
    }
);

module.exports = router; 
                   