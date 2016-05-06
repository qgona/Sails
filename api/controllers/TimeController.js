"use strict";
var TimeController = (function () {
    function TimeController() {
    }
    TimeController.prototype.activity = function (req, res) {
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
                    $project: {
                        "testver": 1,
                        "activity": "$times.activity",
                        "time": "$times.time",
                        "_id": 0
                    }
                }
            ], function (err, result) {
                if (err)
                    return res.serverError(err);
                var version = {};
                var act = new Array();
                for (var i = 0; i < result.length; i++) {
                    var temp = result[i];
                    if (temp.testver in version) {
                        if (temp.activity in version[temp.testver]) {
                            version[temp.testver][temp.activity] = version[temp.testver][temp.activity] + temp.time;
                        }
                        else {
                            version[temp.testver][temp.activity] = temp.time;
                            if (act.indexOf(temp.activity) < 0) {
                                act.push(temp.activity);
                            }
                        }
                    }
                    else {
                        version[temp.testver] = {};
                        version[temp.testver]["testver"] = temp.testver;
                        version[temp.testver][temp.activity] = temp.time;
                    }
                }
                for (var ver in version) {
                    var temp = version[ver];
                    for (var i = 0; i < act.length; ++i) {
                        var key = act[i];
                        if (!(key in temp)) {
                            temp[key] = 0;
                        }
                    }
                    version[ver] = temp;
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
    TimeController.prototype.circle = function (req, res) {
        var tracker;
        Ticket.native(function (err, collection) {
            collection.aggregate([
                {
                    $match: {
                        tracker: "出荷前バグ"
                    }
                },
                {
                    $group: {
                        _id: "$testver",
                        "count": { $sum: 1 }
                    }
                }
            ], function (err, result) {
                if (err)
                    return res.serverError(err);
                var version = {};
                for (var i = 0; i < result.length; i++) {
                    var temp = result[i];
                    version[temp._id] = {};
                    version[temp._id]["testver"] = temp._id;
                    version[temp._id]["count"] = temp.count;
                }
                tracker = version;
            });
        });
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
                    $project: {
                        "id": 1,
                        "testver": 1,
                        "tracker": 1,
                        "activity": "$times.activity",
                        "time": "$times.time",
                        "_id": 0
                    }
                }
            ], function (err, result) {
                if (err)
                    return res.serverError(err);
                var version = {};
                var id = new Array();
                for (var i = 0; i < result.length; i++) {
                    var temp = result[i];
                    if (id.indexOf(temp.id) >= 0) {
                        continue;
                    }
                    if (temp.testver in version) {
                        if (temp.activity == "テスト") {
                            version[temp.testver]["time"] += temp.time;
                        }
                    }
                    else {
                        version[temp.testver] = {};
                        version[temp.testver]["testver"] = temp.testver;
                        if (temp.testver in tracker) {
                            version[temp.testver]["count"] = tracker[temp.testver]["count"];
                        }
                        else {
                            version[temp.testver]["count"] = 0;
                        }
                        version[temp.testver]["time"] = 0;
                        if (temp.activity == "テスト") {
                            version[temp.testver]["time"] += temp.time;
                        }
                    }
                    id.push(temp.id);
                }
                var results = Array();
                for (var ver in version) {
                    if ((version[ver]["count"] == 0) || (version[ver]["time"] == 0)) {
                        continue;
                    }
                    version[ver]["ratio"] = version[ver]["count"] / version[ver]["time"];
                    results.push(version[ver]);
                }
                res.ok(results);
            });
        });
        return;
    };
    return TimeController;
}());
module.exports = new TimeController();
