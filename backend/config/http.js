module.exports.http = {

  middleware: {

    order: [
      'cookieParser',
      'session',
      'bodyParser',
      'compress',
      'poweredBy',
      'router',
      'www',
      'favicon',
    ],

    bodyParser: (function() {
      var bodyParser = require('body-parser');
      var json = bodyParser.json();
      var urlencoded = bodyParser.urlencoded({ extended: true });

      return function customBodyParser(req, res, next) {
        if (req.path && req.path.startsWith('/fotogato/upload')) {
          return next();
        }
        json(req, res, (err) => {
          if (err) { return next(err); }
          urlencoded(req, res, next);
        });
      };
    })(),

  },

};
