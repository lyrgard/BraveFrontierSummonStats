var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();

app.use('/data', function(req, res, next) {
    if (req.method == 'POST') {
        
    } else {
        next();
    }
});
app.use('/data', serveStatic('../data'));
app.use(serveStatic('../static'));
app.listen(8081);