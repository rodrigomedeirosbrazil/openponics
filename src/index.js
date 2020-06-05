require('dotenv').config()

const app = require('./app');
const checkConfig = require('./services/checkConfig');

if (!process.env.BOX_KEY) {
  console.log('BOX_KEY is not set in ENV')
  process.exit(1)
}

checkConfig();

const PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
    console.log('Server listening port ' + PORT);
});

module.exports = app;
