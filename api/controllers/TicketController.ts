/// <reference path="../typings/app.d.ts" />

class TicketController {

  find(req, res) {
    Ticket.find().then(hoges => {
      res.view('hogepage', hoges);
    });
  }

  findOne(req, res) {
    Ticket.find().then(hoges => {
      res.send(hoges);
    });
  }

  tracker(req, res): () => void {
    Ticket.native(function(err, collection) {
      collection.aggregate(
        [
          {
            "$group": {
              "_id": "$tracker",
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
}
export = new TicketController();