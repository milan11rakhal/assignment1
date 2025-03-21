const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("inventory", { session: req.session });
  });





router.get("/cart", (req, res) => {
  if (!req.session.user || req.session.user.role !== "customer") {
    return res.status(401).render("error", { message: "You are not authorized to view this page", session: req.session });
  }
  res.render("cart", { user: req.session.user, session: req.session });
});




  router.get("/list", (req, res) => {
    if (!req.session.user || req.session.user.role !== "dataEntryClerk") {
      return res.status(401).render("error", { message: "You are not authorized to view this page", session: req.session });
    }
    res.render("list", { user: req.session.user, session: req.session });
  });

  
  
module.exports = router;