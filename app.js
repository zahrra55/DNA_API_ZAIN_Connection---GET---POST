

const express = require('express'); // make flexible Node.js web application framework
var app = express(); // make variable
const mysql = require('mysql'); // make Node.js work with database (MYSQL)
const bodyparser = require('body-parser'); // Node.js body parsing middleware.
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.all('*', function(req, res,next) {
    /**
     * Response settings
     * @type {Object}
     */
    var responseSettings = {
        "AccessControlAllowOrigin": req.headers.origin,
        "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
        "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
        "AccessControlAllowCredentials": true
    };

    /**
     * Headers
     */
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }


});

//connecting to database 
const mc = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'company',
    multipleStatements: true
});


// open broswer on this -> "localhost:4000/"
var port = process.env.PORT || 4000
console.log("Running on port:" + port)
app.listen(port);

app.get('/', (request, response) => {
    mc.query(`SELECT *  FROM mypple`, function (error, results, fields) {
        if (error) throw error;
        return response.send(results);
    });

});

/// GET

app.get('/get/mypple', (request, response) => {
    mc.query(`SELECT *  FROM mypple`, function (error, results, fields) {
        if (error) throw error;
        return response.send(results);
    });

});
app.get('/get/:id', function (req, res) {

    let ID = req.params.ID;
    let NAME = req.params.NAME;
    let JOB = req.params.JOB;
    let AGE = req.params.AGE;
    // let IMG = req.params.IMG;
    // let LABLE = req.params.LABLE;
    // let PRICE = req.params.PRICE;
    // let RES_NAME = req.params.RES_NAME;
    // let RES_TAG = req.params.RES_TAG;
    // let DESCRIBTION = req.params.DESCRIBTION;
    // let MealType = req.params.MealType;
    // let TIME = req.params.TIME;
    // let Off_price = req.params.Off_price;
    // let  TAG = req.params.TAG;
    

    mc.query('SELECT * FROM meals where ID=?', ID, function (error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });

});
// app.get('/get/:id', function (req, res) {

//     let ID = req.params.ID;
//     // let IMG = req.params.IMG;
//     // let LABLE = req.params.LABLE;
//     // let PRICE = req.params.PRICE;
//     // let RES_NAME = req.params.RES_NAME;
//     // let RES_TAG = req.params.RES_TAG;
//     // let DESCRIBTION = req.params.DESCRIBTION;
//     // let MealType = req.params.MealType;
//     // let TIME = req.params.TIME;
//     // let Off_price = req.params.Off_price;
//     // let  TAG = req.params.TAG;
    

//     mc.query('SELECT * FROM meals where ID=?', ID, function (error, results, fields) {
//         if (error) throw error;
//         return res.send(results);
//     });

// });

/// POST

app.post('/add', function (req, res) {

    
         var data = {
            "NAME":req.body.NAME,
            "JOB":req.body.JOB,
            "AGE":req.body.AGE, 
        // "IMG":req.body.IMG,
        // "LABLE":req.body.LABLE,
        // "PRICE":req.body.PRICE,
        // "RES_NAME":req.body.RES_NAME,
        // "RES_TAG":req.body.RES_TAG,
        // "DESCRIBTION":req.body.DESCRIBTION,
        // "MealType":req.body.MealType,
        // "TIME":req.body.TIME,
        // "Off_price":req.body.Off_price,
        // "TAG":req.body.TAG,        
       
    }



    mc.query('INSERT INTO meals SET ?', data, function (error, results, fields) {
        if (error) {

            res.send({
                "code": 404,
                "MSG": "مو تمام"
            });

            try {
                
            } catch (err) {
               if (err.code === 'ER_DUP_ENTRY') {
                   //handleHttpErrors(SYSTEM_ERRORS.USER_ALREADY_EXISTS);
               } else {
                   //handleHttpErrors(err.message);
                }
            }

        } else {
            console.log('The solution is: ', results);
            if (error) throw error;
            res.send({
                "code": 200,
                "success": "عاشت ايدك"
            });
        }
    });

 
    
  

});

app.post('/dnascolarship/check/', (req, res) => {

    let data={
        "email":req.body.email,
        "password":req.body.password,

    }

    let sql1 = ` 
    SELECT DNA.*,DNA_EC.password,sum(DNA.points) as pointss
    from DNA,DNA_EC 
    where DNA_EC.email = DNA.email AND DNA_EC.code = '${data.email}' and password = '${data.password}'
    GROUP by DNA.email
    `;

    mc.query(sql1, function (error, results, fields) {
        console.log("/dnascolarship/check/")
        if (error) {
            console.log(error);
            return res.send(error);
        }

        else {
            console.log(data)
            return res.send(results);
        }
    });

});











