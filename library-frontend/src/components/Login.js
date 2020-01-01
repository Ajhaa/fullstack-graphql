import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

const Login = ({ show, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const [login] = useMutation(LOGIN, {
    onError: _ => {
      setError(true);
    }
  });

  const submitLogin = async e => {
    e.preventDefault();
    const res = await login({ variables: { username, password } });

    if (!res) {
      return;
    }

    localStorage.setItem('library-user-token', res.data.login.value);
    setUsername('');
    setPassword('');
    setPage('authors');
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <form onSubmit={submitLogin}>
        <div>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        {error ? (
          <div style={{ color: 'red' }}>invalid username or password</div>
        ) : null}
        <input type="submit" value="login" />
      </form>
    </div>
  );
};

export default Login;
