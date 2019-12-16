import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Recommended from './components/Recommended';

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

const App = () => {
  const [page, setPage] = useState('authors');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);

  const [login, { error }] = useMutation(LOGIN, {
    onError: e => {
      console.log(e);
    }
  });

  const submitLogin = async e => {
    e.preventDefault();
    const res = await login({ variables: { username, password } });
    
    if (!res) {
      return;
    }

    setToken(res.data.login.value);
    localStorage.setItem('library-user-token', res.data.login.value);
    setUsername('');
    setPassword('');
  };

  const logout = e => {
    e.preventDefault();
    localStorage.removeItem('library-user-token');
    setToken(null);
  };

  useEffect(() => {
    setToken(localStorage.getItem('library-user-token'));
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        {token ? 
          <>
            <button onClick={() => setPage('recommended')}>recommended</button>
            <button onClick={logout}>logout</button>
          </> : null}
      </div>
      {token ? null : (
        <form onSubmit={submitLogin}>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input type="submit" value="login" />
        </form>
      )}
      {error ? <div>error logging in</div> : null}

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
      
      <Recommended show={page === 'recommended'} />
    </div>
  );
};

export default App;
