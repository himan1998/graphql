const express = require('express');
const expressPlayground = require('graphql-playground-middleware-express').default;
const { ApolloServer } = require('apollo-server-express');
const dotEnv = require('dotenv');
const cors = require('cors')

const postService = require('./src/service/PostService');
const typeDefs = require('./src/typeDefs');
const resolvers = require('./src/resolvers');
const { verifyUser} = require('./src/helper/context');
// const isAuthenticated = require('./src/resolvers/middleware/index').isAuthenticated

const PORT = process.env.PORT || 4000;
// Create an express server and a GraphQL endpoint
const app = express();
app.use(cors())

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            postService: new postService()
        };
    },
    path: '/graphql',
    context : async ({req}) => {
        const contextObj = {};
        await verifyUser(req)
        contextObj.email = req.email;
        return contextObj;        
    }
});
server.applyMiddleware({ app });
// app.use(isAuthenticated())
app.get('/playground',
    expressPlayground({
        endpoint: '/graphql'
    })
);
app.listen({ port: PORT }, () => {
    console.log('Server listening on port 4000')
});