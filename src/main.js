import dotenv from 'dotenv'
import db from './db.js';
import models from './models/index.js'

import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';

dotenv.config();

// Run the server on a port specified in our .env file or port 4000
const port = process.env.PORT || 4000;

import typeDefs from './schema.js';

// Provide resolver functions for our schema fields
import resolvers from './resolvers/index.js';

async function startHistoryServer() {

  db.connect(process.env.DB_HOST);
  // Apollo Server setup
  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    context: () => {
      return { models };
    }
  });

  await server.start();

  const app = express();
  app.use(helmet());
  app.use(cors());

  // Apply the Apollo GraphQL middleware and set the path to /api
  server.applyMiddleware({ app, path: '/api' });

  app.listen({ port }, () =>
    console.log(
      `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    )
  );
}

startHistoryServer();