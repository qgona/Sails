/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'main'
  },

  '/activity': {
    controller: 'js/activity',
    action: 'regist'
  },

  '/multidonuts': {
    view: 'multidonuts'
  },

  '/allcategory': {
    view: 'category'
  },

  '/version': {
    view: 'version'
  },

  '/scatter': {
    view: 'scatter'
  },

  '/lines': {
    controller: 'js/commit',
    action: 'lines'
  },

  '/allactivity': {
    controller: 'js/activity',
    action: 'findall'
  },

  '/categorytracker': {
    controller: 'js/category',
    action: 'findall'
  },

  '/commit': {
    controller: 'js/commit',
    action: 'all'
  },

  '/tracker/:testver': {
    controller: 'js/ticket',
    action: 'tracker'
  },

  '/tracker/testver/:testver': {
    controller: 'js/ticket',
    action: 'trackerbytestver'
  },

  '/testver': {
    controller: 'js/ticket',
    action: 'testver'
  },

  '/member': {
    controller: 'js/ticket',
    action: 'member'
  },

  '/tracker': {
    controller: 'js/ticket',
    action: 'tracker'
  },

  '/activityarea': {
    controller: 'js/time',
    action: 'activityarea'
  },

  '/multiactivity': {
    controller: 'js/time',
    action: 'multiactivity'
  },

  '/activitylist': {
    controller: 'js/time',
    action: 'activitylist'
  },

  '/active': {
    controller: 'js/time',
    action: 'active'
  },

  '/category': {
    controller: 'js/category',
    action: 'category'
  },

  '/circle': {
    controller: 'js/time',
    action: 'circle'
  },

  '/trackver': {
    controller: 'js/ticket',
    action: 'trackver'
  },

  '/months': {
    controller: 'js/master',
    action: 'months'
  },

  '/kinds': {
    controller: 'js/master',
    action: 'kinds'
  },

  '/bugdensity': {
    controller: 'js/ticket',
    action: 'bugdensity'
  },

  '/trackerver': {
    view: 'trackerver'
  },

  '/stacked': {
    view: 'stacked'
  },

  '/circled': {
    view: 'circled'
  },

  '/line': {
    view: 'line'
  },

  '/bar': {
    view: 'bar'
  },

  '/index': {
    view: 'index'
  },
  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
