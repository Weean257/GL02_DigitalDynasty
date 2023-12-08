const { parseTime, checkForOverlaps } = require("../overlap");

describe("parseTime", function () {
  it("should correctly convert day and time to minutes from the start of the week", function () {
    // Lundi à 00:00 (début de la semaine)
    expect(parseTime("L", "00:00")).toEqual(1 * 24 * 60);

    // Mercredi à 12:00 (milieu de semaine)
    expect(parseTime("ME", "12:00")).toEqual(3 * 24 * 60 + 12 * 60);

    // Dimanche à 23:59 (fin de semaine)
    expect(parseTime("D", "23:59")).toEqual(7 * 24 * 60 + 23 * 60 + 59);
  });

  it("should handle invalid day input", function () {
    // Jour inexistant 'X'
    // Ici, il faut décider du comportement attendu. Exemple : retourner 0 ou null.
    expect(parseTime("X", "10:00")).toBeNaN(); // ou une autre valeur selon la gestion d'erreur prévue
  });
});

describe("checkForOverlaps", function () {
  it("should detect overlaps in the same room at the same time", function () {
    const courses = [
      {
        code: "Course1",
        sessions: [{ day: "L", time: "09:00-11:00", room: "A101" }],
      },
      {
        code: "Course2",
        sessions: [{ day: "L", time: "10:00-12:00", room: "A101" }],
      },
    ];

    const conflicts = checkForOverlaps(courses);
    expect(conflicts.length).toBeGreaterThan(0);
  });

  it("should not report conflicts for courses in different rooms", function () {
    const courses = [
      {
        code: "Course1",
        sessions: [{ day: "L", time: "09:00-11:00", room: "A101" }],
      },
      {
        code: "Course2",
        sessions: [{ day: "L", time: "09:00-11:00", room: "B202" }],
      },
    ];

    const conflicts = checkForOverlaps(courses);
    expect(conflicts.length).toBe(0);
  });

  it("should not report conflicts for courses at different times in the same room", function () {
    const courses = [
      {
        code: "Course1",
        sessions: [{ day: "L", time: "09:00-11:00", room: "A101" }],
      },
      {
        code: "Course2",
        sessions: [{ day: "L", time: "12:00-14:00", room: "A101" }],
      },
    ];

    const conflicts = checkForOverlaps(courses);
    expect(conflicts.length).toBe(0);
  });
});
