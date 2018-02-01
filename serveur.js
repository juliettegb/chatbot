var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var salles1er = ['Forum des images - Forum des Halles, 2 rue du Cinéma', ' UGC Ciné Cité Les Halles - 7, place de la Rotonde'];
var salles2e = ['Gaumont Opéra (côté Premier) - 32, rue Louis Legrand', ' Le Grand Rex - 1, bd Poissonniere'];
var affiche = ['Au revoir là-haut', ' Corps et âme', ' Brooklyn Yiddish', ' Sans Adieu', ' Pour le réconfort', ' Leçon de classes'];
var salle = [
  {nom: 'Forum des images', films: 'Gloria, Alien le huitième passager'}, //Films pas stockés sous forme de tableau..
  {nom: 'UGC Ciné Cité Les Halles', films: 'blabla'},
  {nom: 'Gaumont Opéra', films: ''},
  {nom: 'Le Grand Rex', films: ''}
];

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('index');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);

    var reponseEnvoyee = false;

    console.log("debut : " + reponseEnvoyee);

    if (msg.search(/bonjour/i) != -1 || msg.search(/hello/i) != -1 || msg.search(/salut/i) != -1) {
      reponseEnvoyee = true;
      io.emit('chat message', "Hello, comment puis-je t'aider? :) Par exemple, si tu cherches une salle dans le 10e dis simplement 'Salle 10e'. Et pour connaître les sorties de la semaine, il suffit de dire 'Affiche'.");
    } else if (msg.search(/1/i) != -1){
      reponseEnvoyee = true;
      io.emit('chat message', "Voici une liste de salles dans le 1er arrondissement: "+salles1er);
    } else if (msg.search(/2/i) != -1){
      reponseEnvoyee = true;
      io.emit('chat message', "Voici une liste de salles dans le 2e arrondissement: "+salles2e);
    } else if (msg.search(/affiche/i) != -1){
      reponseEnvoyee = true;
      io.emit('chat message', "Voici les sorties ciné de la semaine: "+affiche);
    } else {
        for(var i=0; i<salle.length; i++){
          if (msg == salle[i].nom){
            reponseEnvoyee = true;
            io.emit('chat message', "Voici les films dans cette salle: "+salle[i].films)}
        }
    }

    console.log("fin : " + reponseEnvoyee);

    if (reponseEnvoyee==false) {
      io.emit('chat message', "Désolé, je n'ai pas compris..");
    }
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
