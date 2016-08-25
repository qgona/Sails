/// <reference path="../typings/app.d.ts" />

class CommitController {

	all(req, res): () => void {
		Commit.native(function(err, collection) {
			collection.aggregate(
				[
					{
						$unwind: "$changes"
					},
                	{
                    	$match: { "message": { $not: /.*Merge.*/ } }
                	},
                	{
                    	$project: {
	                        "date": "$committer.date",
    	                    "changes": 1,
        	                "_id": 0
            	        }
                	}
				],
				function(err, result) {
					if (err) return res.serverError(err);

					for (var i = 0; i < result.length; i++) {
						var temp = new Date(result[i]["date"] * 1000);
						var year	= temp.getFullYear();
						var month	= ((temp.getMonth() + 1) < 10) ? '0' + (temp.getMonth() + 1) : temp.getMonth() + 1;
						var day		= (temp.getDate() < 10) ? '0' + temp.getDate() : temp.getDate();
						var hour	= (temp.getHours() < 10) ? '0' + temp.getHours() : temp.getHours();
						var min		= (temp.getMinutes() < 10) ? '0' + temp.getMinutes() : temp.getMinutes();
						var sec		= (temp.getSeconds() < 10) ? '0' + temp.getSeconds() : temp.getSeconds();
						result[i]["year"]  = year;
						result[i]["month"] = month;
						result[i]["day"] = day;
						result[i]["date"]  = year + '-' + month + '-' + day;
						result[i]["time"] = hour + ':' + min + ':' + sec;
						result[i]["plus"] = result[i]["changes"]["add"];
						result[i]["minus"] = result[i]["changes"]["del"];
						delete result[i]["changes"];
					}

					var commit = {};
					for (var i = 0; i < result.length; i++) {
						if (!result[i]["plus"]) {
							result[i]["plus"] = 0;
						} else if (result[i]["plus"] === "-") {
							result[i]["plus"] = 0;
						}
						if (!result[i]["minus"]) {
							result[i]["minus"] = 0;
						} else if (result[i]["minus"] === "-") {
							result[i]["minus"] = 0;
						}
						if (result[i]["date"] in commit) {
							commit[result[i]["date"]]["plus"] += result[i]["plus"];
							// commit[result[i]["date"]]["minus"] += result[i]["minus"];
						} else {
							commit[result[i]["date"]] = {};
							commit[result[i]["date"]]["date"] = result[i]["date"];
							commit[result[i]["date"]]["plus"] = result[i]["plus"];
							commit[result[i]["date"]]["minus"] = result[i]["minus"];
						}
					}
					var results = Array();
					for (var item in commit) {
						if (commit[item]["plus"] > 1000) {
							commit[item]["plus"] = 1000;
						}
						results.push(commit[item]);
					}
					results.sort(function(a, b) {
						if (a.date < b.date) return -1;
						if (a.date > b.date) return 1;
						return 0;
					});
					res.ok(results);
				}
			)
		})
		return;
	}

	prepare(req, res): () => void {
		Commit.native(function(err, collection) {
			collection.aggregate(
				[
					{
						$unwind: "$changes"
					},
                	{
                    	$match: { "message": { $not: /.*Merge.*/ } }
                	},
                	{
                    	$project: {
	                        "date": "$committer.date",
    	                    "changes": 1,
        	                "_id": 0
            	        }
                	}
				],
				function(err, result) {
					if (err) return res.serverError(err);

					for (var i = 0; i < result.length; i++) {
						var temp = new Date(result[i]["date"] * 1000);
						var year	= temp.getFullYear();
						var month	= ((temp.getMonth() + 1) < 10) ? '0' + (temp.getMonth() + 1) : temp.getMonth() + 1;
						var day		= (temp.getDate() < 10) ? '0' + temp.getDate() : temp.getDate();
						var hour	= (temp.getHours() < 10) ? '0' + temp.getHours() : temp.getHours();
						var min		= (temp.getMinutes() < 10) ? '0' + temp.getMinutes() : temp.getMinutes();
						var sec		= (temp.getSeconds() < 10) ? '0' + temp.getSeconds() : temp.getSeconds();
						result[i]["year"]  = year;
						result[i]["month"] = month;
						result[i]["day"] = day;
						result[i]["date"]  = year + '-' + month + '-' + day;
						result[i]["time"] = hour + ':' + min + ':' + sec;
						result[i]["plus"] = result[i]["changes"]["add"];
						result[i]["minus"] = result[i]["changes"]["del"];
						delete result[i]["changes"];
					}

					var commit = {};
					for (var i = 0; i < result.length; i++) {
						if (result[i]["year"] != "2016") {
							continue;
						}
						if (result[i]["month"] != "03") {
							continue;
						}

						if (!result[i]["plus"]) {
							result[i]["plus"] = 0;
						} else if (result[i]["plus"] === "-") {
							result[i]["plus"] = 0;
						}
						// if (!result[i]["minus"]) {
						// 	result[i]["minus"] = 0;
						// } else if (result[i]["minus"] === "-") {
						// 	result[i]["minus"] = 0;
						// }
						if (result[i]["date"] in commit) {
							commit[result[i]["date"]]["plus"] += result[i]["plus"];
							// commit[result[i]["date"]]["minus"] += result[i]["minus"];
						} else {
							commit[result[i]["date"]] = {};
							commit[result[i]["date"]]["date"] = result[i]["date"];
							commit[result[i]["date"]]["plus"] = result[i]["plus"];
							// commit[result[i]["date"]]["minus"] = result[i]["minus"];
						}
					}
					var results = Array();
					for (var item in commit) {
						if (commit[item]["plus"] > 1000) {
							commit[item]["plus"] = 1000;
						}
						results.push(commit[item]);
					}
					results.sort(function(a, b) {
						if (a.date < b.date) return -1;
						if (a.date > b.date) return 1;
						return 0;
					});
					res.ok(results);
				}
			)
		})
		return;
	}


