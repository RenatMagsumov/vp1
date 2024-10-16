const express = require("express");
const dtEt = require("./dateTime.js");
const fs = require("fs");
const dbInfo = require("../vp1_confiq.js");
const mysql = require("mysql2");
const bodyparser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

const conn = mysql.createConnection({
  host: dbInfo.confiqdata.host,
  user: dbInfo.confiqdata.user,
  password: dbInfo.confiqdata.passWord,
  database: dbInfo.confiqdata.dataBase,
});


app.get("/timenow", (req, res) => {
  const weekDays = dtEt.dayEt();
  const dateNow = dtEt.dateEt();
  const timeNow = dtEt.timeEt();
  res.render("timenow", { nowWD: weekDays, nowD: dateNow, nowT: timeNow });
});


app.get("/justlist", (req, res) => {
  let folkWisdom = [];
  fs.readFile("public/textfiles/vanasonad.txt", "utf8", (err, data) => {
    if (err) {
      throw err;
    } else {
      folkWisdom = data.split(";");
      res.render("justlist", { h2: "vanasõnad", listData: folkWisdom });
    }
  });
});


app.get("/reqvisit", (req, res) => {
  res.render("regvisit");
});


app.post("/reqvisit", (req, res) => {
  const wkDays = dtEt.dayEt();
  const dateNow = dtEt.dateEt();
  const timeNow = dtEt.timeEt();
  console.log(req.body);
  fs.open("public/textfiles/visitlog.txt", "a", (err, file) => {
    if (err) {
      throw err;
    } else {
      fs.appendFile(
        "public/textfiles/visitlog.txt",
        req.body.firstNameInput +
          " " +
          req.body.lastNameInput +
          " ( " +
          wkDays +
          " " +
          dateNow +
          " kell " +
          timeNow +
          " )" +
          ";",
        (err) => {
          if (err) {
            throw err;
          } else {
            console.log("Lisatud");
            res.render("regvisit");
          }
        }
      );
    }
  });
});


app.get("/visitlog", (req, res) => {
  let visits = [];
  fs.readFile("public/textfiles/visitlog.txt", "utf8", (err, data) => {
    if (err) {
      throw err;
    } else {
      visits = data.split(";");
      res.render("visitlog", { h3: "külastus", listData: visits });
    }
  });
});


app.get("/visitlogdb", (req, res) => {
  let sqlReq = "SELECT first_name, last_name, visit_time FROM vp1_visitlog";
  let visits = [];
  conn.query(sqlReq, (err, sqlRes) => {
    if (err) {
      throw err;
    } else {
      visits = sqlRes;
      res.render("visitlogdb", { visits: visits });
    }
  });
});


app.get("/regvisitdb", (req, res) => {
  let notice = "";
  let firstName = "";
  let lastName = "";
  res.render("regvisitdb", {
    notice: notice,
    firstName: firstName,
    lastName: lastName,
  });
});


app.post("/regvisitdb", (req, res) => {
  let notice = "";
  let firstName = "";
  let lastName = "";
  if (!req.body.firstNameInput || !req.body.lastNameInput) {
    notice = "Andmed sisestamata";
    lastName = req.body.lastNameInput;
    firstName = req.body.firstNameInput;
    res.render("regvisitdb", {
      notice: notice,
      firstName: firstName,
      lastName: lastName,
    });
  } else {
    let sqlreq = "INSERT INTO vp1_visitlog (first_name, last_name) VALUES(?,?)";
    conn.query(
      sqlreq,
      [req.body.firstNameInput, req.body.lastNameInput],
      (err, sqlres) => {
        if (err) {
          throw err;
        } else {
          notice = "Andmed lisatud andmebaasi";
          console.log("Andmed lisatud");
          res.render("regvisitdb", {
            notice: notice,
            firstName: firstName,
            lastName: lastName,
          });
        }
      }
    );
  }
});


app.get("/addmovie", (req, res) => {
  let alert = "";
  res.render("addmovie", { alert: alert });
});


app.post("/addmovie", (req, res) => {
  let alert = "";

  if (req.body.filmSubmit) {
    
    let movieName = req.body.movieName;
    let movieYear = req.body.movieYear;
    if (!movieName || !movieYear) {
      alert = "Täidke palun filmi pealkiri ja aasta!";
    } else {
      let sqlInsertMovie = "INSERT INTO movies (name, year) VALUES (?, ?)";
      conn.query(sqlInsertMovie, [movieName, movieYear], (err, sqlRes) => {
        if (err) {
          throw err;
        } else {
          alert = "Film lisatud.";
        }
      });
    }
  } else if (req.body.personSubmit) {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    if (!firstName || !lastName) {
      alert = "Palun sisestage oma tegelase ees- ja perekonnanimi!";
    } else {
      let sqlInsertPerson = "INSERT INTO person (first_name, last_name) VALUES (?, ?)";
      conn.query(sqlInsertPerson, [firstName, lastName], (err, sqlRes) => {
        if (err) {
          throw err;
        } else {
          alert = "Tegelane lisatud.";
        }
      });
    }
  } else if (req.body.roleSubmit) {
    let roleName = req.body.roleName;
    let personId = req.body.personId;
    let movieId = req.body.movieId;
    if (!roleName || !personId || !movieId) {
      alert = "Palun täitke rolli jaoks kõik andmed!";
    } else {
      let sqlInsertRole = "INSERT INTO roles (role_name, person_id, movie_id) VALUES (?, ?, ?)";
      conn.query(sqlInsertRole, [roleName, personId, movieId], (err, sqlRes) => {
        if (err) {
          throw err;
        } else {
          alert = "Roll lisatud.";
        }
      });
    }
  }

  res.render("addmovie", { alert: alert });
});


app.get("/eestifilm/tegelased", (req, res) => {
  let sqlReq = "SELECT first_name, last_name, birth_date FROM person";
  let persons = [];
  conn.query(sqlReq, (err, sqlres) => {
    if (err) {
      throw err;
    } else {
      persons = sqlres;
      res.render("tegelased", { persons: persons });
    }
  });
});


app.listen(5199)