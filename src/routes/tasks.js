const express = require('express');
const router = express.Router();
const pool = require('../databaseConnection');
const {isLoggedIn} = require('../lib/auth');

router.get('/task/all-task', isLoggedIn, async (req,res) =>{
    const tasks = await pool.query('SELECT * FROM users INNER JOIN tasks ON  users.id = tasks.id_person order by' + pool.escapeId('tasks.id'));
    console.log(tasks)
    res.render('tasks/all-task',{tasks});

})

router.get('/task/add', isLoggedIn, async (req,res) =>{
    if(req.user != null){
    const query = await pool.query('SELECT * FROM users');
    res.render('tasks/add-task',{query});
    }else{
        res.redirect('/signin');
    }
})

router.post('/task/add', isLoggedIn, async (req,res) =>{
    const {title, description, person} = req.body;
    const completed = false;
    if(title.lengt == 0 || description.length== 0 || person.length == 0){
        var error_msg= 'fill all inputs';
        res.render('tasks/add-task',{error_msg, title,description, person});
    }else{
        const query = await pool.query('INSERT INTO tasks set ?', [{title, description, id_person: person, completed}]);
        if(query){
            req.flash('success_msg', 'Task add successfully');
             res.redirect('/task/all-task');
        }else{
            req.flash('success_msg', 'Error! try later');
            res.redirect('/task/add');
        }
    }
})

router.get('/task/edit/:id', isLoggedIn, async (req,res) =>{
    const {id} = req.params;
    const tasks = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.render('tasks/edit-task',{tasks});
})

router.post('/task/edit/:id',isLoggedIn, async (req,res) =>{
    const {id} = req.params;
    const {title, description, person} = req.body;
    const task = await pool.query('UPDATE tasks set ? WHERE id=?',[{title,description,id_person: person}, id]);
    req.flash('success_msg','Task edit successfully!');
    res.redirect('/task/all-task');
})

router.get('/task/delete/:id', isLoggedIn, async (req,res) => {
    const {id} = req.params;
    const taskDelete = await pool.query('DELETE FROM tasks where id = ?', [id]);
    req.flash('success_msg', 'Task delete successfully!');
    res.redirect('/task/all-task');

})

router.get('/task/finish/:id', isLoggedIn, async (req,res) =>{
    const {id} =  req.params;
    console.log(id);
    const finishTask = await pool.query('UPDATE tasks set ? WHERE id=?',[{completed:1}, id])
    if(finishTask){
        req.flash('success_msg','Congratulations you finished you task');
    }else{
        req.flash('error_msg','Error');
    }

    res.redirect('/task/all-task');
})

module.exports = router;