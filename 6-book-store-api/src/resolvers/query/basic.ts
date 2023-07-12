import { IResolvers } from '@graphql-tools/utils';
const queryBasicResolvers: IResolvers = {
  Query: {
    hello: (): string => 'Hola a la API de GraphQL',
    helloWithName: (_: void, args: { name: string }, context: unknown, info: object): string => {
      console.log(info);
      return `Hola ${args.name}`;
    },
    peopleNumber: () => 92745
  }
};

export default queryBasicResolvers;