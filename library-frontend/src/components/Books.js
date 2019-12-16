import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const BOOKS = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      genres
      author {
        name
      }
    }
  }
`;

const possibleGenres = (books) => {
  const genres = new Set();

  for (let book of books) {
    genres.add(...book.genres);
  }

  return genres;
};

const Books = (props) => {
  const [getBooks, { loading, data, error }] = useLazyQuery(BOOKS, { fetchPolicy: 'cache-and-network' });
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState(new Set());

  useEffect(() => {
    getBooks({ variables: { genre }});
  }, [genre, getBooks]);
  
  if (!props.show) {
    return null;
  }

  if (loading && !data) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>error loading books</div>;
  }

  let books = data.allBooks;
  let allGenres = new Set([...possibleGenres(books), ...genres]);

  const handleFilter = (e) => {
    setGenre(e.target.value);
    setGenres(allGenres);
  };

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <select value={genre} onChange={handleFilter}>
        <option value="">all genres</option>
        {[...allGenres].sort().map(g => <option key={g} value={g}>{g}</option>)}
      </select>
    </div>
  );
};

export default Books;