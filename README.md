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
# Installation: 

npm install

# Utilisation :
 
## Obtention des salles associer à un cours 

### Pour obtenir les salles associées à un cours, utilisez la commande suivante et remplacez '<nomCours>' par le nom du cours pour lequel vous souhaitez obtenir les information sur les salles 

node CaporalCli.js salles <nomCours>

## Obtention de la capacie d'une salle 
### Pour obtenir la capacité maximal d'une salles, utilisez la commande suivante et remplacer '<nomSalle>' par la salles pour laquelle vous souhaitez obtenir le capacité 

node CaporalCli.js capacite <nomSalle>


