/// <reference path="../typings/app.d.ts" />

class TimeController {

  activity(req, res): () => void {
    Ticket.native(function(err, collection) {
      collection.aggregate(
		[
		  {$lookup: {
		      from: 'time', // どのコレクションを結合するか
		      localField: 'id', // 集計対象のコレクション (hitting_stats) のどのフィールド？
		      foreignField: 'id', // 結合対象のコレクション (player) のどのフィールド？
		      as: 'times' // 集計対象のコレクションのなんというフィールドをキーとして結合する？
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
export = new TimeController();