/// <reference path="BaseController.ts" />
import base = require("./BaseController");

class TicketController extends base.BaseController {

  //テスト対象バージョン
  testver(req, res) {
    super.GetDistinctList(res, Ticket, "testver");
  }

  //メンバー
  member(req, res) {
    // super.GetDistinctList(res, Ticket, "member");
    var job = require('../../services/redmine.js');
    job.registMember();
  }

  tracker(req, res): () => void {
    Ticket.native(function(err, collection) {
      var param = req.param("testver", "");
      if (param == "") {
        collection.aggregate(
          [{
            "$group": {
              "_id": "$tracker",
              "total": { "$sum": 1 }
            }
          }],
          function(err, result) {
            if (err) return res.serverError(err);
            res.ok(result);
          })
      } else {
        collection.aggregate(
          [
          {
            $match:
            { "testver": param }
          },
          {
            "$group": {
              "_id": "$tracker",
              "total": { "$sum": 1 }
            }
          }],
          function(err, result) {
            if (err) return res.serverError(err);
            res.ok(result);
          })
      }
    })
    return;
  }

  trackerbytestver(req, res): () => void {
    Ticket.native(function(err, collection) {
      collection.aggregate(
        [{
          "$group": {
            "_id": "$tracker",
            "total": { "$sum": 1 }
          }
        }],
        function(err, result) {
          if (err) return res.serverError(err);
          res.ok(result);
        })
    })
    return;
  }

  bugmember(req, res): () => void {
    Ticket.native(function(err, collection) {
      collection.aggregate(
        [{
          "$group": {
            "_id": "$bugmember",
            "total": { "$sum": 1 }
          }
        }],
        function(err, result) {
          if (err) return res.serverError(err);
          res.ok(result);
        })
    })
    return;
  }

  deziebyuser(req, res): () => void {
    Ticket.native(function(err, collection) {
      collection.aggregate(
        [
        {
          $match: {
            "author" : "Dezie Cybouzu"
          }
        },
        {
          $group: {
            "_id": "$deziecreateuser",
            "total": { "$sum": 1 }
          }
        }
        ],
        function(err, result) {
          if (err) return res.serverError(err);

          var results = new Object();
          results['dezieusser'] = result;
          res.ok(results);
        })
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
            as: 'times'}
          },
          { $unwind: "$times" },
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
          }],
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

  findall(req, res): () => void {
    Ticket.native(function(err, collection) {
      collection.aggregate(
        [

        { $match: { bugver: { $ne: ""} } },
        { $match: { bugver: { $ne: null} } },
        {
          $lookup: {
            from: 'member',
            localField: 'bugmember',
            foreignField: '_id',
            as: 'user'
          }
        }
        ],
        function(err, results) {
          if (err) return res.serverError(err);

          var result = new Object();
          result['activity'] = results;
          res.ok(result);
        }
        )
    });
    return;
  }

  bugbyMember(req, res): () => void {
    Ticket.native(function(err, collection) {
      collection.aggregate(
        [
        { $match: { bugmember: { $ne: ""} } },
        { $match: { bugmember: { $ne: null} } },
        {
          $lookup: {
            from: 'member',
            localField: 'bugmember',
            foreignField: 'memberid',
            as: 'user'
          }
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: 'version',
            localField: 'bugver',
            foreignField: 'version',
            as: 'ver'
          }
        },
        { $unwind: "$ver" },
        {
          $project: {
            member: "$user.name",
            version: "$ver.name",
            subject: 1,
            bugver: 1,
            bugreason: 1,
            bugarea: 1,
            bugkind: 1
          }
        },
        {
          $group: {
            "_id":  { member: "$member", bugreason: "$bugreason"},
            "total": { "$sum": 1 }
          }
        },
        { $sort : { _id : -1} },
        {
          $project: {
            _id: 0,
            member: "$_id.member",
            bugreason: "$_id.bugreason",
            total: 1

          }
        }
        ],
        function(err, result) {
          if (err) return res.serverError(err);

          var results = {};
          var bugreason = new Array();
          for (var i = 0; i < result.length; i++) {
            var temp = result[i];
            if (temp.member in results) {
              results[temp.member]['values'][temp.bugreason] = temp.total;
            } else {
              results[temp.member] = {};
              results[temp.member]['values'] = {};
              results[temp.member]['values'][temp.bugreason] = temp.total;
            }
            if (bugreason.indexOf(temp.bugreason) < 0) {
              bugreason.push(temp.bugreason);
            }
          }
          for (var member in results) {
            var temp = results[member]['values'];
            for (var i = 0; i < bugreason.length; ++i) {
              var key = bugreason[i];
              if (!(key in temp)) {
                temp[key] = 0;
              }
            }
            results[member]['values'] = temp;
          }
          var response = new Array();
          for (var member in results) {
            results[member]['values']["title"] = member;
            response.push(results[member]['values']);
          }
          var respond = new Object();
          respond['bug'] = response;
          res.ok(respond);
        }
        )
    });
    return;
  }

  bugbyCategory(req, res): () => void {
    Ticket.native(function(err, collection) {
      collection.aggregate(
        [

          { $match: { bugmember: { $ne: ""} } },
          { $match: { bugmember: { $ne: null} } },
          {
            $lookup: {
                from: 'member',
                localField: 'bugmember',
                foreignField: 'memberid',
                as: 'user'
            }
          },
          { $unwind: "$user" },
          {
            $lookup: {
                from: 'version',
                localField: 'bugver',
                foreignField: 'version',
                as: 'ver'
            }
          },
          { $unwind: "$ver" },
          {
            $project: {
                member: "$user.name",
                version: "$ver.name",
                category: 1,
                bugver: 1,
                bugreason: 1,
                bugarea: 1,
                bugkind: 1

            }
          },
          {
              $group: {
                "_id":  { category: "$category", bugreason: "$bugreason"},
                "total": { "$sum": 1 }
              }
          },
          { $sort : { _id : -1} },
          {
            $project: {
                _id: 0,
                category: "$_id.category",
                bugreason: "$_id.bugreason",
                total: 1

            }
          },
        ],
        function(err, result) {
          if (err) return res.serverError(err);

          var results = {};
          var bugreason = new Array();
          for (var i = 0; i < result.length; i++) {
            var temp = result[i];
            if (temp.category in results) {
              results[temp.category]['values'][temp.bugreason] = temp.total;
            } else {
              results[temp.category] = {};
              results[temp.category]['values'] = {};
              results[temp.category]['values'][temp.bugreason] = temp.total;
            }
            if (bugreason.indexOf(temp.bugreason) < 0) {
              bugreason.push(temp.bugreason);
            }
          }
          for (var category in results) {
            var temp = results[category]['values'];
            for (var i = 0; i < bugreason.length; ++i) {
              var key = bugreason[i];
              if (!(key in temp)) {
                temp[key] = 0;
              }
            }
            results[category]['values'] = temp;
          }
          var response = new Array();
          for (var category in results) {
            results[category]['values']["title"] = category;
            response.push(results[category]['values']);
          }
          var respond = new Object();
          respond['bug'] = response;
          res.ok(respond);
        }
        )
    });
    return;
  }
}
export = new TicketController();