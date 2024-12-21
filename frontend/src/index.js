import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter } from 'react-router-dom';

// HTTP Link for Queries and Mutations
const httpLink = createHttpLink({
  uri: "https://chat-app-o5mz.onrender.com",
  credentials:'same-origin'
});

console.log(httpLink)
// Authentication Link for HTTP Requests
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwt');
  console.log('JWT Token',token)
  return {
    headers: {
      ...headers,
      Authorization: token ? `${token}` : "",
    },
  };
});
console.log(authLink)
// GraphQLWsLink for Subscriptions using graphql-ws
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://chat-app-o5mz.onrender.com",
    connectionParams: () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        console.error('JWT Token is missing!');
      }
      return { Authorization: token ? `${token}` : "" };
    },
    onError: (error) => {
      console.error('WebSocket Error:', error);
    },
    onConnect: () => {
      console.log('WebSocket Connected');
    },
    onClose: () => {
      console.log('WebSocket Closed');
    },
    lazy: false
  })
);



console.log(wsLink)
// Split Link: Route queries/mutations to HTTP and subscriptions to WebSocket
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink) // Combine authLink and httpLink for queries/mutations
);

// Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

// React Root Rendering

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
   </ApolloProvider > 
)
