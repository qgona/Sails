declare var $: any;

class Redmine  {

  getData() {

    var version = {
      offset : 0,  //ページ数
      limit : 100,  //ページあたり表示数
      count : 0,  //データ取得数
      total : 0  //データ合計数
    };
    //バージョン破棄
    dropVersion()
    .then(function () {
      //バージョン取得
      insertVersion(version)
      .then(function () {
        //チケット取得
        // getTicketTime();
      });
    });
  }

  export function dropVersion():Promise<any> {
    return new Promise((resolve,reject) => {
      Version.native(function(err, collection) {
        collection.drop(function(err, response) {
          sails.log('drop version');
          resolve();
        });
      });
    });
  }

  export function insertVersion(param):Promise<any> {
    return new Promise((resolve,reject) => {
      sails.log('start');

      sails.log('offset:' + param.offset);
      sails.log('total:' + param.total);
      if (param.offset > param.total) {
        sails.log('end');
        return;
      }
      getVersion(param)
      .then(function () {
        insertVersion(param);
        resolve();
      });
    });
  }

  export function getVersion(param):Promise<any> {
    return new Promise((resolve,reject) => {
      var http = require('http');
      var options = {
        host: 'dev-redmine.being.group',
        port: 80,
        path: '/projects/gaia9/versions.json?key=9e2f1ffa4b416966cada7e2fbc7ea889576ea9fa',
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
            var data = JSON.parse(responseData);
            param.total = data.total_count;
            addVersion(param, data);
            resolve();
          } catch (e) {
            sails.log(e);
            reject(e);
          }
        });
      }).end();
    });
  }

  export function addVersion(param, data) {
    try {
      var verArray = new Array();
      for (var i = 0; i < data.versions.length; i++){
        var version = new Object();
        setVersion(version, data.versions[i]);
        verArray.push(version);
      }

      for (var i = 0; i < verArray.length; i++){
        var item = new Object();
        item = verArray[i];
        Version.create(item).exec(function(err, activity) {});
      }
      param.offset = param.offset + param.limit;
      param.count = param.count + verArray.length;
    } catch (e) {
      sails.log(e);
    }
  }

  export Object function setVersion(dest, src) {
    dest.version = String(src.id);
    dest.name = src.name;
    dest.project = src.project.name;
    if (src.due_date != null) {
      dest.due_date = src.due_date;
    }
    dest.created_on = new Date(src.created_on);
    dest.updated_on = new Date(src.updated_on);

    for (var i = 0; i < src.custom_fields.length; i++){
      var field = new Object();
      field = src.custom_fields[i];
      switch (field.id) {
        case 58:
        dest.dataupdate = field.value;
        break;
      }
    }
    return dest;
  }

  export function getTicketTime() {

    var ticket = {
      offset : 0,  //ページ数
      limit : 100,  //ページあたり表示数
      count : 0,  //データ取得数
      total : 0  //データ合計数
    };

    dropTicket()
    .then(function () {
      insertTicket(ticket);
    });

    var time = {
      offset : 0,  //ページ数
      limit : 100,  //ページあたり表示数
      count : 0,  //データ取得数
      total : 0  //データ合計数
    };

    dropTime()
    .then(function () {
      insertTime(time);
    });
  }

  export function insertTicket(param) {
    sails.log('start');

    sails.log('offset:' + param.offset);
    sails.log('total:' + param.total);
    if (param.offset > param.total) {
      sails.log('end');
      return;
    }
    getTicket(param)
    .then(function () {
      insertTicket(param);
    });
  }

  export function dropTicket():Promise<any> {
    return new Promise((resolve,reject) => {
      Ticket.native(function(err, collection) {
        collection.drop(function(err, response) {
          sails.log('drop');
          resolve();
        });
      });
    });
  }

  export function getTicket(param):Promise<any> {
    return new Promise((resolve,reject) => {
      var http = require('http');
      var options = {
        host: 'dev-redmine.being.group',
        port: 80,
        path: '/projects/gaia9/issues.json?query_id=2200&columns=&description=1&key=9e2f1ffa4b416966cada7e2fbc7ea889576ea9fa&offset=' + param.offset + '&limit=' + param.limit,
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
            var data = JSON.parse(responseData);
            param.total = data.total_count;
            addTicket(param, data);
            resolve();
          } catch (e) {
            sails.log(e);
            reject(e);
          }
        });
      }).end();
    });
  }

  export function addTicket(param, data) {
    try {
      var ticketArray = new Array();
      for (var i = 0; i < data.issues.length; i++){
        var ticket = new Object();
        setTicket(ticket, data.issues[i]);
        ticketArray.push(ticket);
      }

      for (var i = 0; i < ticketArray.length; i++){
        var item = new Object();
        item = ticketArray[i];
        Ticket.create(item).exec(function(err, activity) {});
      }
      param.offset = param.offset + param.limit;
      param.count = param.count + ticketArray.length;
    } catch (e) {
      sails.log(e);
    }
  }

  export Object function setTicket(dest, src) {
    dest.ticket = src.id;
    dest.subject = src.subject;
    if (src.assigned_to != null && src.assigned_to.name != null) {
      dest.assigned_to = src.assigned_to.name;
    }
    dest.author = src.author.name;
    if (src.category != null && src.category.name != null) {
      dest.category = src.category.name;
    }
    dest.description = src.description;
    dest.status = src.status.name;
    dest.tracker = src.tracker.name;
    dest.project = src.project.name;
    dest.priority = src.priority.name;
    dest.created_on = new Date(src.created_on);
    dest.updated_on = new Date(src.updated_on);

    for (var i = 0; i < src.custom_fields.length; i++){
      var field = new Object();
      field = src.custom_fields[i];
      switch (field.id) {
        case 2:
        dest.importance = field.value;
        break;
        case 3:
        dest.resolve = field.value;
        break;
        case 4:
        dest.tester = field.value;
        break;
        case 4:
        dest.customer = field.value;
        break;
        case 8:
        dest.deziecreateuser = field.value;
        break;
        case 20:
        dest.deziecreated_on = new Date(field.value + ':00');
        break;
        case 10:
        dest.dezieno = field.value;
        break;
        case 22:
        dest.dezieupdateuser = field.value;
        break;
        case 21:
        dest.dezieupdated_on = new Date(field.value + ':00');
        break;
        case 11:
        dest.devcomment = field.value;
        break;
        case 13:
        dest.dezieno = field.value;
        break;
        case 14:
        dest.testver = field.value;
        break;
        case 17:
        dest.location = field.value;
        break;
        case 40:
        dest.isalready = field.value;
        break;
        case 44:
        dest.sp = field.value;
        break;
        case 5:
        dest.bugmember = field.value;
        break;
        case 34:
        dest.fromqa = field.value;
        break;
        case 33:
        dest.callid = field.value;
        break;
        case 72:
        dest.bugver = field.value;
        break;
        case 73:
        dest.bugreason = field.value;
        break;
        case 74:
        dest.bugkind = field.value;
        break;
        case 75:
        dest.bugarea = field.value;
        break;
      }
    }
    return dest;
  }

  export function insertTime(param) {
    sails.log('start');

    sails.log('offset:' + param.offset);
    sails.log('total:' + param.total);
    if (param.offset > param.total) {
      sails.log('end');
      return;
    }
    getTime(param)
    .then(function () {
      insertTime(param)
    });
  }

  export function dropTime():Promise<any> {
    return new Promise((resolve,reject) => {
      Time.native(function(err, collection) {
        collection.drop(function(err, response) {
          sails.log('drop');
          resolve();
        });
      });
    });
  }

  export function getTime(param):Promise<any> {
    return new Promise((resolve,reject) => {
      var http = require('http');
      var options = {
        host: 'dev-redmine.being.group',
        port: 80,
        path: '/time_entries.json?key=9e2f1ffa4b416966cada7e2fbc7ea889576ea9fa&offset=' + param.offset + '&limit=' + param.limit,
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
            var data = JSON.parse(responseData);
            param.total = data.total_count;
            addTime(param, data);
            resolve();
          } catch (e) {
            sails.log(e);
            reject(e);
          }
        });
      }).end();
    });
  }

  export function addTime(param, data) {
    try {
      var timeArray = new Array();
      for (var i = 0; i < data.time_entries.length; i++){
        var time = new Object();
        setTime(time, data.time_entries[i]);
        timeArray.push(time);
      }

      for (var i = 0; i < timeArray.length; i++){
        var item = new Object();
        item = timeArray[i];
        Time.create(item).exec(function(err, activity) {});
      }
      param.offset = param.offset + param.limit;
      param.count = param.count + timeArray.length;
    } catch (e) {
      sails.log(e);
    }
  }

  export Object function setTime(dest, src) {
    dest.activity = src.activity.name;
    dest.user = src.user.name;
    if (src.project != null && src.project.name != null) {
      dest.project = src.project.name;
    }
    if (src.issue != null && src.issue.id != null) {
      dest.ticket = src.issue.id;
    }
    dest.comments = src.comments;
    dest.hours = src.hours;
    dest.date = new Date(src.spent_on);
    dest.created_on = new Date(src.created_on);
    dest.updated_on = new Date(src.updated_on);

    return dest;
  }
}
export = new Redmine();
