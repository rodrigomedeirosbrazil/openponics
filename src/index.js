const app = require('./app');
const checkConfig = require('./services/checkConfig');

if (!process.env.BOX_ID) {
  process.on('exit', () => {
    return console.log('BOX_KEY is not set in ENV')
  });
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
    console.log('Server listening port ' + PORT);
});

checkConfig();

module.exports = app;
