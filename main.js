// Dépendances
var mysql = require('mysql');
var express = require('express')
var server = require('express')();
require('dotenv').config()

// Connexion à la database
console.log("🔗 Connexion à la base myAperistream.")
var pool = mysql.createPool({
    "host": process.env.DB_HOST,
    "user": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_DATA
});

// Le stockage des parties se trouvent dans la mémoire temporaire du prog. Elle doit dont être définie à chaque boot du serveur.
let dataparty = {"team1":{"q1":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},"q2":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},"q3":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},"q4":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}}},"team2":{"q1":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},"q2":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},"q3":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},"q4":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}}}}
let optparty = {"scores":{"show":false,"team1":100,"team2":100},"state":{"status":0,"question":0,"q-theme":1,"team":1}}
let repmonn = {"1":0,"2":0,"3":0,"4":0}

server.use(express.json()) // for parsing application/json
server.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


server.get('/', function(req, res) {
    res.status(200).json({version:"Beta 0.8.1",author:"Le_Mocha",project_name:"LambdaDropServer"})
});

server.route('/party')
.get(function(req, res){

    var token = req.query.t;

    pool.getConnection(function(err, connection){

        if(err){
            res.status(500).send('SQL ERROR : '+err.message)
            return console.log(err);
        }
        connection.query(`SELECT * FROM tokens WHERE t = "${token}" AND (perm = 1 OR perm = 2)`, function(err, result){
            connection.release();
            if (err){
                res.status(500).send(err.message) 
                return
            }
            if (!result[0]) {
                res.status(403).send("403 Error : Forbidden")
                return
            } else {

                res.status(200).json({
                    party: dataparty,
                    options: optparty,
                    traps: repmonn
                })
                
            }
        });
    });

})
.post(function(req,res){

    var token = req.query.t;

    pool.getConnection(function(err, connection){

        if(err){
            res.status(500).send('SQL ERROR : '+err.message)
            return console.log(err);
        }
        connection.query(`SELECT * FROM tokens WHERE t = "${token}" AND (perm = 1 OR perm = 2)`, function(err, result){
            connection.release();
            if (err){
                res.status(500).send(err.message) 
                return
            }
            if (!result[0]) {
                res.status(403).send("403 Error : Forbidden")
                return
            } else {
                try {
                    res_infos = req.body
                } catch (err){
                    res.status(500).send(err.message)
                    return
                }
                
                if(req.query.p == "pty") {
                    dataparty = res_infos
                }
                else if(req.query.p == "opt"){
                    optparty = res_infos
                }
                else if (req.query.p == "mon"){
                    repmonn = res_infos
                }
                else if (repmonn.query.p == "scores"){
                    optparty.scores.show = true
                    setTimeout( function(){ optparty.scores.show = false }, 5000)
                }
                else {
                    res.status(400).send("400 Bad Request : Data Type Not Defined.")
                }
                res.status(200).send('Updated')
            }
        });
    });

});

server.get('/ping', function(req, res) {
    res.status(200).send("pong")
});

server.listen(process.env.PORT, () => {
    console.log(`🌍 Serveur démarré sur le port ${process.env.PORT}`)
})