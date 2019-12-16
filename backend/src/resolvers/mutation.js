const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const uuid = require("uuid/v1");
const Author = require("../schema/author");
const Book = require("../schema/book");
const User = require("../schema/user");

const pubsub = require("./pubsub");
const PASSWORD = "salakala";
const JWT_SECRET = "verysecret";

const Mutation = {
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
    author.books.push(book.id); 
    console.log(author);
    try {
      await book.save();
      await author.save();
    } catch (error) {
      throw new UserInputError(error.message, {
        invalidArgs: args
      });
    }

    pubsub.publish('BOOK_ADDED', { bookAdded: book });
    return book;
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

module.exports = Mutation;