	all(req, res): () => void {
		Commit.native(function(err, collection) {
			collection.aggregate(
				[
					{
						$unwind: "$changes"
					},
                	{
                    	$match: { "message": { $not: /.*Merge.*/ } }
                	},
                	{
                    	$project: {
	                        "date": "$committer.date",
    	                    "changes": 1,
        	                "_id": 0
            	        }
                	}
				],
				function(err, result) {
					if (err) return res.serverError(err);

					for (var i = 0; i < result.length; i++) {
						var temp = new Date(result[i]["date"] * 1000);
						var year	= temp.getFullYear();
						var month	= ((temp.getMonth() + 1) < 10) ? '0' + (temp.getMonth() + 1) : temp.getMonth() + 1;
						var day		= (temp.getDate() < 10) ? '0' + temp.getDate() : temp.getDate();
						var hour	= (temp.getHours() < 10) ? '0' + temp.getHours() : temp.getHours();
						var min		= (temp.getMinutes() < 10) ? '0' + temp.getMinutes() : temp.getMinutes();
						var sec		= (temp.getSeconds() < 10) ? '0' + temp.getSeconds() : temp.getSeconds();
						result[i]["year"]  = year;
						result[i]["month"] = month;
						result[i]["day"] = day;
						result[i]["date"]  = year + '-' + month + '-' + day;
						result[i]["time"] = hour + ':' + min + ':' + sec;
						result[i]["plus"] = result[i]["changes"]["add"];
						result[i]["minus"] = result[i]["changes"]["del"];
						delete result[i]["changes"];
					}

					var commit = {};
					for (var i = 0; i < result.length; i++) {
						if (!result[i]["plus"]) {
							result[i]["plus"] = 0;
						} else if (result[i]["plus"] === "-") {
							result[i]["plus"] = 0;
						}
						if (!result[i]["minus"]) {
							result[i]["minus"] = 0;
						} else if (result[i]["minus"] === "-") {
							result[i]["minus"] = 0;
						}
						if (result[i]["date"] in commit) {
							commit[result[i]["date"]]["plus"] += result[i]["plus"];
							// commit[result[i]["date"]]["minus"] += result[i]["minus"];
						} else {
							commit[result[i]["date"]] = {};
							commit[result[i]["date"]]["date"] = result[i]["date"];
							commit[result[i]["date"]]["plus"] = result[i]["plus"];
							commit[result[i]["date"]]["minus"] = result[i]["minus"];
						}
					}
					var results = Array();
					for (var item in commit) {
						if (commit[item]["plus"] > 1000) {
							commit[item]["plus"] = 1000;
						}
						results.push(commit[item]);
					}
					results.sort(function(a, b) {
						if (a.date < b.date) return -1;
						if (a.date > b.date) return 1;
						return 0;
					});
					res.ok(results);
				}
			)
		})
		return;
	}

	lines(req, res): () => void {

		Lines.native(function(err, collection) {
			collection.aggregate(
				[
					{
						$project: {
	                        "date": 1,
    	                    "plus": 1,
    	                    "minus": 1,
        	                "_id": 0
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
}
export = new CommitController();