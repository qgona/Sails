"use strict";
var TimeController = (function () {
    function TimeController() {
    }
    TimeController.prototype.activity = function (req, res) {
        Ticket.native(function (err, collection) {
            collection.aggregate([
                { $lookup: {
                        from: 'time',
                        localField: 'id',
                        foreignField: 'id',
                        as: 'times'
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
    return TimeController;
}());
module.exports = new TimeController();
