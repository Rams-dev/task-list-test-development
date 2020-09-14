const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helpers = require('../helpers/helpers');
const pool = require('../databaseConnection');



passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    if(email.length === 0 || password.lenght === 0){
       return done(null, false, req.flash('error_msg','Please, fill all the inputs'));
    }else{
        const rows = await pool.query('SELECT * FROM users WHERE email = ?',[email]);
            if(rows.length > 0) {
                const user = rows[0];
                // const validPassword = await helpers.matchPassword(password, user.password);
                //  if(validPassword){
                    done(null, user, req.flash('success_msg','welcome ' + user.name))
                // }else{
                //     done(null, false, req.flash('error_msg','Incorrect Password!'));
                // }
            }else{
                return done(null, false, req.flash('error_msg','The Email does not exist'));
            }
    }
}));

passport.serializeUser((user, done) =>{
    done(null,user.id);
});

passport.deserializeUser(async (id,done) =>{
    const rows = await pool.query('SELECT * FROM users WHERE id= ?',[id]);
    done(null,rows[0]);
})