import axios from 'axios';
import { getToken } from '../auth/storage';
import { API_URL, API_TIMEOUT } from './config';

/**
 * API istekleri için axios instance oluştur
 * @returns {axios.AxiosInstance} API için axios instance
 */
export const createApiInstance = async () => {
  const token = await getToken();
  
  return axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
  });
};

/**
 * WordPress REST API ile GET isteği
 * @param {string} endpoint API endpoint
 * @param {Object} params İstek parametreleri
 * @returns {Promise} API yanıtı
 */
export const apiGet = async (endpoint, params = {}) => {
  try {
    const api = await createApiInstance();
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * WordPress REST API ile POST isteği
 * @param {string} endpoint API endpoint
 * @param {Object} data İstek verileri
 * @returns {Promise} API yanıtı
 */
export const apiPost = async (endpoint, data = {}) => {
  try {
    const api = await createApiInstance();
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * WordPress REST API ile PUT isteği
 * @param {string} endpoint API endpoint
 * @param {Object} data İstek verileri
 * @returns {Promise} API yanıtı
 */
export const apiPut = async (endpoint, data = {}) => {
  try {
    const api = await createApiInstance();
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * WordPress REST API ile DELETE isteği
 * @param {string} endpoint API endpoint
 * @returns {Promise} API yanıtı
 */
export const apiDelete = async (endpoint) => {
  try {
    const api = await createApiInstance();
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 