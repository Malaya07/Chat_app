const express = require('express');
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const resolvers = require('./resolver'); // Contains subscription logic
const typeDefs = require('./typeDefs'); // GraphQL schema definitions
const { connectToMongoDB } = require('./connection'); // MongoDB connection setup

const startServer = async () => {
  const app = express();

  const httpServer = createServer(app);
  // MongoDB Connection
  await connectToMongoDB("mongodb+srv://Malaya:Malaya07@cluster0.jsfwi.mongodb.net/Malaya")
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

  // GraphQL Schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Token Validation
  const getUser = (token) => {
    if (token) {
      try {
        //console.log("getuser",token)
        return jwt.verify(token, process.env.SECRET_KEY);
      } catch (err) {
        console.error('❌ Token error:', err.message);
        return null; // Invalid or expired token
      }
    }
    return null;
  };

  // WebSocket Server for Subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Apollo Server
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const token = req?.headers?.authorization || req?.headers?.Authorization|| '';
      
      const user = getUser(token);
     // console.log("server",user)
      if (!user) {
       // console.warn('Unauthorized WebSocket connection');
      }
      return { user };
    },
  });

  await server.start();
  //console.log("use server start")
  useServer(
    {
      schema,
      context: async (ctx) => {
        //console.log("use server: ",ctx);
       const token = ctx.connectionParams?.authorization || ctx.connectionParams?.Authorization || '';
        console.log("user:",token)
        const user = getUser(token);
        if (!user) {
          console.warn('⚠️ Unauthorized WebSocket connection attempt');
        } else {
          console.log('✅ WebSocket client connected:', user.email || 'Unknown User');
        }
        console.log(user)
        return { user };
      },
      onConnect: (ctx) => {
        console.log('🔗 WebSocket connection initiated');
      },
      onDisconnect: () => {
        console.log('❌ WebSocket client disconnected');
      },
    },
    wsServer
  );
 //console.log("use server end ")
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: '*', // Your frontend's URL
      credentials: true,
    },
  });
  

  // Start HTTP Server
  httpServer.listen(4000, () => {
    console.log('🚀 Server ready at http://localhost:4000/graphql');
    console.log('🚀 Subscriptions ready at ws://localhost:4000/graphql');
  });
};

startServer().catch((error) => {
  console.error('❌ Error starting server:', error);
});
