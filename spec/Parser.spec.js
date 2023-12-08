const CourseParser = require("../Parser");

describe("CourseParser", function () {
  let courseParser;

  beforeEach(function () {
    courseParser = new CourseParser(false, false);
  });

  it("should correctly tokenize data", function () {
    let rawData = "+MC01\n1,C1,P=24,H=L 10:00-12:00,F1,S=P202//\n";
    let tokens = courseParser.tokenize(rawData);
    expect(tokens).toEqual(jasmine.any(Array));
    expect(tokens.length).toBeGreaterThan(0);
  });

  it("should correctly parse a course", function () {
    let input = ["+MC01", "1,C1,P=24,H=L 10:00-12:00,F1,S=P202//"];
    let course = courseParser.course(input);
    expect(course).toEqual(jasmine.any(CourseParser.Course));
    expect(course.code).toBe("MC01");
  });

  it("should correctly parse a session", function () {
    let sessionData = "1,C1,P=24,H=L 10:00-12:00,F1,S=P202//";
    let session = courseParser.session([sessionData]);
    expect(session).toEqual(jasmine.any(CourseParser.Session));
    expect(session.day).toBe("L");
    expect(session.time).toBe("10:00-12:00");
  });

  it("should filter sessions correctly", function () {
    let course = new CourseParser.Course("MC01");
    course.addSession(
      new CourseParser.Session("C1", 1, 24, "L", "10:00-12:00", 120, "A101")
    );
    course.addSession(
      new CourseParser.Session("C2", 2, 24, "MA", "14:00-16:00", 120, "A102")
    );

    let filteredSessions = course.getSessionsIn("L", "MA");
    expect(filteredSessions.length).toBe(2);
  });

  it("should validate session data correctly", function () {
    let sessionData = "C1,1,P=24,H=L 10:00-12:00,F1,S=P202//";
    let session = courseParser.session([sessionData]);
    expect(session.type).toBe("C1");
    expect(session.capacity).toEqual(jasmine.any(Number));
    expect(session.day).toMatch(/^[LMAJVS]$/);
  });
});
