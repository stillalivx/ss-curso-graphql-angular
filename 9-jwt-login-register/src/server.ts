import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import express, { Application } from 'express';
import { GraphQLSchema } from 'graphql';
import { createServer, Server } from 'http';
import environment from './config/environment';
import Database from './config/database';
import { IContext } from './interfaces/context.interface';

class GraphQLServer {
  // Propiedades
  private app!: Application;
  private httpServer!: Server;
  private readonly DEFAULT_PORT = process.env.PORT || 3025;
  private schema!: GraphQLSchema;
  constructor(schema: GraphQLSchema) {
    if (schema === undefined) {
      throw new Error('Necesitamos un schema de GraphQL para trabajar con APIs GraphQL');
    }
    this.schema = schema;
    this.init();
  }

  private init() {
    this.configExpress();
    this.configApolloServerExpress();
    this.configRoutes();
  }

  private initializeEnv() {
    if (process.env.NODE_ENV !== 'production') {
      console.log(environment);
    }
  }

  private configExpress() {
    this.app = express();

    this.app.use(compression());

    this.httpServer = createServer(this.app);
  }

  private async configApolloServerExpress() {
    // Llamada para inicializar la base de datos
    const database = new Database();
    const db = await database.init();

    const context = async ({ req, connection }: IContext)  => {
      // Obtener token
      const token = req ? req.headers.authorization : connection.authorization;
      return { db, token };
    };

    const apolloServer = new ApolloServer({
      schema: this.schema,
      introspection: true,
      context
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app: this.app, cors: true });

   
  }

  private configRoutes() {
    this.app.get('/hello', (_, res) => {
      res.send('Bienvenid@s al primer proyecto');
    });
  
    this.app.get('/', (_, res) => {
      res.redirect('/graphql');
    });
  }

  listen(callback: (port: number) => void): void {
    this.httpServer.listen(+this.DEFAULT_PORT, () => {
      callback(+this.DEFAULT_PORT);
    });
  }
}

export default GraphQLServer;
