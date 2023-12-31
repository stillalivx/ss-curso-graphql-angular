import { IResolvers } from '@graphql-tools/utils';
import data from '../../data';
import { IPeople } from '../../interfaces/people-interface';

const queryPeopleResolvers: IResolvers = {
  Query: {
    peopleList: (): {
      status: boolean,
      message: string,
      list: Array<IPeople>
    } => {
      return {
        status: true,
        message: 'Lista de personas correctamente cargada',
        list: data.people
      };
    },
    people: (_: void, args: { id: string }): {
      status: boolean,
      message: string,
      item: IPeople
    } => {
      const peopleFind = data.people.filter(val => val.id === args.id)[0];

      return {
        status: !peopleFind ? false : true,
        message: !peopleFind
          ? `Persona con el id "${args.id}" no ha sido encontrado`
          : `Persona con el id "${args.id}" ha sido encontrado`,
        item: peopleFind
      };
    }
  },
};

export default queryPeopleResolvers;