const { convertToICSDate, saveToFile } = require("../calendar");

describe("convertToICSDate", function () {
  it("should correctly convert a given day and time to the ICS date format", function () {
    const day = "L"; // Lundi
    const time = "14:30";
    const expectedDatePattern = /\d{8}T\d{6}Z/; // Format iCalendar, par exemple: 20230314T143000Z
    const result = convertToICSDate(day, time);

    expect(result).toMatch(expectedDatePattern);
  });

  it("should handle edge case times like 00:00 or 23:59", function () {
    const day = "V"; // Vendredi
    const time = "23:59";
    const result = convertToICSDate(day, time);

    expect(result).toContain("235900Z"); // Vérifier si l'heure est correctement définie
  });

  it("should return a valid date for an unrecognized day", function () {
    const day = "X"; // Jour non reconnu
    const time = "10:00";
    const result = convertToICSDate(day, time);

    expect(result).toMatch(/\d{8}T\d{6}Z/); // Toujours retourner une date valide
  });
});

describe("saveToFile", function () {
  const fsMock = require("mock-fs");
  const fs = require("fs");
  const path = require("path");

  beforeEach(function () {
    // Création d'un système de fichiers virtuel
    fsMock({
      calendar_files: {}, // Mock du répertoire existant
    });
  });

  afterEach(function () {
    // Restauration du système de fichiers
    fsMock.restore();
  });

  it("should create a new file with the given data", function (done) {
    const testData = "Test Data";
    const testFilename = "test.ics";

    saveToFile(testData, testFilename);

    fs.readFile(
      path.join("calendar_files", testFilename),
      "utf8",
      function (err, data) {
        expect(err).toBeNull();
        expect(data).toBe(testData);
        done();
      }
    );
  });

  it("should create a directory if it does not exist", function (done) {
    fsMock.restore(); // Restaurer pour simuler un répertoire inexistant
    const testData = "Test Data";
    const testFilename = "newTest.ics";

    saveToFile(testData, testFilename);

    expect(fs.existsSync("calendar_files")).toBeTrue();
    done();
  });
});
