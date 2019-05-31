/* jshint esversion: 6 */

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// fix all deprecation warnings of the MongoDB Node.js driver
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(`mongodb://localhost:27017/BotCommander-db`, function (error) {
    if (error) {
        return console.error(error);
    }
    // log to the console if succeeded
    console.log(`Connection succeeded to mongodb >>> BotCommander-db`);
});


module.exports = {
    mongoose
};
