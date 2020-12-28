export class IvyError extends Error {
	constructor(name: string, msg: string) {
		super();

		this.name = name;
		this.message = msg;
	}
}

export class LexingError extends IvyError {
	constructor(msg: string) {
		super('LexingError', msg);
	}
}
