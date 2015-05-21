var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function () {
  // start the web server
  return app.listen(function () {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;

  app.use('/express-status', function (req, res, next) {
    res.json({running: true, now: new Date()});
  });

  app.use('/unittestreport', function (req, res, next) {
    res.sendFile('index.html', { root: path.join(__dirname, '../coverage/lcov-report') });
  });

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
