/// <reference path="../typings/app.d.ts" />
export class BaseController {

  //distinctリストを取得する
  protected GetDistinctList(res: Any, model: Any, key: string) {
  	model.native(function(err, collection) {
  		collection.distinct(key, function(err, result) {
  			var results = Array();
  			var record = {};
  			record["value"] = "";
  			results.push(record);
  			for (var i = 0; i < result.length; i++) {
  				if (result[i] == "") { continue; }
  				var record = {};
  				record["value"] = result[i];
  				results.push(record);
  			}
  			results.sort(function(a, b) {
  				if (a.value < b.value) return -1;
  				if (a.value > b.value) return 1;
  				return 0;
  			});
  			res.ok(results);
  		});
  	});
  }
}