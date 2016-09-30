/// <reference path="BaseController.ts" />
/// <reference path="../typings/app.d.ts" />
import base = require("./BaseController");

class ActivityController extends base.BaseController {

  regist(req, res): () => void {

    //Activityをドロップ
    Activity.native(function(err, collection) {
      collection.drop(function(err, response) {
        Ticket.native(function(err, collection) {
          collection.aggregate(
            [{
              $lookup: {
                from: 'time', // どのコレクションを結合するか
                localField: 'ticket', // 集計対象のコレクション (hitting_stats) のどのフィールド？
                 foreignField: 'ticket', // 結合対象のコレクション (player) のどのフィールド？
                 as: 'times' // 集計対象のコレクションのなんというフィールドをキーとして結合する？
               }
            },
            { $unwind: "$times" },
            {
              $project: {
                "testver": 1,
                "activity": "$times.activity",
                "time": "$times.hours",
                "_id":0
              }
            }],
            function(err, result) {
              if (err) return res.serverError(err);

              var version = {};
              var activity = new Array();
              for (var i = 0; i < result.length; i++) {
                var temp = result[i];
                if (temp.testver in version) {
                  if (temp.activity in version[temp.testver]['values']) {
                    version[temp.testver]['values'][temp.activity] = version[temp.testver]['values'][temp.activity] + temp.time;
                    version[temp.testver]["total"] = version[temp.testver]["total"] + temp.time;
                  } else {
                    version[temp.testver]['values'][temp.activity] = temp.time;
                    version[temp.testver]["total"] = version[temp.testver]["total"] + temp.time;
                    if (activity.indexOf(temp.activity) < 0) {
                      activity.push(temp.activity);
                    }
                  }
                } else {
                  version[temp.testver] = {};
                  version[temp.testver]['values'] = {};
                  version[temp.testver]["title"] = temp.testver;
                  version[temp.testver]['values'][temp.activity] = temp.time;
                  version[temp.testver]["total"] = 0;
                }
              }

              for (var ver in version) {
                var actvalue = new Array();
                var temp = version[ver]['values'];
                for (var i = 0; i < activity.length; ++i) {
                  var key = activity[i];
                  if (!(key in temp)) {
                    temp[key] = 0;
                  }
                  var parts = {};
                  parts.name = key;
                  parts.value = temp[key];
                  actvalue.push(parts);
                }
                actvalue.sort(function(a, b) {
                  if (a.name < b.name) return -1;
                  if (a.name > b.name) return 1;
                  return 0;
                });
                version[ver]['values'] = actvalue;
              }
              for (var ver in version) {
                 Activity.create(version[ver]).exec(function(err, activity) {});
              }
              res.ok();
            }
          )
        });
      });
    });
  	return;
  }

  findall(req, res): () => void {
  	Activity.native(function(err, collection) {
  		collection.aggregate(
        [{
  				$lookup: {
			  		from: 'version', // どのコレクションを結合するか
			  		localField: 'title', // 集計対象のコレクション (hitting_stats) のどのフィールド？
			   		foreignField: 'version', // 結合対象のコレクション (player) のどのフィールド？
			   		as: 'ver' // 集計対象のコレクションのなんというフィールドをキーとして結合する？
			   	}
        },
        { $unwind: "$ver" },
        {
          $project: {
            "values": 1,
            "total": 1,
            "title": "$ver.name",
            "_id":0
          }
        }],
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

  scatter(req, res): () => void {
    Activity.native(function(err, collection) {
      collection.aggregate(
        [{
          $lookup: {
            from: 'version', // どのコレクションを結合するか
            localField: 'title', // 集計対象のコレクション (hitting_stats) のどのフィールド？
            foreignField: 'version', // 結合対象のコレクション (player) のどのフィールド？
            as: 'ver' // 集計対象のコレクションのなんというフィールドをキーとして結合する？
          }
        },
        { $unwind: "$ver" },
        {
          $project: {
            "values": 1,
            "total": 1,
            "title": "$ver.name",
            "_id":0
          }
        }],
        function(err, results) {
          if (err) return res.serverError(err);

            for (var i = 0; i < results.length; i++) {
              var temp = results[i];
              for (var j = 0; j < temp.values.length; j++) {
                var act = temp.values[j];
                temp[act.name] = act.value;
              }
              delete temp.values;
              results[i] = temp;
            }

            var result = new Object();
            result['activity'] = results;
            res.ok(result);
        }
      )
    });
    return;
  }
}
export = new ActivityController();