const express = require("express"); // Import Express framework for HTTP server
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for JWT operations

const JWT_SECRET = "RIVU1234"; // Secret key for signing/verifying JWT tokens

const app = express(); // Create Express app instance
app.use(express.json()); // Middleware to parse JSON request bodies

const users = []; // In-memory array to store user data

app.get("/", function (req, res) { // Serve static HTML file at root
    res.sendFile(__dirname + "/public/index.html"); // Send index.html from public folder
})

app.post("/signup", function (req, res) { // Signup endpoint
    const username = req.body.username; // Get username from request body
    const password = req.body.password; // Get password from request body

    users.push({ // Add new user to users array
        username: username, // Store username
        password: password  // Store password (plain text, not secure)
    })

    res.json({
        message: "You are signed in " // Respond with signup confirmation
    })

})

app.post("/signin", function (req, res) { // Signin endpoint
    const username = req.body.username; // Get username from request body
    const password = req.body.password; // Get password from request body

    let foundUser = null; // Variable to store found user

    for (let i = 0; i < users.length; i++) { // Loop through users array
        if (users[i].username === username && users[i].password === password) { // Check for matching username and password
            foundUser = users[i] // Assign found user
        }
    }
    if (foundUser) { // If user is found
        const token = jwt.sign({ // Create JWT token with username as payload
            username
        }, JWT_SECRET)
        res.json({
            token: token // Respond with JWT token
        })
    } else {
        res.json({
            message: "Credentials are wrong!" // Respond with error
        })
    }
})

function auth(req, res, next) { // Middleware to protect routes
    const token = req.headers.token; // Get token from headers
    const decodedData = jwt.verify(token, JWT_SECRET); // Verify and decode token
    if (decodedData.username) { // If username exists in token
        req.username = decodedData.username; // Attach username to request
        next() // Continue to next middleware/handler
    } else {
        res.json({
            message: "Your are not logged in " // Respond if not authenticated
        })
    }
}

app.get("/me", auth, function (req, res) { // Protected route to get user info

    let foundUser = null; // Variable to store found user

    for (let i = 0; i < users.length; i++) { // Loop through users array
        if (users[i].username === req.username) { // Find user by username
            foundUser = users[i]
        }
    }
    res.json({
        username: foundUser.username, // Respond with username
        password: foundUser.password  // Respond with password (not secure)
    })

})

app.listen(3000); // Start HTTP server on port 3000
