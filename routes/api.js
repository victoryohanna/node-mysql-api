const express = require("express");

const db = require("../database/db");
const router = express.Router();

//Create Publisher
router.post("/publisher", (req, res) => {
  db.query(
    "SELECT * FROM publishers WHERE email = ?",
    [req.body.email],
    (err, result) => {
      if (err) {
        throw JSON.stringify(err, undefined, 2);
      } else {
        if (result.length > 0) {
          res.status(401).send("User already exist");
        } else {
          // Save Publisher
          let user = req.body;
          let sql =
            "INSERT INTO publishers (publisherId, publisherName, email, \
                            phoneNumber, address, password) VALUES (?, ?, ?, ?, ?, ?)";
          db.query(sql, [
            user.publisherId,
            user.publisherName,
            user.email,
            user.phoneNumber,
            user.address,
            user.password,
          ]);
          res.status(200).send("Saved Successfully");
        }
      }
    }
  );
});

//Add distributor
router.post("/distributor", (req, res) => {
  db.query(
    "SELECT * FROM distributors WHERE email = ?",
    [req.body.email],
    (err, result) => {
      if (err) {
        throw JSON.stringify(err, undefined, 2);
      } else {
        //check if distributor exist
        if (result.length > 0) {
          //If distributor details found then save distributorID, Emai and Publisher ID to Credentials table

          sqlSelect =
            "SELECT * FROM credentials WHERE distributorId = ? && publisherId = ?";

          db.query(
            sqlSelect,
            [req.body.distributorId, req.body.publisherId],
            (err, data) => {
              if (data.length > 0) {
                res.status(401).send("Distributor already exist");
              } else {
                let sqlInsert =
                  "INSERT INTO credentials (distributorId, publisherId) \
                                    VALUES (?,?)";
                let user = req.body;
                db.query(sqlInsert, [user.distributorId, user.publisherId]);
                res.status(200).send("Saved Successfully to Credentials");
              }
            }
          );
        } else {
          //Add new record to distributors table

          let user = req.body;
          let sqlInsert =
            "INSERT INTO distributors (distributorId, firstName, LastName, \
                                email, phoneNumber, address, publisherId) VALUES (?,?,?,?,?,?,?)";
          db.query(sqlInsert, [
            user.distributorId,
            user.firstName,
            user.lastName,
            user.email,
            user.phoneNumber,
            user.address,
            user.publisherId,
          ]);

          res.status(200).send("Saved to Distributors Table");
        }
      }
    }
  );
});

//Retrieve all distributors registerred to a particular publisher
router.get("/distributors", (req, res) => {
  // let item = [];
  let sqlr = "SELECT * FROM credentials WHERE publisherId = ?";
  db.query(sqlr, [req.body.publisherId], (err, result) => {
    if (result) {
      res.send(result);
    } else {
      throw JSON.stringify(err, undefined, 2);
    }
  });
});

//Retrieve single distributor record registerred to a particular publisher

router.get("/distributor", (req, res) => {
  let user = req.body;
  let item = "";
  let sqlr =
    "SELECT * FROM distributors WHERE distributorId = ? && publisherId = ?";
  let sqlr2 =
    "SELECT * FROM credentials WHERE distributorId = ? && publisherId = ?";
  let sqlr3 =
    "SELECT firstName, lastName, email, phoneNumber, address FROM distributors WHERE distributorId = ? ";
  db.query(sqlr, [user.distributorId, user.publisherId], (err, result) => {
    if (result.length > 0) {
      res.status(200).send(result);
    } else {
      db.query(
        sqlr2,
        [req.body.distributorId, req.body.publisherId],
        (err, reslt) => {
          if (reslt) {
            //iterate array to get the object properties
            reslt.forEach((items) => {
              item = items;
              // use object property as key to get distributor details in distributors table
              db.query(sqlr3, [item.distributorId], (err, result) => {
                if (result) {
                  res.status(200).send(result);
                } else {
                  res.status(401).send("Record not found");
                }
              });
            });
          } else {
            res.status(401).send("Record not found");
          }
        }
      );
    }
  });
});

//Login user
router.post("/login", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE username = ? && password = ? ",
    [req.body.username, req.body.password],
    (err, result) => {
      if (err) {
        //console.log(err);
        throw JSON.stringify(err, undefined, 2);
      } else {
        if (result.length === 0) {
          res.status(401).send("Invalid username or password");
        } else {
          res.status(200).send(result);
        }
      }
    }
  );
});

//Retrieve single record by id
router.get("/user/:id", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        throw JSON.stringify(err, undefined, 2);
      } else {
        if (result.length === 0) {
          res.status(401).send("User not found");
        } else {
          res.status(200).send(result);
        }
      }
    }
  );
});

//Update record
router.put("/update", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [req.body.email],
    (err, result) => {
      if (err) {
        throw JSON.stringify(err, undefined, 2);
      } else {
        if (result.length === 0) {
          res.status(401).send("Record not found");
        } else {
          // Save user details to database
          let user = req.body;
          let sql =
            "UPDATE users SET name=?, email=?, phone=?, username=?, password=? WHERE email = 'vic@mailbox.com' ";
          db.query(sql, [
            user.name,
            user.email,
            user.phone,
            user.username,
            user.password,
          ]);
          res.status(200).send("Record Successfully updated");
        }
      }
    }
  );
});
module.exports = router;
