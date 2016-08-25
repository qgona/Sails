declare var $: any;

class Redmine  {
  getData() {
    var param = {
      offset : 0,  //ページ数
      limit : 25,  //ページあたり表示数
      count : 0,  //データ取得数
      total : 0  //データ合計数
    };

    //チケットを取得する
    do {
      try {
        sails.log('started');
        getTicket(param)
        .then(function (res) {
          var data = JSON.parse(res);
          sails.log('0');
          addTicket(param, data);
        });
        sails.log('ended');
      } catch (e) {
        sails.log(e);
      }
    } while (param.count < param.total)
  }

  export function getTicket(param):Promise<any> {

    return new Promise((resolve,reject) => {
      Ticket.native(function(err, collection) {
        collection.drop(function(err, response) {
          sails.log('drop');
        });
      });

      var http = require('http');
      var options = {
        host: 'dev-redmine.being.group',
        port: 80,
        path: '/projects/gaia9/issues.json?query_id=2200&key=9e2f1ffa4b416966cada7e2fbc7ea889576ea9fa&offset=' + param.offset + '&limit=' + param.limit,
        method: 'GET'
      };
      sails.log(options.path);

      http.request(options, function(response) {
        var responseData = '';
        response.setEncoding('utf8');

        response.on('data', function(data){
          responseData += data;
        });

        response.once('error', function(err){
          reject(err);
        });

        response.on('end', function(){
          try {
              sails.log('end');
              resolve(responseData);
          } catch (e) {
              sails.log(e);
              reject(e);
          }
        });
      }).end();
    });
  }

  export function addTicket(param, data) {
    // return new Promise((resolve,reject) => {
      sails.log('start');
      try {
        var ticketArray = new Array();
        sails.log('1');
        for (var i = 0; i < data.issues.length; i++){
          sails.log('2');
          var ticket = new Object();
          ticket.id = data.issues[i].id;
          ticket.subject = data.issues[i].subject;
          ticketArray.push(ticket);
        }

        for (var i = 0; i < ticketArray.length; i++){
          var item = new Object();
          item = ticketArray[i];
          Ticket.create(item).exec(function(err, activity) {});
          sails.log('insert');
        }
        param.total = data.total_count;
        param.offset = param.offset + param.limit;
        param.count = param.count + ticketArray.length;
      } catch (e) {
        sails.log(e);
      }
    // });
  }
}
export = new Redmine();

