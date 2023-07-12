import path from 'path';
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
 
const resolversArray = loadFilesSync(path.join(__dirname), {
  extensions: ['ts', 'js']
});

const resolverIndex =  mergeResolvers(resolversArray);

export default resolverIndex;