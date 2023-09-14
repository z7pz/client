import axios from "axios";
export class Api {
	axios = axios.create({
		baseURL: "http://localhost:8080",
		withCredentials: true,
	});
	auth = new Auth(this);
	user = new User(this);
	exam = new Exam(this);
}

class User {
	constructor(public api: Api) {}
	async get_user() {
		const token = localStorage.getItem("token");
		let config = {
			method: "get",
			maxBodyLength: Infinity,
			url: "/user/get",
			headers: {
				Authorization: token,
			},
		};

		return await this.api.axios.request<IUser>(config);
	}
	async all() {
		const token = localStorage.getItem("token");
		let config = {
			method: "get",
			maxBodyLength: Infinity,
			url: "/user/all",
			headers: {
				Authorization: token,
			},
		};
		return await this.api.axios.request<IUser[]>(config);
	}
}

class Exam {
	constructor(public api: Api) {}
	async get_exams() {
		const token = localStorage.getItem("token");
		let config = {
			method: "get",
			maxBodyLength: Infinity,
			url: "/exams/get",
			headers: {
				Authorization: token,
			},
		};

		return await this.api.axios.request<IExam[]>(config);
	}
	async edit_exam(id: string, name: string, outof: number) {
		const token = localStorage.getItem("token");
		let data = JSON.stringify({
			id,
			name,
			outof: Number(outof),
		});
		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "/exams/edit",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			data,
		};

		return await this.api.axios.request<IExam[]>(config);
	}
	async grades(exam_id: string) {
		const token = localStorage.getItem("token");
		let data = JSON.stringify({
			exam_id,
		});

		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "/exams/grades",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			data,
		};

		return await this.api.axios.request<IGrade[]>(config);
	}
	async create_mark(exam_id: string, mark: number, user_id: string) {
		const token = localStorage.getItem("token");
		let data = JSON.stringify({
			exam_id,
			user_id,
			mark,
			paper: "",
		});
		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "/exams/add_grade",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			data: data,
		};
		return await this.api.axios.request<IGrade>(config);
	}
	async delete_grade(exam_id: string, grade_id: string) {
		const token = localStorage.getItem("token");
		let data = JSON.stringify({
			exam_id,
			grade_id,
		});

		let config = {
			method: "delete",
			maxBodyLength: Infinity,
			url: "/exams/delete_grade",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			data,
		};

		return await this.api.axios.request<IExam>(config);
	}

	async edit_grades(exam_id: string, grades: any[]) {
		const token = localStorage.getItem("token");
		let data = JSON.stringify({
			exam_id,
			grades,
		});

		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "/exams/edit_grades",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
			data,
		};

		return await this.api.axios.request<IGrade[]>(config);
	}
}

export enum Roles {
	Admin = "Admin",
	Teacher = "Teacher",
	Student = "Student",
}

export interface IGrade {
	exam_id: string;
	grade: number;
	id: string;
	paper: string;
	user_id: string;
}

export interface IUser {
	id: string;
	display_name: string;
	role: Roles;
	username: string;
	grades: IGrade[];
}
export interface IExam {
	grades: number[];
	id: string;
	name: string;
	outof: number;
}

class Auth {
	constructor(public api: Api) {}
	async register(username: string, display_name: string, password: string) {
		return await this.api.axios.post("/auth/register", {
			username,
			display_name,
			password,
		});
	}
	async login(username: string, password: string) {
		return await this.api.axios.post<string>("/auth/login", {
			username,
			password,
		});
	}
}
