export interface ICoach {
	_id?: string;
	user: string; // user id reference
	name: string;
	birthdate: string | Date;
	schools: string[]; // array of school ids
	createdAt?: string;
	updatedAt?: string;
}

export interface ICreateCoach {
	user?: string;
	name: string;
	birthdate: string | Date;
	schools?: string[];
}

export type IUpdateCoach = Partial<ICreateCoach>;
