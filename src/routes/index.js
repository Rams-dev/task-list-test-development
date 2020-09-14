const express= require('express');
const pool = require('../databaseConnection');
const router = express.Router();
const helpers = require('../helpers/helpers');
const passport = require('passport');

router.get('/',(req,res)=>{
    res.render('index');
})

router.get('/signin', (req, res) =>{
    res.render('signin')
})

router.post('/signin',  (req, res, next)=>{
    passport.authenticate('local.signin',{
        successRedirect: '/task/all-task',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/signup',(req, res) =>{
    res.render('signup');
})

router.post('/signup', async (req,res) =>{
    const { name, email, password, workgroup } = req.body;
    
    if(name.length == 0){
        const error_msg = 'Please, fill all imputs';
        res.render('signup',{
             error_msg,name, email, workgroup
        });
    }else{
        // const pass = await helpers.encryptPassword(password);
        const checkEmailExist = await pool.query('SELECT * FROM users WHERE email = ?',[email]);
        if(checkEmailExist.length > 0){
            req.flash('error_msg', 'The Email already exist,')
            res.redirect('/signup');
        }else{
            const sql = await pool.query('INSERT INTO users set ? ',[{name,email, password, workgroup}]);
            if(sql){
                req.flash('success_msg', 'welcome'+ name)
                res.redirect("/signin")
            }else{
                res.render("/signup",);
            }
        }
    }
})


router.get('/logout',(req,res) =>{
    req.logOut();
    res.redirect('/signin')
})

module.exports = router;