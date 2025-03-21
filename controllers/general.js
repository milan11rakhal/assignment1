const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
    res.render("home", { session: req.session });
  });



  router.get("/sign-up", (req, res) => {
    res.render("sign-up", { session: req.session });
  });

  router.post("/sign-up", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render("sign-up", { error: "Email already in use", session: req.session });
      }
      const user = new User({ firstName, lastName, email, password });
      await user.save();
      res.redirect("/welcome");
    } catch (err) {
      res.render("sign-up", { error: "Registration failed", session: req.session });
    }
  });
  


  router.get("/log-in", (req, res) => {
    res.render("log-in", { session: req.session });
  });
  
  router.post("/log-in", async (req, res) => {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render("log-in", { error: "Invalid email or password", session: req.session });
    }
    req.session.user = { id: user._id, firstName: user.firstName, role: user.role };
    if (role === "dataEntryClerk") res.redirect("/inventory/list");
    else res.redirect("/cart");
  });


  
  router.get("/welcome", (req, res) => {
    res.render("welcome", { session: req.session });
  });
  

  
  router.get("/cart", (req, res) => {
    if (!req.session.user || req.session.user.role !== "customer") {
      return res.status(401).render("error", { message: "You are not authorized to view this page", session: req.session });
    }
    res.render("cart", { user: req.session.user, session: req.session });
  });
  
  router.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/log-in"));
  });
module.exports = router;