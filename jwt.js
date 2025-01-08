const express = require("express"); // Import the Express framework for building web servers

const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library for JWT operations

const app = express(); // Create an Express application instance

const JWT_TOKEN = "USER_APP"; // Secret key used to sign and verify JWT tokens

app.use(express.json()); // Middleware to parse incoming JSON request bodies
const users = []; // In-memory array to store user objects (username & password)

app.post("/signup", function (req, res) { // Route to handle user signup
    const username = req.body.username; // Extract username from request body
    const password = req.body.password; // Extract password from request body

    users.push({ // Add new user to users array
        username: username, // Store username
        password: password  // Store password (plain text, not secure for production)
    })
    res.json({
        message: "You are signed up " // Respond with signup confirmation
    })
    console.log(users) // Log current users array to console
})

app.post("/signin", (req, res) => { // Route to handle user signin
    const username = req.body.username; // Extract username from request body
    const password = req.body.password; // Extract password from request body

    // Find user with matching username and password
    const user = users.find(user => user.username === username && user.password === password);

    if (user) { // If user exists
        const token = jwt.sign({ // Create JWT token with username as payload
            username: user.username
        }, JWT_TOKEN); // Sign token with secret key

        user.token = token; // Optionally store token with user (not required for stateless JWT)
        res.send({
            token // Respond with JWT token
        })
        console.log(users); // Log users array
    } else {
        res.status(403).send({ // If credentials invalid, send 403 Forbidden
            message: "Invalid username or password"
        })
    }
});

app.get("/me", (req, res) => { // Route to get current user info (protected route)
    const token = req.headers.authorization; // Get JWT token from Authorization header
    const userDetails = jwt.verify(token, JWT_TOKEN); // Verify token and decode payload

    const username = userDetails.username; // Extract username from token payload
    // Find user in users array by username
    const user = users.find(user => user.username === username);

    if (user) { // If user exists
        res.send({
            username: user.username // Respond with username
        })
    } else {
        res.status(401).send({ // If user not found, send 401 Unauthorized
            message: "Unauthorized"
        })
    }
})

app.listen(3000); // Start the HTTP server on port 3000
