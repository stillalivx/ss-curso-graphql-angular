import { IResolvers } from '@graphql-tools/utils';
import { IUser } from '../../interfaces/user.interface';
import Jwt from '../../lib/jwt';
import { ELEMENTS_SELECT } from '../../config/constants';

const meQuery: IResolvers = {
  Query: {
    me: (_: void, __: unknown, context: { token: string }): {
      status: boolean,
      message: string,
      elementSelect: string, 
      user?: IUser
    } => {
      const info = new Jwt().verify(context.token);

      if (info === 'Token invalido') {
        return {
          status: false,
          message: 'Token no correcto por estar caducado o invalido',
          elementSelect: ELEMENTS_SELECT.USER
        };
      }

      return {
        status: true,
        message: 'Token valido',
        elementSelect: ELEMENTS_SELECT.USER,
        user: (<{ user:IUser }><unknown>info).user
      };
    }
  }
};

export default meQuery;
