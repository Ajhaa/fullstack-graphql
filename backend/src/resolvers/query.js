const Author = require("../schema/author");
const Book = require("../schema/book");

const Query = {
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
    const authors = await Author.find({}).populate("books");
    console.log(authors);
    return authors.map(a => {
      a.bookCount = a.books.length;
      return a;
    });
  }
};

module.exports = Query;