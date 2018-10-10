import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import {mageExecutableSchema, makeExecutableSchema} from 'graphql-tools';
import {graphqlKoa, graphiglKoa} from'apollo-server-koa';

const schema = makeExecutableSchema({
    
})

const app = new Koa();
const router = new Router();

app.use(helmet());
app.use(koaBody);
app.use(cors());

app.use(router.routes()).use(router.allowedMethods());

export default app;
