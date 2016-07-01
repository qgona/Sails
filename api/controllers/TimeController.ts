/// <reference path="../typings/app.d.ts" />

class TimeController {

	activity(req, res): () => void {
		Ticket.native(function(err, collection) {
		  collection.aggregate(
			[
				{
					$lookup: {
			      		from: 'time', // どのコレクションを結合するか
			      		localField: 'id', // 集計対象のコレクション (hitting_stats) のどのフィールド？
			      		foreignField: 'id', // 結合対象のコレクション (player) のどのフィールド？
			      		as: 'times' // 集計対象のコレクションのなんというフィールドをキーとして結合する？
			    	}
				},
				{
					$unwind: "$times"
				},
				{
					$project: {
						"testver": 1,
						"activity": "$times.activity",
						"time": "$times.time",
						"_id":0
					}
				}
			],
		    function(err, result) {
				if (err) return res.serverError(err);
				var version = {};
				var act = new Array();
				for (var i = 0; i < result.length; i++) {
					var temp = result[i];
					if (temp.testver in version) {
						if (temp.activity in version[temp.testver]) {
							version[temp.testver][temp.activity] = version[temp.testver][temp.activity] + temp.time;
							version[temp.testver]["totaltime"] = version[temp.testver]["totaltime"] + temp.time;
						} else {
							version[temp.testver][temp.activity] = temp.time;
							version[temp.testver]["totaltime"] = version[temp.testver]["totaltime"] + temp.time;
							if (act.indexOf(temp.activity) < 0) {
								act.push(temp.activity);
							}
						}
					} else {
						version[temp.testver] = {};
						version[temp.testver]["testver"] = temp.testver;
						version[temp.testver][temp.activity] = temp.time;
						version[temp.testver]["totaltime"] = 0;
					}
				}

				for (var ver in version) {
					var temp = version[ver];
					for (var i = 0; i < act.length; ++i) {
						var key = act[i];
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

	active(req, res): () => void {
		Time.native(function(err, collection) {
			collection.aggregate([
				{
					$group: {
						_id: "$date",
						"time": { $sum: "$time" }
					}
				}],
				function(err, result) {
					if (err) return res.serverError(err);
					var version = {};
					for (var i = 0; i < result.length; i++) {
						var temp = result[i];
						temp._id.replace(/\//g, "");
						version[temp._id] = {};
						version[temp._id]["date"] = temp._id;
						version[temp._id]["time"] = temp.time;
					}
					var results = Array();
					for (var ver in version) {
						results.push(version[ver]);
					}
					results.sort(function(a, b) {
						if (Date.parse(a.date) < Date.parse(b.date)) return -1;
						if (Date.parse(a.date) > Date.parse(b.date)) return 1;
						return 0;
					});
					res.ok(results);
				}
			)
		})
	}

	activityarea(req, res): () => void {
		Ticket.native(function(err, collection) {
			collection.aggregate(
				[
					{
						$lookup: {
							from: 'time', // どのコレクションを結合するか
							localField: 'id', // 集計対象のコレクション (hitting_stats) のどのフィールド？
							foreignField: 'id', // 結合対象のコレクション (player) のどのフィールド？
							as: 'times' // 集計対象のコレクションのなんというフィールドをキーとして結合する？
						}
					},
					{
						$unwind: "$times"
					},
					{
						$project: {
							"testver": 1,
							"activity": "$times.activity",
							"time": "$times.time",
							"_id": 0
						}
					}
				],
				function(err, result) {
					if (err) return res.serverError(err);
					var version = {};
					var act = new Array();
					for (var i = 0; i < result.length; i++) {
						var temp = result[i];
						if (temp.testver in version) {
							if (temp.activity in version[temp.testver]) {
								version[temp.testver][temp.activity] = version[temp.testver][temp.activity] + temp.time;
								version[temp.testver]["totaltime"] = version[temp.testver]["totaltime"] + temp.time;
							} else {
								version[temp.testver][temp.activity] = temp.time;
								version[temp.testver]["totaltime"] = version[temp.testver]["totaltime"] + temp.time;
								if (act.indexOf(temp.activity) < 0) {
									act.push(temp.activity);
								}
							}
						} else {
							version[temp.testver] = {};
							version[temp.testver]["testver"] = temp.testver;
							version[temp.testver][temp.activity] = temp.time;
							version[temp.testver]["totaltime"] = temp.time;
						}
					}

					for (var ver in version) {
						var temp = version[ver];
						var total = temp["totaltime"];
						for (var i = 0; i < act.length; ++i) {
							var key = act[i];
							if (!(key in temp)) {
								temp[key] = 0;
							} else {
								temp[key] = temp[key] / total * 100;
							}
						}
						delete temp["totaltime"];
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

	circle(req, res): () => void {
		var tracker;
		Ticket.native(function(err, collection) {
			collection.aggregate(
				[
					{
						$match: {
							tracker: "出荷前バグ"
						}
					},
					{
						$group: {
							_id: "$testver",
							"count": { $sum: 1 }
						}
					}
				],
				function(err, result) {
					if (err) return res.serverError(err);
					var version = {};
					for (var i = 0; i < result.length; i++) {
						var temp = result[i];
						version[temp._id] = {};
						version[temp._id]["testver"] = temp._id;
						version[temp._id]["count"] = temp.count;
					}
					tracker = version;
				}
			)
		})

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
						$project: {
							"id": 1,
							"testver": 1,
							"tracker": 1,
							"activity": "$times.activity",
							"time": "$times.time",
							"_id": 0
						}
					}
				],
				function(err, result) {
					if (err) return res.serverError(err);
					var version = {};
					var id = new Array();
					for (var i = 0; i < result.length; i++) {
						var temp = result[i];
						if (id.indexOf(temp.id) >= 0) { continue; }
						if (temp.testver in version) {
							if (temp.activity == "テスト") {
								version[temp.testver]["time"] += temp.time;
							}
						} else {
							version[temp.testver] = {};
							version[temp.testver]["testver"] = temp.testver;
							if (temp.testver in tracker) {
								version[temp.testver]["count"] = tracker[temp.testver]["count"];
							} else {
								version[temp.testver]["count"] = 0;
							}
							version[temp.testver]["time"] = 0;
							if (temp.activity == "テスト") {
								version[temp.testver]["time"] += temp.time;
							}
						}
						id.push(temp.id);
					}
					var results = Array();
					for (var ver in version) {
						if ((version[ver]["count"] == 0) || (version[ver]["time"] == 0)) { continue; }
						version[ver]["ratio"] = version[ver]["count"] / version[ver]["time"];
						results.push(version[ver]);
					}
					res.ok(results);
				}
			)
		})
		return;
	}
}
export = new TimeController();