var express = require('express');
var router = express.Router();

// Listings APIs

/* GET listings. */
router.get('/', function (req, res) {
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
                    res.json(
                        {
                            msg: 'Not logged in',
                            status: 401
                        }
                    );
                }
                else {
                    db.query('SELECT l.*,CONCAT(u.firstName, " ", u.lastName) AS ownerName, u.gradYear,u.email FROM listings l, users u where l.userId=u.id', null, function (error, results, fields) {
                        if (error) {
                            console.error('GET listings: ' + JSON.stringify(error));
                            res.json(
                                {msg: error}
                            );
                        } else {
                            res.json(results);
                        }
                    });

                    // update session timeout
                    db.query('UPDATE sessions SET timeoutTime=? WHERE cookieId = ?', [(now + req.config.sessionTimeout), sessId], function (error) {

                    });
                }
            }
        });
    }
    else{
        res.json(
            {
                msg: 'Not logged in',
                status: 401
            }
        );
    }
});

/* GET listings. */
router.get('/users', function (req, res) {
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
                if ((results.length === 0) || (results[0].admin !== 1)) {
                    res.json(
                        {
                            msg: 'Not authorized',
                            status: 401
                        }
                    );
                }
                else {
                    var users = [];
                    db.query('SELECT l.businessName, l.location, l.description, l.businessType, l.verified,CONCAT(u.firstName, " ", u.lastName) AS ownerName, u.gradYear,u.email, u.created, u.id as userId FROM users u LEFT JOIN listings l on l.userId=u.id', null, function (error, results, fields) {
                        if (error) {
                            console.error('GET listings: ' + JSON.stringify(error));
                            res.json(
                                {msg: error}
                            );
                        } else {
                            // update session timeout
                            db.query('UPDATE sessions SET timeoutTime=? WHERE cookieId = ?', [(now + req.config.sessionTimeout), sessId], function (error) {

                            });
                            res.json(results);
                        }
                    });
                }
            }
        });
    }
    else{
        res.json(
            {
                msg: 'Not logged in',
                status: 401
            }
        );
    }
});

/* POST new listing. */
router.post('/', function (req, res) {
    var data = req.body;
    var db = req.db;
    var setSQL = '';
    var vals = [];
    var sessId = '';
    for (var col in data) {
        if (col !== 'sessId') {
            setSQL += (setSQL === "" ? "" : ",  ") + col + " = ?";
            vals.push(data[col]);
        } else {
            sessId = data[col];
        }
    }

    // before insert check user is logged in
    if (sessId!== "") {
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
                    }
                    else {
                        // add user id to the setSQL & vals
                        setSQL += (setSQL === "" ? "" : ",  ") + " userId = ?";
                        vals.push(results[0].userId);
                        db.query('INSERT INTO listings SET ' + setSQL, vals, function (error) {
                            res.json(
                                (error === null) ? {msg: ''} : {msg: error}
                            );
                        });
                    }
            }
        });
    }
    else{
        res.json(
            {
                msg: 'Not logged in',
                status: 401
            }
        );
    }
});

/* PUT to listings (update using an id). Only admins can update */
router.put('/', function (req, res) {
    var data = req.body;
    var db = req.db;
    var id = data.id;
    var setSQL = '';
    var sessId = '';
    var vals = [];
    for (var col in data) {
        if ((col !== 'id') && (col !== 'sessId')) {
            setSQL += (setSQL === "" ? "" : ",  ") + col + " = ?";
            vals.push(data[col]);
        } else if (col === 'sessId') {
            sessId = data[col];
        }
    }

    vals.push(id);

    // before update check user is logged in & is admin
    if (sessId !== "") {
        var now = Date.now()/1000;

        db.query('SELECT s.cookieId, s.userId, u.admin FROM sessions s, users u WHERE s.cookieId = ? and s.timeoutTime >= ? and s.userId=u.id', [sessId, now], function (error, results, fields) {
            if (error) {
                res.json(
                    {msg: error}
                );
            } else {
                if ((results.length === 0) || (results[0].admin !== 1)) {
                    res.json(
                        {
                            msg: 'Not Authorized',
                            status: 401
                        }
                    );
                }
                else {
                    db.query('UPDATE listings SET ' + setSQL + ' WHERE id = ?', vals, function (error) {
                        res.json(
                            (error === null) ? {msg: ''} : {msg: error}
                        );
                    });
                }
            }
        });
    }
    else{
        res.json(
            {
                msg: 'Not logged in',
                status: 401
            }
        );
    }
});

/* DELETE to deletelisting. */
router.delete('/:id', function (req, res) {
    var db = req.db;
    var id = req.params.id;
    var sessId = req.query.sessId;

    // before update check user is logged in & is admin
    if (sessId !== "") {
        var now = Date.now()/1000;

        db.query('SELECT s.cookieId, s.userId, u.admin FROM sessions s, users u WHERE s.cookieId = ? and s.timeoutTime >= ? and s.userId=u.id', [sessId, now], function (error, results, fields) {
            if (error) {
                res.json(
                    {msg: error}
                );
            } else {
                if (results.length === 0) {
                    res.json(
                        {
                            msg: 'Not Authorized',
                            status: 401
                        }
                    );
                }
                else {
                    var sql = (results[0].admin !== 1 ? " and userId=?" : "");
                    var vals = (results[0].admin !== 1 ? [id, results[0].userId] : [id]);
                    db.query('DELETE from listings WHERE id = ?' + sql, vals, function (error) {
                        res.json(
                            (error === null) ? {msg: ''} : {msg: error}
                        );
                    });
                }
            }
        });
    }
    else{
        res.json(
            {
                msg: 'Not logged in',
                status: 401
            }
        );
    }
});

module.exports = router;
