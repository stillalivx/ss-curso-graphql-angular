import { IResolvers } from '@graphql-tools/utils';
import { IUser } from '../../../interfaces/user.interface';
import { Db } from 'mongodb';
import Jwt from '../../../lib/jwt';
import { ELEMENTS_SELECT } from '../../../config/constants';

const updateUserMutation: IResolvers = {
  Mutation: {
    update: async (_: void, args: { user: IUser }, context: { db: Db, token: string }): Promise<{
      status: boolean,
      message: string,
      elementSelect: string,
      user?: IUser
    }> => {
      const info = new Jwt().verify(context.token);

      if (info === 'Token invalido') {
        return {
          status: false,
          message: 'Token no correcto por estar caducado o invalido',
          elementSelect: ELEMENTS_SELECT.USER
        };
      }
      
      const userData: IUser = <IUser><unknown>await context.db.collection('users')
        .findOne({ id: args.user.id });

      if (!userData) {
        return {
          status: false,
          message: 'Usuario no se puede actualizar. ¿Estás seguro que has introducido correctamente los datos?',
          elementSelect: ELEMENTS_SELECT.USER
        };
      }

      args.user = Object.assign(args.user, {
        password: userData.password,
        registerDate: userData.registerDate
      });

      return await context.db.collection('users')
        .updateOne({ id: args.user.id }, { $set: args.user })
        .then(() => {
          return {
            status: true,
            message: 'Actualizado correctamente',
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

export default updateUserMutation;
