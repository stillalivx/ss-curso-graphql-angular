import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import express, { Application } from 'express';
import { GraphQLSchema } from 'graphql';
import { Server, createServer } from 'http';
import depthLimit from 'graphql-depth-limit'; 

export default class GraphQLServer {
  // Propiedades
  private app!: Application;
  private httpServer!: Server;
  private schema!: GraphQLSchema;

  private readonly DEFUALT_PORT = 3025;

  constructor(schema: GraphQLSchema) {
    if (!schema) {
      throw new Error('Necesitamos un esquema de GraphQL para trabajar con APIs GraphQL');
    }

    this.schema = schema; 
    this.init();
  }

  private init() {
    this.configExpress();
    this.configApolloServerExpress();
    this.configRoutes();
  }

  private configExpress() {
    this.app = express();

    this.app.use(compression());

    this.httpServer = createServer(this.app);
  }

  private async configApolloServerExpress() {
    const apolloServer = new ApolloServer({
      schema: this.schema,
      introspection: true,
      validationRules: depthLimit(3)
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app: this.app, cors: true });
  }

  private configRoutes() {
    this.app.get('/hello', (_, res) => {
      res.send('Bienvenidos al primer proyecto');
    });
  
    this.app.get('/', (_, res) => {
      res.redirect('/graphql');
    });
  }

  listen(callback: (port: number) => void):void {
    this.httpServer
      .listen(this.DEFUALT_PORT, () => callback(+this.DEFUALT_PORT));
  }
}