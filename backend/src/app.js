const { ApolloServer, UserInputError, AuthenticationError, gql } = require("apollo-server");
const uuid = require("uuid/v1");
const jwt = require("jsonwebtoken");
const db = require("./db");
const Author = require("./schema/author");
const Book = require("./schema/book");
const User = require("./schema/user");

const JWT_SECRET = "verysecret";
const PASSWORD = "salakala";

db.connect(process.env.MONGO_URL, 2000);

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    hello: String!
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Query: {
    hello: () => {
      return "world";
    },
    me: (_, __, context) => context.currentUser,
    bookCount: () => {
      return Book.count();
    },
    authorCount: () => {
      return Author.count();
    },
    allBooks: async (_, args) => {
      const filters = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        filters.author = author;
      }
      if (args.genre) filters.genres = args.genre;

      return Book.find(filters).populate("author");
    },
    allAuthors: async () => {
      const books = await Book.find({});
      const authors = await Author.find({});
      return authors.map(author => {
        author.bookCount = 0;
        books.forEach(b => {
          if (b.author.equals(author._id)) {
            author.bookCount++;
          }
        });
        return author;
      });
    }
  },
  Mutation: {
    addBook: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("Need to authenticate");
      }
      
      const authorName = args.author;

      let author = await Author.findOne({ name: authorName });
      if (!author) {
        author = new Author({ name: authorName });
        try {
          await author.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          });
        }
      }

      const book = new Book({ ...args, author, id: uuid() });
      try {
        return book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        });
      }
    },
    editAuthor: (_, { name, setBornTo }, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("Need to authenticate");
      }

      return Author.findOneAndUpdate({ name }, { born: setBornTo });
    },
    createUser: async (_, args) => {
      return new User({ ...args, id: uuid() }).save().catch(error => {
        throw new UserInputError(error.message, {
          invalidArgs: args
        });
      });
    },
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user) {
        throw new AuthenticationError('invalid login');
      }
      
      const { _id, username } = user;

      if (_id && args.password === PASSWORD) {
        return { value: jwt.sign({ id: _id, username }, JWT_SECRET) };
      } else {
        throw new AuthenticationError('invalid login');
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);

      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
