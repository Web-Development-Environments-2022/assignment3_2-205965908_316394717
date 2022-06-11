require("dotenv").config();
// #region express configures
const express = require("express");
const path = require("path");
const logger = require("morgan");
const session = require("client-sessions");
const DButils = require("./routes/utils/DButils");
const cors = require('cors');

const app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
app.use(
    session({
        cookieName: "session", // the cookie key name
        secret: process.env.COOKIE_SECRET || "my secret", // the encryption key
        duration: 24 * 60 * 60 * 1000, // expired after 20 sec
        activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration,
        cookie: {
            httpOnly: false,
        }
        //the session will be extended by activeDuration milliseconds
    })
);
app.use(express.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files
//local:
app.use(express.static(path.join(__dirname, "dist")));
//remote:
// app.use(express.static(path.join(__dirname, '../assignment-3-3-basic/dist')));
app.get("/", function (req, res) {
    //remote:
    // res.sendFile(path.join(__dirname, '../assignment-3-3-basic/dist/index.html'));
    //local:
    res.sendFile(__dirname + "/index.html");
});

const corsConfig = {
    origin: true,
    credentials: true
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
// #endregion


// cookie middleware
app.use(function (req, res, next) {
    if (req.session && req.session.user_id) {
        DButils.execQuery(`SELECT id FROM users WHERE id = ${req.session.user_id}`)
            .then((users) => {
                if (users.length == 1) {
                    req.user_id = req.session.user_id;
                }
                next();
            })
            .catch((error) => next());
    } else {
        next();
    }
});

// ----> For checking that our server is alive
app.get("/alive", (req, res) => res.send("I'm alive"));

// Routing
const user = require("./routes/user");
app.use("/users", user);
const recipes = require("./routes/recipes");
app.use("/recipes", recipes);
const auth = require("./routes/auth");
app.use(auth);

// Default router
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).send({message: err.message, success: false});
});

const port = process.env.PORT || "80";
const server = app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
});

process.on("SIGINT", function () {
    if (server) {
        server.close(() => console.log("server closed"));
    }
    process.exit();
});
