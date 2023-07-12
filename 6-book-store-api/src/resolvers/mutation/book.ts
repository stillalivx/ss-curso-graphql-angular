import { IResolvers } from '@graphql-tools/utils';
import { IBook } from '../../interfaces/book-interface';
import data from '../../data';

const mutationResolvers: IResolvers = {
  Mutation: {
    addBook: (_: void, args: {book: IBook}): {
      status: boolean,
      message: string,
      item?: IBook
    } => {
      // Validamos si el titulo existe enuno de los libros existentes (DUPLICADO)
      if (data.books.filter(val => val.title === args.book.title).length) {
        return {
          status: false,
          message: 'El libro que estas introduciendo ya existe. Prueba con otro'
        };
      }

      const idValue = +data.books[data.books.length - 1].id + 1;
      args.book.id = String(idValue);

      (<Array<IBook>>data.books).push({
        ...args.book,
      });
      
      return {
        status: true,
        message: `Libro con el titulo ${args.book.title} ha sido añadido correctamente`,
        item: args.book
      };
    },
    updateBook: (_: void, args: { book: IBook }): {
      status: boolean,
      message: string,
      item?: IBook
    } => {
      // Buscamos si el libro existe
      if (!data.books.filter((bookItem: IBook) => bookItem.id === args.book.id).length) {
        return {
          status: false,
          message: 'El libro que estas introduciendo no existe y no puedes actualizarla. Revisa que el id sea valido'
        };
      }
      
      // Actualizamos el libro cuando lo encontremos
      for (let i = 0; i < data.books.length; i++) {
        if (data.books[i].id === args.book.id) {
          (<IBook>data.books[i]) = args.book;
          break;
        }
      }

      return {
        status: true,
        message: 'Actualizado correctamente el libro seleccionado',
        item: args.book
      };
    },
    deleteBook: (_: void, args: { id: string }): {
      status: boolean,
      message: string 
    } => {
      let deleteItem = false;

      for (let i = 0; i < data.books.length; i++) {
        if (data.books[i].id === args.id) {
          data.books.splice(i, 1);
          deleteItem = true;

          break;
        }
      }

      return {
        status: deleteItem,
        message: deleteItem 
          ? 'Eliminado'
          : 'No se ha eliminado ningún libro'
      };
    }
  }
};

export default mutationResolvers;