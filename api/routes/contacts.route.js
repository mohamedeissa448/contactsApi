const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Contact = require("../models/contact.model");
const checkAuth = require("../configuration/checkAuth");

router.post(
  "/addContact",
  [
    check("email")
      .isEmail()
      .withMessage("Email format is incorrect"),
    check("mobile")
      .isNumeric()
      .withMessage("mobile should only include numeric digits")
      .isLength({ min: 11 })
      .withMessage("mobile number should be 11 digits at least"),
    check("firstName")
      .notEmpty()
      .withMessage("first name should be provided")
      .isAlphanumeric()
      .withMessage("first name should include only letters and numbers"),
    check("lastName")
      .notEmpty()
      .withMessage("last name should be provided")
      .isAlphanumeric()
      .withMessage("last name should include only letters and numbers"),
    check("authorization")
      .notEmpty()
      .withMessage("authorization should be provided"),
    check("deviceToken")
      .notEmpty()
      .withMessage("deviceToken should be provided"),
    check("fingerPrint")
      .notEmpty()
      .withMessage("fingerPrint should be provided")
  ],
  checkAuth,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //check to see if there is already an account belongs to the same user with the same mobile provided in request body
    Contact.findOne({ mobile: req.body.mobile, userId: req.body.userId })
      .then(contact => {
        if (contact) {
          console.log(contact);
          res.status(422).json({
            message:
              "couldn't create a new contact  as it is already created with the same mobile number by the same user!"
          });
        } else {
          // create the account
          const newContact = new Contact({
            email: req.body.email,
            mobile: req.body.mobile,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userId: req.body.userId
          });
          newContact
            .save()
            .then(newContact => {
              res.status(200).json({
                message: "contact created",
                data: {
                  email: newContact.email,
                  relationId: "", //I didnot understand what relation ID should be
                  accountId: newContact._id,
                  userId: req.body.userId,
                  firstName: newContact.firstName,
                  lastName: newContact.lastName,
                  mobileNumber: newContact.mobile
                }
              });
            })
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));
  }
);

router.get("/getList", checkAuth, (req, res, next) => {
  Contact.find(
    { userId: req.body.userId },
    {
      updatedAt: 0,
      __v: 0
    }
  )
    .then(contacts => {
      res.status(200).json({
        message: "All user contacts",
        data: contacts
      });
    })
    .catch(err => next(err));
});

router.get("/getRecentList", checkAuth, (req, res, next) => {
  Contact.find(
    { userId: req.body.userId },
    {
      updatedAt: 0,
      __v: 0
    }
  )
    .sort({ createdAt: -1 })
    .limit(5)
    .then(contacts => {
      res.status(200).json({
        message: "last contacts created by the user at most 5 contacts",
        data: contacts
      });
    })
    .catch(err => next(err));
});

module.exports = router;
