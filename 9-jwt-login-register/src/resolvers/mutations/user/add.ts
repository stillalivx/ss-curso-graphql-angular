import { IResolvers } from '@graphql-tools/utils';
import { IUser } from '../../../interfaces/user.interface';
import { Db } from 'mongodb';
import bcrypt from 'bcrypt';
import { ELEMENTS_SELECT } from '../../../config/constants';

const addUserMutation: IResolvers = {
  Mutation: {
    add: async (_: void, args: { user: IUser }, context: { db: Db }): Promise<{
      status: boolean,
      message: string,
      elementSelect: string,
      user?: IUser
    }> => {
      const userCheck = await await context.db.collection('users')
        .findOne({ email: args.user.email });

      if (userCheck) {
        return {
          status: false,
          message: 'El usuario existe y no es posible registrarlo',
          elementSelect: ELEMENTS_SELECT.USER
        };
      }

      if (!args.user.password) {
        return {
          status: false,
          message: 'Password no establecido',
          elementSelect: ELEMENTS_SELECT.USER
        };
      }

      const lastElement = await context.db.collection('users')
        .find()
        .limit(1)
        .sort({ registerDate: -1 })
        .toArray();
      
      args.user.id = !lastElement.length
        ? '1'
        : String(+lastElement[0].id + 1);

      args.user.registerDate = new Date().toISOString();

      args.user.password = bcrypt.hashSync(args.user.password, 10);

      return await context.db.collection('users').insertOne(args.user)
        .then(() => {
          return {
            status: true,
            message: 'Añadido correctamente',
            elementSelect: ELEMENTS_SELECT.USER,
            user: args.user
          };
        })
        .catch((e) => {
          return {
            status: false,
            message: `ERROR: ${e}`,
            elementSelect: ELEMENTS_SELECT.USER,
            user: args.user
          };
        });
    }
  }
};

export default addUserMutation;
