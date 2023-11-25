// CourseParser.js

const { getCruFilesContent } = require("./data");

class Course {
  constructor(code) {
    this.code = code;
    this.sessions = []; // Array of Session objects
  }

  addSession(session) {
    this.sessions.push(session);
  }
}

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
}

var CourseParser = function (showTokenize, showParsedSymbols) {
  this.parsedCourses = [];
  this.symb = ["+"];
  this.showTokenize = showTokenize;
  this.showParsedSymbols = showParsedSymbols;
  this.errorCount = 0;
};

CourseParser.prototype.tokenize = function (data) {
  var separator = /(\r\n)/;
  return data
    .split(separator)
    .filter((val) => !val.match(separator) && val.trim() !== "");
};

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

CourseParser.prototype.errMsg = function (msg, input) {
  this.errorCount++;
  console.log("Parsing Error ! on " + input + " -- msg : " + msg);
};

CourseParser.prototype.next = function (input) {
  if (input.length === 0) {
    this.errMsg("Unexpected end of input", []);
    return null;
  }
  var curS = input.shift();
  /* if (this.showParsedSymbols) {
    console.log(curS);
  } */
  return curS;
};

CourseParser.prototype.accept = function (s) {
  //console.log("s", s);
  var idx = this.symb.indexOf(s);
  if (idx === -1) {
    //this.errMsg("symbol " + s + " unknown", [" "]);
    return false;
  }
  return idx;
};

CourseParser.prototype.check = function (s, input) {
  return input.length > 0 && this.accept(s) === this.accept(input[0]);
};

CourseParser.prototype.expect = function (s, input) {
  var nextSymbol = this.next(input);
  if (nextSymbol && s === nextSymbol) {
    return true;
  } else {
    this.errMsg("Expected symbol " + s + ", but found " + nextSymbol, input);
    return false;
  }
};

CourseParser.prototype.listCourses = function (input) {
  //console.log("input", input);
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
  //this.expect("$$", input);
};

CourseParser.prototype.course = function (input) {
  /* if (!this.check("COURSE_CODE", input[0])) {
    this.errMsg("Course code expected", input);
    return null;
  } */

  var courseCode = this.next(input).slice(1); // Remove the '+' sign
  var course = new Course(courseCode);

  while (input.length !== 0 && /\/{2}/.test(input[0])) {
    var session = this.session(input);
    if (session) {
      course.addSession(session);
    }
  }
  //console.log("course", course);
  return course;
};

CourseParser.prototype.session = function (input) {
  var sessionDetails = this.next(input).split(",");
  if (sessionDetails.length < 6) {
    this.errMsg("Incomplete session details", sessionDetails);
    return null;
  }

  var type = sessionDetails[0];
  var num = sessionDetails[1];
  var capacity = sessionDetails[2].split("=")[1];
  var day = sessionDetails[3].split(" ")[0].split("=")[1];
  var time = sessionDetails[3].split(" ")[1];
  var frequency = sessionDetails[4];
  var room = sessionDetails[5].split("=")[1].split(/\/{2}/)[0];

  return new Session(type, num, capacity, day, time, frequency, room);
};

module.exports = CourseParser;
