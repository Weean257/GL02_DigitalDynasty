# GL02_DigitalDynasty

# Vous trouverez dans caporalCli.js au niveau de la commande data, comment appeler les données parsées.

# Ci- dessus la classe Course et Session.

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
