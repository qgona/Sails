import * as Sails from 'sails';

class TagController {
  'use strict';

  constructor() { }

  find(req: Sails.Request, res: Sails.Response) {
    sails.log.verbose('api::TagController#find');
    sails.log.verbose('params', req.allParams());
    sails.log.verbose(`user=${(req.user ? req.user.id : 'null') }`);

    const page = +req.param('page') || 1;

    TagService.find({
      limit: 30,
      page: page
    }).then((tags) => {

      res.ok(tags);

    }).catch((error) => {
      sails.log.error("api::TagController.find", error);
      res.send(500);
    });
  }
}

export default new TagController();
