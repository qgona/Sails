/// <reference path="../typings/app.d.ts" />

class TicketController {

  find(req, res) {
    Ticket.find().then(hoges => {
      res.view('hogepage', hoges);
    });
  }

  findOne(req, res) {
    Ticket.find().then(hoges => {
      res.send(hoges);
    });
  }

  testver(req, res) {
    Ticket.native(function(err, collection) {
      collection.distinct("testver", function(err, result) {
        var results = Array();
        for (var i = 0; i < result.length; i++) {
          var testver = {};
          testver["name"] = result[i];
          results.push(testver);
        }
        res.ok(results);
      });
    });
    return;
  }


  tracker(req, res): () => void {
    Ticket.native(function(err, collection) {
      collection.aggregate(
        [
        {
          "$group": {
            "_id": "$tracker",
            "total": { "$sum": 1 }
          }
        }
        ],
        function(err, result) {
          if (err) return res.serverError(err);
          res.ok(result);
        }
        )
    })
    return;
  }

  bugdensity(req, res): () => void {
    Ticket.native(function(err, collection) {
      collection.aggregate(
        [
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
            "count": { $sum: 1 }
          }
        },
        {
          $group: {
            _id: "$id",
            "count": { $sum: 1 }
          }
        }
        ],
        function(err, result) {
          if (err) return res.serverError(err);
          var version = {};
          for (var i = 0; i < result.length; i++) {
            var temp = result[i];
            if (temp.testver in version) {
              if (temp.activity in version[temp.testver]) {
                version[temp.testver][temp.activity] = version[temp.testver][temp.activity] + temp.time;
              } else {
                version[temp.testver][temp.activity] = temp.time;
              }
            } else {
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
        }
        )
    })
    return;
  }

  trackver(req, res): () => void {
    Ticket.native(function(err, collection) {
      collection.aggregate(
        [
        {
          $project: {
            "id": 1,
            "testver": 1,
            "tracker": 1,
            "_id": 0
          }
        }
        ],
        function(err, result) {
          if (err) return res.serverError(err);
          var version = {};
          var tracker = new Array();
          for (var i = 0; i < result.length; i++) {
            var temp = result[i];
            if (temp.testver == "") { continue; }
            if (temp.testver in version) {
              if (temp.tracker in version[temp.testver]) {
                version[temp.testver][temp.tracker] += 1;
              } else {
                version[temp.testver][temp.tracker] = 1;
                if (tracker.indexOf(temp.tracker) < 0) {
                  tracker.push(temp.tracker);
                }
              }
            } else {
              version[temp.testver] = {};
              version[temp.testver]["testver"] = temp.testver;
              version[temp.testver][temp.tracker] = 0;
            }
          }

          for (var ver in version) {
            var temp = version[ver];
            for (var i = 0; i < tracker.length; ++i) {
              var key = tracker[i];
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
        }
        )
    })
    return;
  }


  findTwo(req, res) {
    Ticket.native(function(err, collection) {

      collection.aggregate(
        [
        {
          "$group": {
            "_id": "$subject",
            "total": { "$sum": 1 }
          }
        }
        ],
        function(err, result) {
          if (err) return res.serverError(err);
          res.ok(result);
        }
        )
    })
  }
}
export = new TicketController();