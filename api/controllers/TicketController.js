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
