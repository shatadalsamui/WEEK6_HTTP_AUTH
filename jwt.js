const express = require("express"); /*import the express library*/

const jwt = require ("jsonwebtoken"); /*import the jsonwebtoken library*/

const app = express(); /*create an instance of the express library*/

const JWT_TOKEN = "USER_APP";

app.use(express.json());
const users = [];
app.post("/signup",function (req , res){
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username:username,
        password:password
    })
    res.json({
        message : "You are signed up "
    })

    console.log(users)
})

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        const token = jwt.sign({
            username: user.username
        }, JWT_TOKEN);

        user.token = token;
        res.send({
            token
        })
        console.log(users);
    } else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
});


app.get("/me", (req, res) => {
    const token = req.headers.authorization;
    const userDetails = jwt.verify(token, JWT_TOKEN);

    const username =  userDetails.username;
    const user = users.find(user => user.username === username);

    if (user) {
        res.send({
            username: user.username
        })
    } else {
        res.status(401).send({
            message: "Unauthorized"
        })
    }
})
app.listen(3000);// the http server is listening on port 3000