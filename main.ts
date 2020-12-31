import { run } from './src/ivy';
import fs from 'fs';

// const compound = fs.readFileSync('./src/test/programs/compound.ivy');
// const assignment = fs.readFileSync('./src/test/programs/assignment.ivy');
fs.readFile('./src/test/programs/procedures.ivy', (err, res) => {
	console.log(run(res.toString()));
});

