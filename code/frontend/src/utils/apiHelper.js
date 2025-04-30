import axios from 'axios';
import { API_BASE_URL } from '../config';

// A helper function to safely extract data from API responses
export const safelyGetResponseData = (response) => {
  if (response && response.data) {
    // Handle both response structures
    return response.data.data || response.data;
  }
  return null;
};

// Helper function to create error messages
export const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    if (error.response.data.error) {
      return error.response.data.error;
    }
    if (error.response.data.message) {
      return error.response.data.message;
    }
  }
  return 'An error occurred. Please try again later.';
};

// Function to handle API authentication header
export const getAuthHeader = (token) => {
  return { 'Authorization': token };
};

// Common GET request with error handling
export const apiGet = async (endpoint, token = null) => {
  try {
    const headers = token ? { headers: getAuthHeader(token) } : {};
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, headers);
    return safelyGetResponseData(response);
  } catch (error) {
    console.error(`API GET Error (${endpoint}):`, error);
    throw new Error(getErrorMessage(error));
  }
};

// Common POST request with error handling
export const apiPost = async (endpoint, data, token = null) => {
  try {
    const headers = token ? { headers: getAuthHeader(token) } : {};
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, headers);
    return safelyGetResponseData(response);
  } catch (error) {
    console.error(`API POST Error (${endpoint}):`, error);
    throw new Error(getErrorMessage(error));
  }
};

// Common PUT request with error handling
export const apiPut = async (endpoint, data, token = null) => {
  try {
    const headers = token ? { headers: getAuthHeader(token) } : {};
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, headers);
    return safelyGetResponseData(response);
  } catch (error) {
    console.error(`API PUT Error (${endpoint}):`, error);
    throw new Error(getErrorMessage(error));
  }
};

// Common DELETE request with error handling
export const apiDelete = async (endpoint, token = null) => {
  try {
    const headers = token ? { headers: getAuthHeader(token) } : {};
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`, headers);
    return safelyGetResponseData(response);
  } catch (error) {
    console.error(`API DELETE Error (${endpoint}):`, error);
    throw new Error(getErrorMessage(error));
  }
}; 