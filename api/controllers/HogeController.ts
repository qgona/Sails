class HogeController {

  // hogepageをレンダリングして返すaction
  find(req, res) {
    Hoge.find().then(hoges => {
      res.view('hogepage', hoges);
    });
  }

  // hogesのjsonを返すaction
  findOne(req, res) {
    Hoge.find().then(hoges => {
      res.send(hoges);
    });
  }

  // hogesのjsonを返すaction
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
export = new HogeController();