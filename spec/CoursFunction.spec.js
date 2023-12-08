const { getSalles, getCapacite } = require("../CoursFunction");
const CourseParser = require('../Parser')
const {Course, Session , CourseParser} = require('../Parser')

describe("Programme pour tester les sorties des cours leurs sessions ", function () {
    beforeAll(function () {
        this.courseParser = new CourseParser();
    });

    // Tester si on toutes les salles  
    it("can give all the rooms of a subject", async () => {
       // Initialisation des données 
        const courseCode = "MT04";
        const Type = "1";
        const Num = "C1";
        const capacity = "100";
        const day = "L";
        const time = "08:00 - 10:00";
        const frequency = "F1";
        const room = "A001";
        
        // Création instance de Course   
        const course = new Course(courseCode);

        // Ajout d'une session a ce cours 
       
        const session = new Session(Type, Num, capacity, day, time, frequency, room);
        course.addSession(session);
        // On espionne le log 
        spyOn(console, 'log');
        await getSalles(courseCode)
        expect(console.log).toHaveBeenCalledWith('La salle pour le cours ${courseCode} qui a lieu le ${sessionDay} à ${sessionTime} est : ${sessionRoom}');
});
    //Tester si on obtien la bonne capacité 
    it ("can give the maximum capacity of a room  ", async() => {
        //inialisation des donnes 
        const roomName = "A001";
    const courseCode = "MT04";
    const sessionType = "1";
    const sessionNum = "C1";
    const sessionCapacity = "100";
    const sessionDay = "L";
    const sessionTime = "08:00 - 10:00";
    const sessionFrequency = "F1";

    const course = new Course(courseCode);
    const session = new Session(sessionType, sessionNum, sessionCapacity, sessionDay, sessionTime, sessionFrequency, sessionRoom);
     course.addSession(session);
     spyOn(console, 'log');

    // Appelez la fonction à tester
    await getCapacite(roomName);
    expect(console.log).toHaveBeenCalledWith('Capacité maximale de la salle "${roomName}": ${sessionCapacity} personnes');

    })

    }) 







