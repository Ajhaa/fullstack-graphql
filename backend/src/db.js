const mongo = require('mongoose');

mongo.set("useFindAndModify", false);

const connect = (address, retryInterval) => {
  mongo
    .connect(address, { useNewUrlParser: true })
    .then(() => console.log('connected to mongodb'))
    .catch(() => {
      console.log('failed to connect to mongodb, retrying in', retryInterval, 'ms');
      setTimeout(() => connect(address, retryInterval), retryInterval);
    });
} 

module.exports = { connect };