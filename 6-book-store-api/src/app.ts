import GraphQLServer from './server';
import schema from './schema';

const graphqlServer = new GraphQLServer(schema);

graphqlServer
  .listen((port: number) => console.log(`http://localhost:${port}/graphql`));