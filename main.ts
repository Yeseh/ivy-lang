import readline from 'readline';
import { run } from './src/ivy';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const ivyPrompt = () => {
	rl.setPrompt('ivy > ');
	rl.prompt();
};

ivyPrompt();

rl.on('line', input => {
	const result = run(input);

	console.log('result: ' + result);
	ivyPrompt();
});
