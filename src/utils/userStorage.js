import axios from 'axios';

// Function to get all users from localStorage
export const getUsers = () => {
  try {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Function to save user to both localStorage and server
export const saveUser = async (userData) => {
  try {
    // Save to localStorage
    const users = getUsers();
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    // Save to server
    await axios.post('http://localhost:5000/api/signup', userData);
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

// Function to check login credentials
export const checkLogin = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/login', { email, password });
    if (response.data.success) {
      return response.data.user;
    }
    return null;
  } catch (error) {
    console.error('Error checking login:', error);
    return null;
  }
}; 