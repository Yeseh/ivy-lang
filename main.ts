import { run } from './src/ivy';
import fs from 'fs';

//const compound = fs.readFileSync('./src/test/programs/compound.ivy');
//const assignment = fs.readFileSync('./src/test/programs/assignment.ivy');
const program = fs.readFileSync('./src/test/programs/name-error.ivy');

const file = program.toString();

const result = run(file);

console.log(result);
