import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:4000/',
  withCredentials: true,
});

export type User = {
  username: string;
  password: string;
  email: string;
};

export type LoginArgs = Omit<User, 'email'>;

export type SignupArgs = User;

export type Note = {
  id: string;
  title: string;
  body: string;
};

export type AddNoteArgs = Omit<Note, 'id'>;

export type UpdateNoteArgs = Note;

const getCurrentUser = () => client.get('users/me').then((res) => res.data);

const signup = async (data: SignupArgs) =>
  client.post<boolean>('users/signup', data).then((res) => res.data);

const login = async (data: LoginArgs) =>
  client.post<boolean>('users/login', data).then((res) => res.data);

const getNotes = async () => client.get('notes').then((res) => res.data);

const addNote = async (data: AddNoteArgs) =>
  client.post('notes', data).then((res) => res.data);

const getNote = async (id: string) =>
  client.get('notes/' + id).then((res) => res.data);

const updateNote = async ({ id, ...data }: UpdateNoteArgs) =>
  client.put('notes/' + id, data).then((res) => res.data);

const deleteNote = async (id: string) =>
  client.delete('notes/' + id).then((res) => res.data);

const api = {
  login,
  signup,
  getCurrentUser,
  getNotes,
  addNote,
  getNote,
  updateNote,
  deleteNote,
};
export default api;