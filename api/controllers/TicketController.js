"use strict";
var TicketController = (function () {
    function TicketController() {
    }
    TicketController.prototype.find = function (req, res) {
        Ticket.find().then(function (hoges) {
            res.view('hogepage', hoges);
        });
    };
    TicketController.prototype.findOne = function (req, res) {
        Ticket.find().then(function (hoges) {
            res.send(hoges);
        });
    };
    TicketController.prototype.tracker = function (req, res) {
        Ticket.native(function (err, collection) {
            collection.aggregate([
                {
                    "$group": {
                        "_id": "$tracker",
                        "total": { "$sum": 1 }
                    }
                }
            ], function (err, result) {
                if (err)
                    return res.serverError(err);
                res.ok(result);
            });
        });
        return;
    };
    TicketController.prototype.bugdensity = function (req, res) {
        Ticket.native(function (err, collection) {
            collection.aggregate([
                {
                    $lookup: {
                        from: 'time',
                        localField: 'id',
                        foreignField: 'id',
                        as: 'times'
                    }
                },
                {
                    $unwind: "$times"
                },
                {
                    $match: {
                        tracker: "出荷前バグ",
                        solution: "修正済"
                    }
                },
                {
                    $project: {
                        "id": 1,
                        "testver": 1,
                        "activity": "$times.activity",
                        "time": "$times.time",
                        "_id": 0
                    }
                },
                {
                    $match: {
                        activity: "テスト"
                    }
                },
                {
                    $group: {
                        _id: "$id",
                        "testver": { $first: "$testver" },
                        "time": { $sum: "$time" }
                    }
                },
                {
                    $group: {
                        _id: "$testver",
                        "count": { $sum: 1 },
                        "time": { $sum: "$time" }
                    }
                }
            ], function (err, result) {
                if (err)
                    return res.serverError(err);
                var version = {};
                for (var i = 0; i < result.length; i++) {
                    var temp = result[i];
                    if (temp.testver in version) {
                        if (temp.activity in version[temp.testver]) {
                            version[temp.testver][temp.activity] = version[temp.testver][temp.activity] + temp.time;
                        }
                        else {
                            version[temp.testver][temp.activity] = temp.time;
                        }
                    }
                    else {
                        version[temp.testver] = {};
                        version[temp.testver]["testver"] = temp.testver;
                        version[temp.testver][temp.activity] = temp.time;
                    }
                }
                var results = Array();
                var i = 0;
                for (var ver in version) {
                    results.push(version[ver]);
                }
                res.ok(results);
            });
        });
        return;
    };
    TicketController.prototype.findTwo = function (req, res) {
        Ticket.native(function (err, collection) {
            collection.aggregate([
                {
                    "$group": {
                        "_id": "$subject",
                        "total": { "$sum": 1 }
                    }
                }
            ], function (err, result) {
                if (err)
                    return res.serverError(err);
                res.ok(result);
            });
        });
    };
    return TicketController;
}());
module.exports = new TicketController();
