const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');
const session =require('express-session');
const flash = require('connect-flash');
const passport = require('passport');




//inicializaciones
const app = express();
require('./lib/passport');


//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname:'.hbs'
}))
app.set('view engine', '.hbs');

//MIDDLEWARES   
app.use(morgan('dev'));

app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//variables globales
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    let user = null;
    if(req.user){
        user=JSON.parse(JSON.stringify(req.user))
    }
    res.locals.user = user;
    next();
})

//Routes
app.use(require('./routes/tasks'));
app.use(require('./routes/users'));
app.use(require('./routes/index'));

//public 
app.get(express.static(path.join(__dirname, 'public')));


//listen
app.listen(app.get('port'),()=>{
    console.log('servidor iniciado en el puerto', app.get('port'));
});
