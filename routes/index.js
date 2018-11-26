var express = require('express');
var router = express.Router();
var md5Hash = require("md5-hash");

// Page requests

function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


/* GET home page. */
router.get('/', function (req, res, next) {
    var dbInitError = req.dbInitError;
    if ((dbInitError === undefined) || (dbInitError === null)) {
        var sessId = req.query.sessId;
        if (sessId !== "") {
            var db = req.db;
            var now = Date.now()/1000;
            db.query('SELECT s.cookieId, s.userId, u.admin FROM sessions s, users u WHERE s.cookieId = ? and s.timeoutTime >= ? and s.userId=u.id', [sessId, now], function (error, results, fields) {
                if (error) {
                    console.error('GET listings: ' + JSON.stringify(error));
                    res.json(
                        {msg: error}
                    );
                } else if (results.length > 0) {

                    res.render('index', {title: 'Alumni Business Directory', cookieId: results[0].cookieId, userId: results[0].userId, isAdmin: results[0].admin});
                } else {
                    res.render('login', {title: 'Login to the Alumni Business Directory'});
                }
            });
        }
        else{
            res.render('login', {title: 'Login to the Alumni Business Directory'});
        }
    } else {
        res.render('error', {
            message: dbInitError.title,
            error: dbInitError
        });
    }
});


/* GET login page. */
router.get('/login', function (req, res, next) {
    var dbInitError = req.dbInitError;
    if ((dbInitError === undefined) || (dbInitError === null)) {
        res.render('login', {title: 'Login to the Alumni Business Directory'});
    } else {
        res.render('error', {
            message: dbInitError.title,
            error: dbInitError
        });
    }
});

/* GET login page. */
router.get('/create-account', function (req, res, next) {
    var dbInitError = req.dbInitError;
    if ((dbInitError === undefined) || (dbInitError === null)) {
        res.render('create-account', {title: 'Create an Alumni Business Directory account'});
    } else {
        res.render('error', {
            message: dbInitError.title,
            error: dbInitError
        });
    }
});


router.post('/create-account', function (req, res, next) {
    var db = req.db;
    var data = req.body;
    var email = data.username;
    if (email !== "") {
        // check to make sure we have unique email
        db.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
            if (error) {
                console.error('GET listings: ' + JSON.stringify(error));
                res.json(
                    {msg: error}
                );
            } else {
                if (results.length === 0) {
                    var password = md5Hash.default(data.password);
                    db.query('INSERT INTO users SET firstName = ?, lastName = ?, email = ?, password = ?, gradYear = ?' , [data.firstName, data.lastName, data.username, password, data.gradYear], function (error, results) {
                        var userId = results.insertId;
                        var admin = 0;
                        var cookieId = makeid(50);
                        var startTime = Date.now()/1000;
                        var timeoutTime = startTime + req.config.sessionTimeout;
                        db.query('INSERT INTO sessions SET userId = ?, cookieId = ?, startTime = ?, timeoutTime = ?' , [userId, cookieId, startTime, timeoutTime], function (error) {
                            res.render('index', {title: 'Listings   ', cookieId: cookieId, userId: userId, isAdmin: 0});

                        });

                    });
                }
                else
                {
                    res.json(
                        {msg: "A user with the email address already exists in our system. Please log in with that email address or try another."}
                    );
                }
            }
        });
    }
    else{
        res.render('login', {title: 'Login Page'});
    }
});

/* GET logout page. */
router.get('/logout', function (req, res, next) {
    var dbInitError = req.dbInitError;
    if ((dbInitError === undefined) || (dbInitError === null)) {
        // first check if this was sent by logout button
        var sessId = req.query.sessId;
        if (sessId !== "") {
            var db = req.db;
            db.query('DELETE from sessions WHERE cookieId = ?', [sessId], function (error) {
            });
        }
        res.render('login', {title: 'Login to the Alumni Business Directory'});
    } else {
        res.render('error', {
            message: dbInitError.title,
            error: dbInitError
        });
    }
});

