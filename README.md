# SRU-CLI

## Description
SRU-CLI est un outil en ligne de commande pour la gestion et l'analyse des emplois du temps universitaires. Il permet de générer des calendriers iCalendar, de vérifier la qualité des données d'emploi du temps, d'obtenir des informations sur les salles de cours et leurs capacités, ainsi que de visualiser l'occupation des salles.

## Installation
Pour installer SRU-CLI, vous devez avoir Node.js installé sur votre machine. Suivez ces étapes :
1. Clonez le dépôt : `git clone https://github.com/OprahN/GL02_DigitalDynasty`
2. Naviguez dans le dossier du projet, par exemple : "cd documents/gl02/gl02_DigitalDynasty" il faut evidement adapter cette commande à l'endroit ouvous avez enregistré le projet
3. Installez les dépendances : `npm install`
4. Installez globalement Vega-Lite : `npm install -g vega vega-lite vega-cli`

## Utilisation
Voici comment utiliser les différentes commandes de SRU-CLI :

### Générer un Calendrier
- Commande : `calendar`
- Arguments :
  - `<start>` : Date de début (format YYYY-MM-DD)
  - `<end>` : Date de fin (format YYYY-MM-DD)
  - `[filename]` : Nom du fichier de sortie sans ajouter l'extention (défaut : output)
- Usage : `node caporalCli.js calendar <start> <end> [filename]`

### Vérifier la Qualité des Données
- Commande : `quality`
- Cette commande vérifie s'il y a des conflits dans les emplois du temps.
- Usage : `node caporalCli.js quality`

### Obtenir les Salles pour un Cours
- Commande : `salles`
- Argument : `<nomCours>` : Nom du cours
- Usage : `node caporalCli.js salles <nomCours>`

### Récupérer les Capacités des Salles
- Commande : `capacite`
- Argument : `<nomSalle>` : Nom de la salle
- Usage : `node caporalCli.js capacite <nomSalle>`

### Voir les Données
- Commande : `data`
- Récupère toutes les données des cours et les affiche.
- Usage : `node caporalCli.js data`

### Afficher les Créneaux d'Occupation d'une Salle
- Commande : `room-occupancy`
- Argument : `<roomCode>` : Code de la salle
- Usage : `node caporalCli.js room-occupancy <roomCode>`

### Générer un Graphique d'Occupation des Salles
- Commande : `generate-occupancy-chart`
- Génère un graphique montrant les taux d'occupation des salles.
- Usage : `node caporalCli.js generate-occupancy-chart`

## Contribution
Les contributions à ce projet sont les bienvenues. Veuillez suivre ces étapes pour contribuer :
1. Forkez le dépôt.
2. Créez une nouvelle branche pour vos modifications.
3. Soumettez une pull request pour révision.

## Licence
Ce projet est distribué sous la licence MIT.

## Contact
Pour toute question ou demande de support, veuillez contacter oprah.nkm@gmail.com.
