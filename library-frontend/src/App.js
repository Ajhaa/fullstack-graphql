import React, { useState } from 'react'
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const LOGIN = gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`;


const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, { error }] = useMutation(LOGIN, { onError: e => {
    console.log(e, error);
  }});

  const submitLogin = async (e) => {
    e.preventDefault();
    const res = await login({ variables: { username, password } });
    
    setToken(res.login.value);
    setUsername('');
    setPassword('');
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>
      {token ? null :
        <form onSubmit={submitLogin}>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <input type="submit" value="login" />
        </form>
      }
      {error ? <div>error logging in</div> : null}

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

    </div>
  )
}

export default App