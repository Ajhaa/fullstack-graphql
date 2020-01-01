import React, { useState, useEffect } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Recommended from './components/Recommended';
import Login from './components/Login';

const App = () => {
  const [page, setPage] = useState('authors');

  const [token, setToken] = useState(null);

  const logout = e => {
    e.preventDefault();
    localStorage.removeItem('library-user-token');
    setToken(null);
  };

  useEffect(() => {
    setToken(localStorage.getItem('library-user-token'));
  }, [page]);

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        {token ? (
          <>
            <button onClick={() => setPage('recommended')}>recommended</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>
      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommended show={page === 'recommended'} />

      <Login show={page === 'login'} setPage={setPage} />
    </div>
  );
};

export default App;
