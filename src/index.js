const app = require('./app');

const PORT = process.env.PORT || 8888;

app.listen(PORT, function () {
    console.log('Server listening port ' + PORT);
});

module.exports = app;
