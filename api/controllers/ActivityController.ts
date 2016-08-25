/// <reference path="BaseController.ts" />
/// <reference path="../typings/app.d.ts" />
import base = require("./BaseController");

class ActivityController extends base.BaseController {
  findall(req, res): () => void {
      Activity.find().exec(function (err, results) {
        var result = {}
        result['activity'] = results;
        res.ok(result);
      });
      return;
  }
}
export = new ActivityController();