import { IResolvers } from '@graphql-tools/utils';
import { IUser } from '../../interfaces/user.interface';
import { Db } from 'mongodb';
import bcrypt from 'bcrypt';
import Jwt from '../../lib/jwt';
import { ELEMENTS_SELECT } from '../../config/constants';

const loginQuery: IResolvers = {
  Query: {
    login: async (_:void, args: {
      email: string, password: string
    }, context: { db: Db }): Promise<{
      status: boolean,
      message: string,
      elementSelect: string,
      token?: string
    }> => {
      return await context.db.collection('users').findOne({
        email: args.email
      }).then(user => {
        if (!user) {
          return {
            status: false,
            message: 'El usuario no existe. Verifica tu información',
            elementSelect: ELEMENTS_SELECT.TOKEN
          };
        }
        
        const data = <IUser><unknown>user;

        if (!bcrypt.compareSync(args.password, user.password)) {
          return {
            status: false,
            message: 'Contraseña no correcta. Comprueba de nuevo introduciendolo',
            elementSelect: ELEMENTS_SELECT.TOKEN
          };
        }

        delete data._id;
        delete data.password;

        return {
          status: true,
          message: 'Usuario correctamente cargado',
          elementSelect: ELEMENTS_SELECT.TOKEN,
          token: new Jwt().sign(data)
        };
      }).catch((e) => {
        return {
          status: true,
          message: `ERROR: ${e}`,
          elementSelect: ELEMENTS_SELECT.TOKEN
        };
      });
    }
  }
};

export default loginQuery;
