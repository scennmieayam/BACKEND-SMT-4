const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const db = require('./db')

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: false}))

//read
app.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if(err) throw err
        res.render('index', {users: results})
    })
})

//create
app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/add', (req, res) => {
    const { name, email } = req.body
    db.query('insert into users set ?', {name, email}, (err, result) => {
        if (err) throw err
        res.redirect('/')
    })
})

//update
app.get('/edit/:id', (req, res) => {
    const id = req.params.id
    db.query('select * from users where id = ?', [id], (err, results) => {
        if (err) throw err
        res.render('edit', {user: results[0]})
    })
})

app.post('/edit/:id', (req, res) => {
    const {name, email} = req.body
    const id = req.params.id
    db.query('update users set name = ?, email = ? where id = ?', [name, email, id], (err) => {
        if(err) throw err
        res.redirect('/')
    })
})

//delete
app.get('/delete/:id', (req, res) => {
    const id = req.params.id
    db.query('delete from users where id = ?', [id], (err) => {
        if(err) throw err
        res.redirect('/')
    })
})

app.listen(port, () => console.log(`Server running at http://localhost:${port}`))