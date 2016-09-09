/// <reference path="BaseController.ts" />
/// <reference path="../typings/app.d.ts" />
import base = require("./BaseController");

class CategoryController extends base.BaseController {

  category(req, res): () => void {

    Category.native(function(err, collection) {
      collection.drop(function(err, response) {

        Ticket.native(function(err, collection) {
          collection.aggregate(
            [{
              $project: {
                "category": 1,
                "tracker": 1,
                "_id":0
              }
            }],
            function(err, result) {
              if (err) return res.serverError(err);

              var results = {};
              var tracker = new Array();
              for (var i = 0; i < result.length; i++) {
                var temp = result[i];
                if (temp.category in results) {
                  if (temp.tracker in results[temp.category]['values']) {
                    results[temp.category]['values'][temp.tracker] += 1;
                    results[temp.category]["total"] += 1;
                  } else {
                    results[temp.category]['values'][temp.tracker] = 1;
                    results[temp.category]["total"] += 1;
                    if (tracker.indexOf(temp.tracker) < 0) {
                      tracker.push(temp.tracker);
                    }
                  }
                } else {
                  results[temp.category] = {};
                  results[temp.category]['values'] = {};
                  results[temp.category]["title"] = temp.category;
                  results[temp.category]["total"] = 0;
                }
              }

              for (var cat in results) {
                var trackervalue = new Array();
                var temp = results[cat]['values'];
                for (var i = 0; i < tracker.length; ++i) {
                  var key = tracker[i];
                  if (!(key in temp)) {
                    temp[key] = 0;
                  }
                  var parts = {};
                  parts.name = key;
                  parts.value = temp[key];
                  trackervalue.push(parts);
                }
                trackervalue.sort(function(a, b) {
                  if (a.name < b.name) return -1;
                  if (a.name > b.name) return 1;
                  return 0;
                });
                results[cat]['values'] = trackervalue;
              }
              for (var cat in results) {
                 Category.create(results[cat]).exec(function(err, activity) {});
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
  	Category.native(function(err, collection) {
  		collection.aggregate(
        [{
          $project: {
            "values": 1,
            "total": 1,
            "title": 1,
            "_id":0
          }
        }],
        function(err, results) {
        	if (err) return res.serverError(err);

        	var result = new Object();
        	result['category'] = results;
        	res.ok(result);
        }
      )
    });
  	return;
  }
}
export = new CategoryController();