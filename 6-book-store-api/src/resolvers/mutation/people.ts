import { IResolvers } from '@graphql-tools/utils';
import data from '../../data';
import { IPeople } from '../../interfaces/people-interface';

const mutationResolvers: IResolvers = {
  Mutation: {
    addPeople: (_: void, args: { people: IPeople }): {
      status: boolean,
      message: string,
      item?: IPeople
    } => {
      // Validamos si el titulo existe enuno de los libros existentes (DUPLICADO)
      if (data.people.filter(val => val.name === args.people.name).length) {
        return {
          status: false,
          message: 'La persona que estas introduciendo ya existe. Prueba con otra'
        };
      }

      const idValue = +data.people[data.people.length - 1].id + 1;
      args.people.id = String(idValue);

      (<Array<IPeople>>data.people).push({
        ...args.people,
      });
      
      return {
        status: true,
        message: `La persona con el nombre ${args.people.name} ha sido añadido correctamente`,
        item: args.people
      };
    },
    updatePeople: (_: void, args: { people: IPeople }): {
      status: boolean,
      message: string,
      item?: IPeople
    } => {
      const idx = data.people.findIndex(val => val.id === args.people.id);

      if (idx < 0) {
        return {
          status: false,
          message: 'La persona que estas introduciendo no existe y no puedes actualizarla. Revisa que el id sea valido'
        };
      }

      (<IPeople[]>data.people)[idx] = args.people;

      return {
        status: true,
        message: 'Actualizado correctamente la persona seleccionada',
        item: args.people
      };
    },
    deletePeople: (_: void, args: { id: string }): {
      status: boolean,
      message: string
    } => {
      let deleteItem = false;

      for (let i = 0; i < data.people.length; i++) {
        if (data.people[i].id === args.id) {
          data.people.splice(i, 1);
          deleteItem = true;

          break;
        }
      }

      return {
        status: deleteItem,
        message: deleteItem 
          ? 'Eliminado'
          : 'No se ha eliminado ninguna persona'
      };
    }
  }
};

export default mutationResolvers;