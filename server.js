const express = require("express");
const app = express();
const controllers = require("./controllers");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const db = require("./models");

const authRequired = require("./middleware/authRequired");

const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(
	session({
		store: new MongoStore({
			url: process.env.MONGODB_URI || "mongodb://localhost:27017/store",
		}),
		secret: "Secret",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
		},
	})
);

app.get("/", function (req, res) {
	const didCreateUser = false;
	console.log("Created User bool", didCreateUser);
	res.render("User/index", { didCreateUser: didCreateUser });
});

app.get("/homepage", function (req, res) {
	db.User.findById(req.session.currentUser.id)
		.populate("stores")
		.populate("lists")
		.exec(function (err, foundUser) {
			if (err) {
				console.log(err);
				res.send({ Message: "Internal Server Error" });
			} else {
				const context = {
					user: foundUser,
					stores: foundUser.stores,
					lists: foundUser.lists,
				};
				console.log(context);
				res.render("index", context);
			}
		});
});

app.use("/", controllers.auth);
app.use("/store", authRequired, controllers.store);
app.use("/product", authRequired, controllers.product);

app.listen(PORT, function () {
	console.log("Express up and running...");
});
