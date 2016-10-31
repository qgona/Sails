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
    job.getData();
  }

  //メンバー
  registcommit(req, res) {
    // super.GetDistinctList(res, Ticket, "member");
    var job = require('../../services/git.js');
    job.getData();
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
          { $match: { "author" : "Dezie Cybouzu" } },
          { $group: {
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

  bugversion(req, res): () => void {
    var param = req.param("version", "");

    var arr = new Array();
    arr =
    [
        { $lookup: {
            from: 'time',
            localField: 'ticket',
            foreignField: 'ticket',
            as: 'times' }
        },
        { $unwind: "$times" },
        { $project : {
            _id : 0,
            ticket : 1,
            date : {
              $concat: [
                { "$substr": [ { "$year": "$times.date" }, 0, 4 ] },
                '/',
                { "$cond": [
                  { "$lte": [ { "$month": "$times.date" }, 9 ] },
                    { "$concat": [
                      "0",
                      { "$substr": [ { "$month": "$times.date" }, 0, 2 ] },
                    ]},
                  { "$substr": [ { "$month": "$times.date" }, 0, 2 ] }
                ]},
                '/',
                { "$cond": [
                  { "$lte": [ { "$dayOfMonth": "$times.date" }, 9 ] },
                    { "$concat": [
                      "0",
                      { "$substr": [ { "$dayOfMonth": "$times.date" }, 0, 2 ] },
                    ]},
                  { "$substr": [ { "$dayOfMonth": "$times.date" }, 0, 2 ] }
                ]}
              ]
            },
            activity : "$times.activity",
            time : "$times.hours",
            tracker : 1 }
        },
        { $match: { activity : "テスト" } },
        { $sort : { date : 1} }
    ];

    if (param != 'all') {
      arr.unshift({ $match: { testver : param } });
    }

    Ticket.native(function(err, collection) {
      collection.aggregate(
      arr,
      function(err, result_time) {
        if (err) return res.serverError(err);

        var subarr = new Array();
        subarr =
        [
            { $match: { tracker : "出荷前バグ" } },
            { $project : {
                _id : 0,  ticket : 1,
                date : {
                  $concat: [
                    { "$substr": [ { "$year": "$created_on" }, 0, 4 ] },
                    '/',
                    { "$cond": [
                      { "$lte": [ { "$month": "$created_on" }, 9 ] },
                        { "$concat": [
                          "0",
                          { "$substr": [ { "$month": "$created_on" }, 0, 2 ] },
                        ]},
                      { "$substr": [ { "$month": "$created_on" }, 0, 2 ] }
                    ]},
                    '/',
                    { "$cond": [
                      { "$lte": [ { "$dayOfMonth": "$created_on" }, 9 ] },
                        { "$concat": [
                          "0",
                          { "$substr": [ { "$dayOfMonth": "$created_on" }, 0, 2 ] },
                        ]},
                      { "$substr": [ { "$dayOfMonth": "$created_on" }, 0, 2 ] }
                    ]}
                  ]
                }
              }
            },
            { $sort : { date : 1} }
        ];
        if (param != 'all') {
          subarr.unshift({ $match: { testver : param } });
        }

        Ticket.native(function(err, collection) {
          collection.aggregate(
          subarr,
          function(err, result_ticket) {
            if (err) return res.serverError(err);

            var arrDate = new Array();
            var tickets = {};
            for (var i = 0; i < result_ticket.length; i++) {
              var temp = result_ticket[i];
              arrDate.push(new Date(temp.date + ' 00:00:00'));
              if (temp.date in tickets) {
                tickets[temp.date]['Y2'] += 1;
              } else {
                tickets[temp.date] = {};
                tickets[temp.date]['Y2'] = 1;
              }
            }

            var results = {};
            for (var i = 0; i < result_time.length; i++) {
              var temp = result_time[i];
              arrDate.push(new Date(temp.date + ' 00:00:00'));
              if (temp.date in result_time) {
                results[temp.date]['Y1'] += temp.time;
              } else {
                results[temp.date] = {};
                results[temp.date]['X'] = temp.date;
                results[temp.date]['Y1'] = temp.time;
              }
            }

            for (var date in tickets) {
              if (!(date in results)) {
                results[date] = {};
                results[date]['Y1'] = 0;
              }
              results[date]['X'] = date;
              results[date]['Y2'] = tickets[date]['Y2'];
            }

            for (var date in results) {
              if (!(date in tickets)) {
                results[date]['Y2'] = 0;
              }
            }

            var maxDate = new Date(Math.max.apply(null, arrDate));
            var minDate = new Date(Math.min.apply(null, arrDate));
            var valDate = minDate;
            while (valDate.getTime() < maxDate.getTime()) {
                valDate.setDate(valDate.getDate() + 1);
                var year = String(valDate.getFullYear());
                var month = String(valDate.getMonth() + 1);
                if (month.length == 1) {
                  month = '0' + month;
                }
                var day =  String(valDate.getDate());
                if (day.length == 1) {
                  day = '0' + day;
                }
                var strDate = [year, month, day].join( '/' );
                if (!(strDate in results)) {
                  results[strDate] = {};
                  results[strDate]['X'] = strDate;
                  results[temp.date]['Y1'] = 0;
                  results[temp.date]['Y2'] = 0;
                }
            }

            var response = new Array();
            for (var date in results) {
              response.push(results[date]);
            }

            response.sort(function(a, b){
              if(a.X < b.X) return -1;
              if(a.X > b.X) return 1;
              return 0;
            });

            var ticket = 0;
            var time = 0;
            for (var i = 0; i < response.length; i++) {
              if (response[i]['Y2']) {
                ticket += response[i]['Y2'];
              } else {
                response[i]['Y2'] = 0;
              }
              response[i]['Y2TOTAL'] = ticket;

              if (response[i]['Y1']) {
                time += response[i]['Y1'];
              } else {
                response[i]['Y1'] = 0;
              }
              response[i]['Y1TOTAL'] = time;
            }

            for (var i = 0; i < response.length; i++) {
              if (response[i]['Y1TOTAL'] == "0") {
                response[i]['Y2P'] = 0;
              } else {
                response[i]['Y2P'] = response[i]['Y2TOTAL'] / response[i]['Y1TOTAL'];
              }
              if (response[i]['Y2TOTAL'] == "0") {
                response[i]['Y1P'] = 0;
              } else {
                response[i]['Y1P'] = response[i]['Y1TOTAL'] / response[i]['Y2TOTAL'];
              }
            }
            var respond = new Object();
            respond['bug'] = response;
            res.ok(respond);
          })
        });
      })
    });
    return;
  }
}
export = new TicketController();