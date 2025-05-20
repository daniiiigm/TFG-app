export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  creationDate: Date;
}

export interface UpdateUserDTO {
  name: string;
  surname: string;
  email: string;
}

export interface UserRequestDTO {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthRequestDTO {
  email: string;
  password: string;
}

export interface Role {
  role: string;
}
