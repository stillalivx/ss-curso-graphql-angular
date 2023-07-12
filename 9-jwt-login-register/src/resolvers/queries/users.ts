import { IResolvers } from '@graphql-tools/utils';
import { IUser } from '../../interfaces/user.interface';
import { Db } from 'mongodb';

const queryResolvers: IResolvers = {
  Query: {
    users: async (_:void, __:unknown, context: { db: Db }): Promise<IUser[]> => {
      const users = <IUser[]><unknown>await context.db.collection('users').find().toArray();
      return users;
    }
  }
};

export default queryResolvers;
