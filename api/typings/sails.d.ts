/// <reference path="./express.d.ts" />

declare var sails: Sails.sails;

declare module "sails" {
  import * as express from 'express';

  module s {
    interface Request extends express.Request {
      port: number;
      user: User;
      session: Session;
      sessionID: string;

      allParams(): Object;
      logout();
      file(name: String): any; // TODO file object
    }

    interface Response extends express.Response {
      ok(params: Object | number);
      view(view: string, params?: Object);
      json(params: Object);
    }

    interface Session {
      regenerate(callback: (error) => void);
    }

    interface User {
      id: number;
    }
  }

  export = s;
}

declare module Sails {

  interface sails {
    log: log;
  }

  interface log {
    verbose(...data: any[]);
    error(...data: any[]);
    warn(...data: any[]);
    debug(...data: any[]);
    info(...data: any[]);
    silly(...data: any[]);
  }
}