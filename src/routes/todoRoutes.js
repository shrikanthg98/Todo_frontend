import axios from "axios";

export const fetchData = async () => {
  const { data } = await axios.get('/todos/get');
  return data
}

export const addTodo = async (payload) => {
  const { data } = await axios.post('/todos/add', payload);
  return data
}

export const deleteTodo = async (id) => {
  const { data } = await axios.post(`/todos/deletebyid?id=${id}`);
  return data
}

export const doUndo = async (id) => {
  const { data } = await axios.post(`/todos/doundo?id=${id}`);
  return data
}