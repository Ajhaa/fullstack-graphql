const Mutation = require("./mutation");
const Query = require("./query");
const pubsub = require("./pubsub");

const resolvers = {
  Query,
  Mutation,
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    }
  }
};

module.exports = resolvers;