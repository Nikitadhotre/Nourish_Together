import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const authAPI = {
  login: (credentials) => axios.post(`${API_BASE_URL}/auth/login`, credentials),
  register: (userData) => axios.post(`${API_BASE_URL}/auth/register`, userData),
  getMe: () => axios.get(`${API_BASE_URL}/auth/me`),
};

export const donationsAPI = {
  createFoodDonation: (donationData) => axios.post(`${API_BASE_URL}/donations/food`, donationData),
  getFoodDonations: () => axios.get(`${API_BASE_URL}/donations/food`),
  acceptFoodDonation: (id) => axios.put(`${API_BASE_URL}/donations/food/${id}/accept`),
  completeFoodDonation: (id) => axios.put(`${API_BASE_URL}/donations/food/${id}/complete`),

  createMoneyDonationOrder: (amount) =>
    axios.post(`${API_BASE_URL}/donations/money/order`, { amount }),

  saveMoneyDonation: (donationData) =>
    axios.post(`${API_BASE_URL}/donations/money`, donationData),

  getMoneyDonations: () => axios.get(`${API_BASE_URL}/donations/money`),
};
