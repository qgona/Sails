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
    this.dropVersion()
    .then(() => {
      //バージョン取得
      this.insertVersion(version)
      .then(() => {
        //チケット取得
        this.getTicketTime();
      });
    });
  }

  registMember() {
    var member = {
      offset : 0,
      limit : 100,
      count : 0,
      total : 0
    };

    this.dropMember()
    .then(() => {
      this.insertMember(member)
      .then(() => {
      });
    });
  }


  dropVersion():Promise<any> {
    return new Promise((resolve,reject) => {
      Version.native(function(err, collection) {
        collection.drop(function(err, response) {
          sails.log('drop version');
          resolve();
        });
      });
    });
  }

  insertVersion(param):Promise<any> {
    return new Promise((resolve,reject) => {
      sails.log('start');
      sails.log('offset:' + param.offset);
      sails.log('total:' + param.total);
      if (param.offset > param.total) {
        sails.log('end');
        return;
      }
      this.getVersion(param)
      .then(() => {
        this.insertVersion(param);
        resolve();
      });
    });
  }

  getVersion(param):Promise<any> {
    return new Promise((resolve,reject) => {
      var http = require('http');
      var options = {
        host: 'dev-redmine.being.group',
        port: 80,
        path: '/projects/gaia9/versions.json?key=9e2f1ffa4b416966cada7e2fbc7ea889576ea9fa',
        method: 'GET'
      };
      sails.log(options.path);

      http.request(options, (response) => {
        var responseData = '';
        response.setEncoding('utf8');
        response.on('data', (data) => {
          responseData += data;
        });
        response.once('error', (err) => {
          reject(err);
        });
        response.on('end', () => {
          try {
            var data = JSON.parse(responseData);
            param.total = data.total_count;
            this.addVersion(param, data);
            resolve();
          } catch (e) {
            sails.log(e);
            reject(e);
          }
        });
      }).end();
      resolve();
    });
  }

  addVersion(param, data) {
    try {
      var verArray = new Array();
      for (var i = 0; i < data.versions.length; i++){
        var version = new Object();
        this.setVersion(version, data.versions[i]);
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

  setVersion(dest, src): Object {
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

  getTicketTime() {
    var ticket = {
      offset : 0,  //ページ数
      limit : 100,  //ページあたり表示数
      count : 0,  //データ取得数
      total : 0  //データ合計数
    };
    var time = {
      offset : 0,  //ページ数
      limit : 100,  //ページあたり表示数
      count : 0,  //データ取得数
      total : 0  //データ合計数
    };

    this.dropTicket()
    .then(() => {
      this.insertTicket(ticket)
      .then(() => {
        this.dropTime()
        .then(() => {
          this.insertTime(time)
          .then(() => {
            this.insertTime(time);
          });
        });
      });
    });
  }

  insertTicket(param):Promise<any> {
    return new Promise((resolve,reject) => {
      var that = this;
      sails.log('start');
      sails.log('offset:' + param.offset);
      sails.log('total:' + param.total);
      if (param.offset > param.total) {
        sails.log('end');
        return;
      }
      this.getTicket(param)
      .then(() => {
        this.insertTicket(param);
      });
      resolve();
    });
  }

  dropTicket():Promise<any> {
    return new Promise((resolve,reject) => {
      Ticket.native(function(err, collection) {
        collection.drop(function(err, response) {
          sails.log('drop ticket');
          resolve();
        });
      });
    });
  }

  getTicket(param):Promise<any> {
    return new Promise((resolve,reject) => {
      var http = require('http');
      var options = {
        host: 'dev-redmine.being.group',
        port: 80,
        path: '/projects/gaia9/issues.json?query_id=2200&columns=&description=1&key=9e2f1ffa4b416966cada7e2fbc7ea889576ea9fa&offset=' + param.offset + '&limit=' + param.limit,
        method: 'GET'
      };
      sails.log(options.path);

      http.request(options, (response) => {
        var responseData = '';
        response.setEncoding('utf8');
        response.on('data', (data) => {
          responseData += data;
        });
        response.once('error', (err) => {
          reject(err);
        });
        response.on('end', () => {
          try {
            var data = JSON.parse(responseData);
            param.total = data.total_count;
            this.addTicket(param, data);
            resolve();
          } catch (e) {
            sails.log(e);
            reject(e);
          }
        });
      }).end();
      resolve();
    });
  }

  addTicket(param, data) {
    try {
      var ticketArray = new Array();
      for (var i = 0; i < data.issues.length; i++){
        var ticket = new Object();
        this.setTicket(ticket, data.issues[i]);
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

  setTicket(dest, src): Object {
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
        if (dest.sp != "") {
          dest.sp = 0;
        } else {
          dest.sp = Number(field.value);
        }
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

  insertTime(param):Promise<any> {
    return new Promise((resolve,reject) => {
      var that = this;
      sails.log('start');
      sails.log('offset:' + param.offset);
      sails.log('total:' + param.total);
      if (param.offset > param.total) {
        sails.log('end');
        return;
      }
      this.getTime(param)
      .then(() => {
        this.insertTime(param)
      });
      resolve();
    });
  }

  dropTime():Promise<any> {
    return new Promise((resolve,reject) => {
      Time.native(function(err, collection) {
        collection.drop(function(err, response) {
          sails.log('drop time');
          resolve();
        });
      });
    });
  }

  getTime(param):Promise<any> {
    return new Promise((resolve,reject) => {
      var http = require('http');
      var options = {
        host: 'dev-redmine.being.group',
        port: 80,
        path: '/time_entries.json?key=9e2f1ffa4b416966cada7e2fbc7ea889576ea9fa&offset=' + param.offset + '&limit=' + param.limit,
        method: 'GET'
      };
      sails.log(options.path);

      http.request(options, (response) => {
        var responseData = '';
        response.setEncoding('utf8');
        response.on('data', (data) => {
          responseData += data;
        });
        response.once('error', (err) => {
          reject(err);
        });
        response.on('end', () => {
          try {
            var data = JSON.parse(responseData);
            param.total = data.total_count;
            this.addTime(param, data);
            resolve();
          } catch (e) {
            sails.log(e);
            reject(e);
          }
        });
      }).end();
      resolve();
    });
  }

  addTime(param, data) {
    try {
      var timeArray = new Array();
      for (var i = 0; i < data.time_entries.length; i++){
        var time = new Object();
        this.setTime(time, data.time_entries[i]);
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

  setTime(dest, src): Object {
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

  dropMember():Promise<any> {
    return new Promise((resolve,reject) => {
      Member.native(function(err, collection) {
        collection.drop(function(err, response) {
          sails.log('drop member');
          resolve();
        });
      });
    });
  }

  insertMember(param):Promise<any> {
    return new Promise((resolve, reject) => {
      sails.log('start');
      sails.log('offset:' + param.offset);
      sails.log('total:' + param.total);
      if (param.offset > param.total) {
        sails.log('end');
        return;
      }
      getMember(param)
      .then(function () {
        insertMember(param);
        resolve();
      });
    });
  }

  getMember(param):Promise<any> {
    return new Promise((resolve, reject) => {
      var http = require('http');
      var options = {
        host: 'dev-redmine.being.group',
        port: 80,
        path: '/projects/gaia9/memberships.json?limit=100&key=9e2f1ffa4b416966cada7e2fbc7ea889576ea9fa',
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
            addMember(param, data);
            resolve();
          } catch (e) {
            sails.log(e);
            reject(e);
          }
        });
      }).end();
      resolve();
    });
  }

  addMember(param, data) {
    try {
      var memberArray = new Array();
      for (var i = 0; i < data.memberships.length; i++){
        var member = new Object();
        var item = data.memberships[i];
        if (!item.user) continue;
        this.setMember(member, data.memberships[i]);
        memberArray.push(member);
      }

      for (var i = 0; i < memberArray.length; i++){
        var item = new Object();
        item = memberArray[i];
        Member.create(item).exec(
            function(err, result) {}
        );
      }
      param.offset = param.offset + param.limit;
      param.count = param.count + memberArray.length;
    } catch (e) {
      sails.log(e);
    }
  }

  setMember(dest, src): Object {
    dest.memberid = String(src.user.id);
    dest.name = src.user.name;
    return dest;
  }

  insertTicketTime() {
    Ticket.native(function(err, collection) {
      collection.aggregate(
        [
          {
            $lookup: {
            from: 'time',
            localField: 'id',
            foreignField: 'id',
            as: 'times'}
          },
          { $unwind: "$times" }
        ],
        function(err, result) {
          if (err) return res.serverError(err);
          for (var i = 0; i < result.length; i++) {
            TicketTime.create(result[i]).exec(function(err, tickettime) {});
          }
        }
      )
    })
    return;
  }
}
export = new Redmine();
