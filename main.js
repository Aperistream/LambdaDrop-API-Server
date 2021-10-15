const sqlite3 = require('sqlite3').verbose();
var express = require('express');
const fs = require('fs');
var server = express();

let db = new sqlite3.Database('./tokens.db', (err) => {
    if (err) throw err;
    console.log('Connected to the local database.');
});

server.get('/', function(req, res) {
    res.status(200).send("Félicitations ! Si tu trouves cette page, soit tu es du staff soit tu n'as rien à foutre ici mais tu es là ! Alors envoies moi ton CV à contact@manoah.fr")
});

server.get('/about', function(req, res){
    res.status(200).json({version:"Alpha 0.1",Author:"Le_Mocha",Project_Name:"LambdaDropServer"})
});

server.get('/party', function(req, res){
    fs.readFile("./data/party.json", 'utf-8', (err, data) => {
        if(err){
            res.status(500).send(err)
            return;
        }
        res.status(200).json(JSON.parse(data))
    });
})

server.get('/update', (req, res) => {
    var token = req.query.t;

    db.all(`SELECT * FROM tokens WHERE t = "${token}"`, [], (err, result) => {
        if (err){
            res.status(500).send(err.message) 
            return
        }
        
        if (!result[0]) {
            res.status(403).send("403 Error : Forbidden")
            return
        } else {
            try {
                JSON.parse(req.query.p)
            } catch (err){
                res.status(500).send(err.message)
                return
            }
        
            fs.writeFile('./data/party.json', req.query.p, function (err) {
                if (err){
                    res.status(500).send(err)
                    return
                }
            });
        
            res.status(200).json("nice")
        }
    })
});

server.get('/ping', function(req, res) {
    res.status(200).send("pong !")
});

server.listen(10254, () => {
    console.log("Serveur démarré sur le port 40469")
})