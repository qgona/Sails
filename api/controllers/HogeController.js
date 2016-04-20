"use strict";
var HogeController = (function () {
    function HogeController() {
    }
    HogeController.prototype.find = function (req, res) {
        Hoge.find().then(function (hoges) {
            res.view('hogepage', hoges);
        });
    };
    HogeController.prototype.findOne = function (req, res) {
        Hoge.find().then(function (hoges) {
            res.send(hoges);
        });
    };
    HogeController.prototype.findTwo = function (req, res) {
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
    return HogeController;
}());
module.exports = new HogeController();
