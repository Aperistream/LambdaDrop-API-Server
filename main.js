// Dépendances
require('dotenv').config()
var mysql = require('mysql');
var express = require('express')
var server = require('express')();
var http = require('http').createServer(server)
const { Server } = require("socket.io"); const io = new Server(http)

// Connexion à la database
console.log("🔗 Connexion à la base myAperistream.")
var pool = mysql.createPool({
    "host": process.env.DB_HOST,
    "user": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_DATA
});

// Le stockage des parties se trouvent dans la mémoire temporaire du prog. Elle doit dont être définie à chaque boot du serveur.
let dataparty = {"team1":{"q1":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},"q2":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},"q3":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},"q4":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}}},"team2":{"q1":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},"q2":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},"q3":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},"q4":{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}}},"finalq":{"th1":{"thname":"","question":"","rep1":"","rep2":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","correp":1}}}
let optparty = {"scores":{"show":false,"team1":100,"team2":100},"state":{"status":0,"question":0,"q_theme":0,"team":1,"affrep":0}}
let repmonn = {"a":0,"b":0,"c":0,"d":0}
let actual = {}
let money = 0
let cache = [{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},{"th1":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","rep3":"","rep4":"","correp":1}},{"th1":{"thname":"","question":"","rep1":"","rep2":"","correp":1},"th2":{"thname":"","question":"","rep1":"","rep2":"","correp":1}}]

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

io.on('connection', (socket) => {  
    socket.emit("connected", {
        party: dataparty,
        options: optparty,
        traps: repmonn,
        actual: actual
    })

    socket.on("ps", (ps) => {
        optparty.state.status = ps
        io.emit("uconf",optparty)
    })

    socket.on("sc", () => {
        optparty.scores.show = true
        io.emit("uconf",optparty)
        setTimeout(() => { optparty.scores.show = false; io.emit("uconf",optparty) }, 5000);
    })

    socket.on("sr", () => {
        optparty.state.affrep = true
        io.emit("uconf",optparty)
    })

    socket.on("tc", (n) => {
        optparty.state.q_theme = n
        io.emit("pm",{
            party: dataparty,
            options: optparty,
            traps: repmonn,
            actual: actual
        })
    })

    socket.on("cp", (ab,r) => {
        if(ab == 1){
            if(r == 1){
                if (repmonn.a == 0) return;
                repmonn.a = repmonn.a-5
                money = money+5 
            }
            if(r == 2){
                if (repmonn.b == 0) return;
                repmonn.b = repmonn.b-5 
                money = money+5 
            }
            if(r == 3){
                if (repmonn.c == 0) return;
                repmonn.c = repmonn.c-5 
                money = money+5 
            }
            if(r == 4){
                if (repmonn.d == 0) return;
                repmonn.d = repmonn.d-5 
                money = money+5 
            }
        } else {
            if(money == 0) return;
            if(r == 1){
                repmonn.a = repmonn.a+5
                money = money-5 
            }
            if(r == 2){
                repmonn.b = repmonn.b+5 
                money = money-5 
            }
            if(r == 3){
                repmonn.c = repmonn.c+5 
                money = money-5 
            }
            if(r == 4){
                repmonn.d = repmonn.d+5 
                money = money-5 
            }
        }
        io.emit("pm",{
            party: dataparty,
            options: optparty,
            traps: repmonn,
            actual: actual
        })
    })

    socket.on("qs", () => {

        money = optparty.scores.team1
        if (optparty.state.team == 2){
            money = optparty.scores.team2
        }
        repmonn = {"a":0,"b":0,"c":0,"d":0}

        optparty.state.q_theme = 0
        if(optparty.state.question == 9) {
            optparty.state.status = 0
            cache[9]
        }
        else {
            optparty.state.question++
            optparty.state.affrep = false
            actual = cache[optparty.state.question-1]
        }
        io.emit("pm",{
            party: dataparty,
            options: optparty,
            traps: repmonn,
            actual: actual
        })
    })

    socket.on("qp", () => {

        money = optparty.scores.team1
        if (optparty.state.team == 2){
            money = optparty.scores.team2
        }
        repmonn = {"a":0,"b":0,"c":0,"d":0}
        
        optparty.state.q_theme = 0
        if(optparty.state.question == 0) {
            optparty.state.status = 0
        } else {
            optparty.state.question = optparty.state.question-1
            optparty.state.affrep = false
            actual = cache[optparty.state.question-1]
        }

        io.emit("pm",{
            party: dataparty,
            options: optparty,
            traps: repmonn,
            actual: actual
        })
    })

});

server.get('/', function(req, res) {
    res.status(200).json({version:"Beta 0.8.2",author:"Le_Mocha",project_name:"LambdaDropServer"})
});

server.route('/party')
.get(function(req, res){

    var token = req.query.t;

    pool.getConnection(function(err, connection){

        if(err){
            res.status(500).send('SQL ERROR : '+ err.message)
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
                    monn: repmonn
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
                    optparty = {"scores":{"show":false,"team1":100,"team2":100},"state":{"status":0,"question":0,"q_theme":0,"team":1,"affrep":0}}
                    repmonn = {"a":0,"b":0,"c":0,"d":0}
                    cache = [dataparty.team1.q1,dataparty.team1.q2,dataparty.team1.q3,dataparty.team1.q4,dataparty.team2.q1,dataparty.team2.q2,dataparty.team2.q3,dataparty.team2.q4,dataparty.finalq]
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
                io.emit("updated", dataparty)
            }
        });
    });

});

server.get('/ping', function(req, res) {
    res.status(200).send("pong")
});

http.listen(process.env.PORT, () => {
    console.log(`🌍 Serveur démarré sur le port ${process.env.PORT}`)
})