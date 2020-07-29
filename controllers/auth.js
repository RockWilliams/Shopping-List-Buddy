const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const db = require("../models");

router.get("/register", function (req, res) {
	const didCreateUser = false;
	res.render("User/register");
});

router.post("/register", async function (req, res) {
	try {
		const foundUser = await db.User.findOne({
			email: req.body.email,
		});
		if (foundUser) {
			return await res.send({ message: "Account is already registered" });
		}
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(req.body.password, salt);
		req.body.password = await hash;
		const newUser = await db.User.create(req.body);
		const didCreateUser = await true;
		res.render("User/index", { didCreateUser: didCreateUser });
	} catch (err) {
		res.send({ message: "Internal Server Error", error: err });
	}
});

router.get("/login", function (req, res) {
	res.render("User/login");
});

router.post("/login", async function (req, res) {
	try {
		const foundUser = await db.User.findOne({ email: req.body.email });
		if (!foundUser) {
			return res.send({ message: "Password or Email incorrect" });
		}
		const match = await bcrypt.compare(
			req.body.password,
			foundUser.password
		);
		if (!match) {
			return res.send({ message: "Password or Email incorrect" });
		}
		req.session.currentUser = {
			id: foundUser._id,
			username: foundUser.username,
		};
		res.redirect("/homepage");
	} catch (err) {
		console.log(err);
		res.send({ message: "Internal Server Error", error: err });
	}
});

router.delete("/logout", async function (req, res) {
	await req.session.destroy();
	res.redirect("/");
});

module.exports = router;
