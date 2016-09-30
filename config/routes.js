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

  '/allcategory'  : { view: 'category' },
  '/allmember'    : { view: 'allmember' },
  '/alltracker'   : { view: 'alltracker' },
  '/barcharts'    : { view: 'barcharts' },
  '/barline'      : { view: 'barline' },
  '/bugcategory'  : { view: 'allcategory' },
  '/line'         : { view: 'line' },
  '/multidonuts'  : { view: 'multidonuts' },
  '/scatter'      : { view: 'scatter' },
  '/stacked'      : { view: 'stacked' },
  '/trackerver'   : { view: 'trackerver' },
  '/version'      : { view: 'version' },

  '/active'   : { controller: 'js/time', action: 'active' },
  '/activity' : { controller: 'js/activity', action: 'regist' },
  '/activityarea' : { controller: 'js/time', action: 'activityarea' },
  '/activitylist' : { controller: 'js/time', action: 'activitylist' },
  '/activityscatter' : { controller: 'js/activity', action: 'scatter' },
  '/allactivity' : { controller: 'js/activity', action: 'findall' },
  '/bugbycategory' : { controller: 'js/ticket', action: 'bugbycategory' },
  '/bugbymember' : { controller: 'js/ticket', action: 'bugbymember' },
  '/bugdensity': { controller: 'js/ticket', action: 'bugdensity' },
  '/category' : { controller: 'js/category', action: 'category' },
  '/categoryall' : { controller: 'js/category', action: 'findall' },
  '/categoryalltracker' : { controller: 'js/category', action: 'findalltracker' },
  '/categorytracker' : { controller: 'js/category', action: 'findtracker' },
  '/circle'   : { controller: 'js/time', action: 'circle' },
  '/commit' : { controller: 'js/commit', action: 'all' },
  '/deziebyuser' : { controller: 'js/ticket', action: 'deziebyuser' },
  '/kinds'    : { controller: 'js/master', action: 'kinds' },
  '/lines' : { controller: 'js/commit', action: 'lines' },
  '/member' : { controller: 'js/ticket', action: 'member' },
  '/months'   : { controller: 'js/master', action: 'months' },
  '/testver' : { controller: 'js/ticket', action: 'testver' },
  '/tracker': { controller: 'js/ticket', action: 'tracker' },
  '/tracker/:testver' : { controller: 'js/ticket', action: 'tracker' },
  '/tracker/testver/:testver' : { controller: 'js/ticket', action: 'trackerbytestver' },
  '/trackver' : { controller: 'js/ticket', action: 'trackver' },

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
