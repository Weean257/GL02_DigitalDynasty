// CourseParser.js

const { getCruFilesContent } = require("./data");

const days = ["L", "MA", "ME", "J", "V", "S", "D"];

// Représente un cours avec un code et une liste de sessions
class Course {
  constructor(code) {
    this.code = code;
    this.sessions = []; // Array of Session objects
  }

  addSession(session) {
    this.sessions.push(session);
  }

  getSessionsIn(start_date, end_date) {
    return this.sessions.filter((session) =>
      session.isSessionIn(start_date, end_date)
    );
  }
}

// Représente une session de cours avec des détails tels que le type, le numéro, la capacité, le jour, l'heure, la fréquence et la salle
class Session {
  constructor(type, num, capacity, day, time, frequency, room) {
    this.type = type;
    this.num = num;
    this.capacity = parseInt(capacity);
    this.day = day;
    this.time = time;
    this.frequency = frequency;
    this.room = room;
  }

  isSessionIn(start_date, end_date) {
    return (
      days.indexOf(this.day) >= days.indexOf(start_date) &&
      days.indexOf(this.day) <= days.indexOf(end_date)
    );
  }
}

// Initialise une instance de CourseParser
var CourseParser = function (showTokenize, showParsedSymbols) {
  this.parsedCourses = [];
  this.symb = ["+"];
  this.showTokenize = showTokenize;
  this.showParsedSymbols = showParsedSymbols;
  this.errorCount = 0;
};

// Divise les données en tokens en utilisant un séparateur défini
CourseParser.prototype.tokenize = function (data) {
  var separator = /(\r\n)/;
  return data
    .split(separator)
    .filter((val) => !val.match(separator) && val.trim() !== "");
};

// Analyse les données et affiche le résultat, y compris les erreurs éventuelles
CourseParser.prototype.parse = function (data) {
  var tData = this.tokenize(data);
  if (this.showTokenize) {
    console.log(tData);
  }
  this.listCourses(tData);
  if (this.errorCount > 0) {
    console.log("Finished parsing with " + this.errorCount + " errors.");
  } else {
    console.log("Parsing successful.");
  }
};

//  Récupère le contenu des fichiers du répertoire spécifié et renvoie une promesse résolue avec les cours analysés
CourseParser.prototype.getParsedCourses = function () {
  const directoryPath = ".\\data"; // Replace with your directory path

  return new Promise((resolve, reject) => {
    getCruFilesContent(directoryPath)
      .then((data) => {
        this.parse(data);
        resolve(this.parsedCourses);
      })
      .catch((err) => {
        console.error("Une erreur est survenue:", err);
        reject(err);
      });
  });
};

// Affiche un message d'erreur et incrémente le compteur d'erreurs
CourseParser.prototype.errMsg = function (msg, input) {
  this.errorCount++;
  console.log("Parsing Error ! on " + input + " -- msg : " + msg);
};

// Retourne le prochain élément dans l'entrée
CourseParser.prototype.next = function (input) {
  if (input.length === 0) {
    this.errMsg("Unexpected end of input", []);
    return null;
  }
  return input.shift();
};

// Vérifie si un symbole est accepté par l'analyseur
CourseParser.prototype.accept = function (s) {
  var idx = this.symb.indexOf(s);
  if (idx === -1) {
    return false;
  }
  return idx;
};

// Vérifie si le prochain symbole dans l'entrée correspond à un symbole donné
CourseParser.prototype.check = function (s, input) {
  return input.length > 0 && this.accept(s) === this.accept(input[0]);
};

// S'attend à ce que le prochain symbole dans l'entrée soit égal à un symbole spécifié
CourseParser.prototype.expect = function (s, input) {
  var nextSymbol = this.next(input);
  if (nextSymbol && s === nextSymbol) {
    return true;
  } 
  this.errMsg("Expected symbol " + s + ", but found " + nextSymbol, input);
  return false;
};

// Parcourt la liste d'entrée pour extraire et ajouter des cours
CourseParser.prototype.listCourses = function (input) {
  while (input.length > 0) {
    if (input[0] === "+UVUV") {
      input.shift();
    }
    if (this.check("+", input[0])) {
      var course = this.course(input);
      if (course) {
        this.parsedCourses.push(course);
      }
    } else {
      input.shift();
    }
  }
};

//Analyse les détails d'un cours et crée une instance de Course
CourseParser.prototype.course = function (input) {
  const courseCode = this.next(input).slice(1); // Remove the '+' sign
  let course = new Course(courseCode);

  while (input.length !== 0 && /\/{2}/.test(input[0])) {
    if (this.session(input)) {
      course.addSession(session);
    }
  }
  return course;
};

// Analyse les détails d'une session et crée une instance de Session
CourseParser.prototype.session = function (input) {
  const sessionDetails = this.next(input).split(",");
  if (sessionDetails.length < 6) {
    this.errMsg("Incomplete session details", sessionDetails);
    return null;
  }

  const type = sessionDetails[0];
  const num = sessionDetails[1];
  const capacity = sessionDetails[2].split("=")[1];
  const day = sessionDetails[3].split(" ")[0].split("=")[1];
  const time = sessionDetails[3].split(" ")[1];
  const frequency = sessionDetails[4];
  const room = sessionDetails[5].split("=")[1].split(/\/{2}/)[0];

  return new Session(type, num, capacity, day, time, frequency, room);
};

// Exporte les classes Course et Session et le constructeur CourseParser
module.exports = CourseParser;
module.exports.Course = Course;
module.exports.Session = Session;
