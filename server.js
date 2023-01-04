const { randomUUID } = require('crypto');
const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const { validate: uuidValidate } = require('uuid');

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({urlencoded:false}))
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const port = 3000;

class User {
    constructor(username, firstName, lastName, email, age) {
        this.username   = username,
        this.firstName  = firstName,
        this.lastName   = lastName,
        this.email      = email,
        this.age        = age,
        this.id         = uuidv4(); 
    }
    toFormatedUser() {
        return {
            "Username"  : this.username,
            "Name"      : `${this.firstName} ${this.lastName}`,
            "Email"     : this.email,
            "Age"       : this.age
        }
    }
    validateUserId() {
        return uuidValidate(this.id);
    }
    inputFormated(){
        return {
            "Username"   : [this.username, "text"],
            "First Name" : [this.firstName, "text"],
            "Last Name"  : [this.lastName, "text"],
            "Email"      : [this.email, "email"],
            "Age"        : [this.age, "number"]
        }
    }
}
function getUserSpotByID(inputID) {
    let i = 0;
    for(let iter of userDatabase){
        if(iter.id == inputID)
            return i;
        i++;
    }
    return false;
}

userDatabase = [new User('Dr.Defaulto', 'John', 'Smith', 'email@gmail.com', '42')];

app.get('/', (req, res) => {
    res.redirect('/home')
});
app.post('/add-User', (req, res) => {
    const username  = req.body.username;
    const firstName = req.body.firstName;
    const lastName  = req.body.lastName;
    const email     = req.body.email;
    const age       = req.body.age;
    const newUser   = new User(username, firstName, lastName, email, age);
    userDatabase.push(newUser);
    res.redirect(`/user/${newUser.id}`);
});

app.post('/update-user/:id', (req, res) => {
    const id = req.params.id;
    const username  = req.body["Username"];
    const firstName = req.body["First Name"];
    const lastName  = req.body["Last Name"];
    const email     = req.body["Email"];
    const age       = req.body["Age"];
    if(getUserSpotByID(id) !== false){
        let chosenUser = userDatabase[getUserSpotByID(id)];
        chosenUser["username"]  = username;
        chosenUser["firstName"] = firstName;
        chosenUser["lastName"]  = lastName;
        chosenUser["email"]     = email;
        chosenUser["age"]       = age;
        userDatabase[getUserSpotByID(id)] = chosenUser;
    }
    res.redirect(`/home`);
});
app.post('/delete-user/:id', (req, res) => {
    const id = req.params.id;
    if(getUserSpotByID(id) !== false){
        userDatabase.splice(getUserSpotByID(id), 1);
    }
    res.redirect('/home');
})
app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    if(getUserSpotByID(id) === false){
        res.redirect('/home');
    } else {
        const chosenUser = userDatabase[getUserSpotByID(id)];
        res.render('user.pug', {
            user: chosenUser.inputFormated(),
            chosenUser
        });
    }
});
app.get('/create-User', (req, res) => {
    res.render('new-User.pug', {
    });
});
app.get('/home', (req, res) => {
    let formatedUsers = [];
    for(let iter of userDatabase){
        formatedUsers.push(iter.toFormatedUser())
    }
    res.render('all-Users.pug', {
        users: formatedUsers,
        userDatabase
    });
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
