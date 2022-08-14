// Inject environment variables
const passport = require("passport");
const initialize = require("./passport");
const path = require("path");
require("dotenv").config({ path: __dirname + "/../.env" });
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const flash = require("express-flash");

const PORT = process.env.PORT || 4000; // use either the host env var port (PORT) provided by Heroku or the local port (5000) on your machine

// Express App
const app = express();

app.enable("trust proxy");

// Session
app.use(
  session({
    cookie: {
      secure: true,
      maxAge: 1209600000,
    },
    // store: new RedisStore({ client: client }),
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

//middleware

initialize(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors({ origin: true, credentials: true })); //allow cross-origin resource sharing FROM origin ONLY, and accept credentials
app.use(express.static("."));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isAuthenticated = function (req, res, next) {
  if (req.user) return next();
  else
    return res.status(401).json({
      error: "User not authenticated",
    });
};

//routes
const logout = require("./routes/logout");
app.use("/api/logout", logout);

const login = require("./routes/login");
app.use("/api/login", login);

const dashboard = require("./routes/dashboard");
app.use("/api/dashboard", isAuthenticated, dashboard);

const tickets = require("./routes/tickets");
app.use("/api/tickets", isAuthenticated, tickets);

const project = require("./routes/project");
app.use("/api/project", isAuthenticated, project);

// configure and start
if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/client/build"));
}
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`server has started on port ${process.env.PORT || PORT}`);
});
