import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const ME_AND_BOOKS = gql`
{
  me {
    username
    favoriteGenre
  }

  allBooks {
    title
    genres
    author {
      name
    }
    published
  }
}
`;

const Recommendations = ({ show }) => {
  const { loading, error, data } = useQuery(ME_AND_BOOKS);

  if (!show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>not logged in</div>;
  }

  console.log(data);

  const user = data.me;
  const books = data.allBooks.filter(b => b.genres.includes(user.favoriteGenre));
  
  return (
    <div>
      <h2>recommendations</h2>
      <div>books in your favourite genre <b>{user.favoriteGenre}</b></div>
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
    </div>
  );
};

export default Recommendations;