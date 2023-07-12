import { IResolvers } from '@graphql-tools/utils';
import data from '../../data';

const typesResolvers: IResolvers = {
  Data: {
    __resolveType(obj: { name: string, isbn: string }){
      // Only Author has a name field
      if(obj.name){
        return 'People';
      }
      // Only Book has a title field
      if(obj.isbn){
        return 'Book';
      }
      return null; // GraphQLError is thrown
    },
  },
  People: {
    booksBuy: () => {
      return data.books
        .filter(book => data.books.includes(book));
    },
    website: (root: { website: string }) => {
      return !root.website ? '' : root.website;
    },
    github: (root: { github: string }) => {
      return !root.github
        ? ''
        : `https://github.com/${root.github}`;
    },
    twitter: (root: { twitter: string }) => {
      return !root.twitter
        ? ''
        : `https://twitter.com/${root.twitter}`;
    }
  },
  Book: {
    byPeopleBuy: (root: { id: string }) => {
      return data.people
        .filter(people => people.books.includes(root.id));
    },
    publishedDate: (root: { publishedDate: string }) => {
      return !root.publishedDate ? '?' : root.publishedDate;
    },
    thumbnailUrl: (root: { thumbnailUrl: string }) => {
      return !root.thumbnailUrl ? '-' : root.thumbnailUrl;
    },
    shortDescription: (root: { shortDescription: string }) => {
      return !root.shortDescription ? '-' : root.shortDescription;
    },
    longDescription: (root: { longDescription: string }) => {
      return !root.longDescription ? '-' : root.longDescription;
    }
  }
};

export default typesResolvers;