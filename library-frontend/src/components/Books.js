import React, { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const ALL_BOOKS = gql`
{
  allBooks {
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

  return [...genres];
};

const Books = (props) => {
  const { loading, error, data } = useQuery(ALL_BOOKS, { pollInterval: 2000 });
  const [genre, setGenre] = useState('');
  
  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>error loading books</div>;
  }

  let books = data.allBooks;
  let genres = possibleGenres(books);
  console.log(genres);

  if (genre) {
    books = books.filter(b => b.genres.includes(genre));
  }
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
      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="">all genres</option>
        {genres.map(g => <option key={g} value={g}>{g}</option>)}
      </select>
    </div>
  );
};

export default Books;