router.post('/login', function (req, res, next) {
    var db = req.db;
    var data = req.body; 
    var email = data.username;
    var password = md5Hash.default(data.password);
    if (email !== "") {
     db.query('SELECT * FROM users WHERE email = ? AND password = ? ', [email, password], function (error, results, fields) {
        if (error) {
            console.error('GET listings: ' + JSON.stringify(error));
            res.json(
                {msg: error}
            );
        } else {
            if (results.length==0) {
                res.render('login', {title: 'Login Page'});
            }
            else
            {
                // logged in, gen session
                var userId = results[0].id;
                var admin = results[0].admin;
                var cookieId = makeid(50);
                var startTime = Date.now()/1000;
                var timeoutTime = startTime + req.config.sessionTimeout;
                db.query('INSERT INTO sessions SET userId = ?, cookieId = ?, startTime = ?, timeoutTime = ?' , [userId, cookieId, startTime, timeoutTime], function (error) {
                    res.render('index', {title: 'Listings   ', cookieId: cookieId, userId: userId, isAdmin: results[0].admin});

                });
            }
        }
    });
    }
    else{
        res.render('login', {title: 'Login Page'});
    }
});

/* GET My listings page. */
router.get('/my-listings', function (req, res, next) {
    var sessId = req.query.sessId;
    if (sessId !== "") {
        var db = req.db;
        var now = Date.now()/1000;
        db.query('SELECT s.cookieId, s.userId, u.admin, u.firstName, u.lastName, u.gradYear, u.email FROM sessions s, users u WHERE s.cookieId = ? and s.timeoutTime >= ? and s.userId=u.id', [sessId, now], function (error, results, fields) {
            if (error) {
                console.error('GET listings: ' + JSON.stringify(error));
                res.json(
                    {msg: error}
                );
            } else {
                if (results.length === 0) {
                    res.render('login', {title: 'Login Page'});
                }
                else {
                    res.render('my-listings', {title: 'My Listings', cookieId: results[0].cookieId, userId: results[0].userId, isAdmin: results[0].admin, firstName: results[0].firstName, lastName: results[0].lastName, gradYear: results[0].gradYear, email: results[0].email});
                }
            }
        });
    }
    else{
        res.render('login', {title: 'Login Page'});
    }
});

/* GET Verify page. */
router.get('/verify', function (req, res, next) {
    var sessId = req.query.sessId;
    if (sessId !== "") {
        var db = req.db;
        var now = Date.now()/1000;
        db.query('SELECT s.cookieId, s.userId, u.admin FROM sessions s, users u WHERE s.cookieId = ? and s.timeoutTime >= ? and s.userId=u.id', [sessId, now], function (error, results, fields) {
            if (error) {
                console.error('GET listings: ' + JSON.stringify(error));
                res.json(
                    {msg: error}
                );
            } else {
                if (results.length === 0) {
                    res.render('login', {title: 'Login Page'});
                } else if (results[0].admin !== 1) {
                    res.render('error', {
                        message: "You do not have permission to view this page",
                        error: {
                            status: "Authentication Error",
                            stack: "You need to be an administrator to view this page"
                        }
                    });
                }
                else {
                    res.render('aomp', {title: 'Verify pending listings', cookieId: results[0].cookieId, userId: results[0].userId, isAdmin: results[0].admin});
                }
            }
        });
    }
    else{
        res.render('login', {title: 'Login Page'});
    }
});



/* GET Verify page. */
router.get('/report', function (req, res, next) {
    var sessId = req.query.sessId;
    if (sessId !== "") {
        var db = req.db;
        var now = Date.now()/1000;
        db.query('SELECT s.cookieId, s.userId, u.admin FROM sessions s, users u WHERE s.cookieId = ? and s.timeoutTime >= ? and s.userId=u.id', [sessId, now], function (error, results, fields) {
            if (error) {
                console.error('GET listings: ' + JSON.stringify(error));
                res.json(
                    {msg: error}
                );
            } else {
                if (results.length === 0) {
                    res.render('login', {title: 'Login Page'});
                } else if (results[0].admin !== 1) {
                    res.render('error', {
                        message: "You do not have permission to view this page",
                        error: {
                            status: "Authentication Error",
                            stack: "You need to be an administrator to view this page"
                        }
                    });
                }
                else {
                    res.render('report', {title: 'User Report', cookieId: results[0].cookieId, userId: results[0].userId, isAdmin: results[0].admin});
                }
            }
        });
    }
    else{
        res.render('login', {title: 'Login Page'});
    }
});

module.exports = router;
