import AsyncStorage from '@react-native-async-storage/async-storage';

// Token depolama anahtarı
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

/**
 * Token'ı AsyncStorage'a kaydetme
 * @param {string} token JWT token
 */
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Token'ı AsyncStorage'dan alma
 * @returns {Promise<string|null>} JWT token veya null
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    return token;
  } catch (error) {
    return null;
  }
};

/**
 * Token'ı AsyncStorage'dan silme
 * @returns {Promise<boolean>} İşlem başarılı mı?
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Kullanıcı verilerini kaydetme
 * @param {Object} userData Kullanıcı verileri objesi
 * @returns {Promise<boolean>} İşlem başarılı mı?
 */
export const saveUserData = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(USER_DATA_KEY, jsonValue);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Kullanıcı verilerini alma
 * @returns {Promise<Object|null>} Kullanıcı verileri veya null
 */
export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Kullanıcı verilerini silme
 * @returns {Promise<boolean>} İşlem başarılı mı?
 */
export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Tüm kimlik bilgilerini temizleme
 * @returns {Promise<boolean>} İşlem başarılı mı?
 */
export const clearAuth = async () => {
  try {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
    return true;
  } catch (error) {
    return false;
  }
}; 