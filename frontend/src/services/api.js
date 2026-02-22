import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const authAPI = {
  login: (credentials) => API.post("/auth/login", credentials),
  register: (userData) => API.post("/auth/register", userData),
  getMe: () => API.get("/auth/me"),
  updateProfile: (profileData) => API.put("/auth/profile", profileData),
};

export const donationsAPI = {
  // Food Donations
  createFoodDonation: (donationData) => API.post("/donations/food", donationData),
  getFoodDonations: () => API.get("/donations/food"),
  acceptFoodDonation: (id) => API.put(`/donations/food/${id}/accept`),
  completeFoodDonation: (id) => API.put(`/donations/food/${id}/complete`),

  // Money Donations
  createMoneyDonationOrder: (amount) =>
    API.post("/donations/money/order", { amount }),
  saveMoneyDonation: (donationData) => API.post("/donations/money", donationData),
  getMoneyDonations: () => API.get("/donations/money"),
};
