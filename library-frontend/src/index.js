import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import App from './App';

const client = new ApolloClient({
  uri: process.env.REACT_APP_GQL_URL
});


ReactDOM.render(
  <ApolloProvider client={client} >    
    <App />  
  </ApolloProvider>,
  document.getElementById('root')
);