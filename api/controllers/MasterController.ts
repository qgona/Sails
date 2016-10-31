/// <reference path="../typings/app.d.ts" />

class MasterController {

  months(req, res): () => void {
	var keys = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
	var values = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

	var results = Array();
	for (var i = 0; i < keys.length; i++) {
		var month = {};
		month[keys[i]] = values[i];
		results.push(month);
	}

	var result = {};
	result.months = results;

	res.ok(result);
    return;
  }

  kinds(req, res): () => void {
	var keys = ["activity", "tracker", "menbers"];
	var values = ["活動時間", "トラッカー", "メンバー数"];

	var results = Array();
	for (var i = 0; i < keys.length; i++) {
		var item = {};
		item[keys[i]] = values[i];
		results.push(item);
	}

	var result = {};
	result.kinds = results;

	res.ok(result);
    return;
  }

  version(req, res): () => void {
  	Version.native(function(err, collection) {
  		collection.aggregate(
	        [
    	      {
	            $project: {
    	          value : "$version",
        	      "name": 1,
	              "_id": 0
    	        },
        	  },
        	  {
        	  	$sort: { name : 1 }
        	  }
	        ],
	        function(err, results) {
    	    	if (err) return res.serverError(err);
        		res.ok(results);
        	}
        )
    });
  	return;
  }


  kind(req, res): () => void {
  	var result = {};
	var kyes = {};
	var values = {};
	res.ok(result);
    return;
  }

}
export = new MasterController();