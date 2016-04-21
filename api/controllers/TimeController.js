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
    return TimeController;
}());
module.exports = new TimeController();
