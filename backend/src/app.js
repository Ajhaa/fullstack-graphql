const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const db = require('./db');

const User = require('./schema/user');
const typeDefs = require('./typedefs');
const resolvers = require('./resolvers/resolvers');

const JWT_SECRET = 'verysecret';

db.connect(process.env.MONGO_URL, 2000);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);

      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  }
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
