// api.js - Axios wrapper for backend API calls
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const login = (data) => axios.post(`${API_BASE}/auth/login`, data);
export const fetchQuiz = (userId) => axios.get(`${API_BASE}/quiz/start?userId=${userId}`);
export const submitQuiz = (userId, answers) => axios.post(`${API_BASE}/quiz/submit`, { userId, answers });
// ...other API calls
