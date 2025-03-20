
import { setCacheVerified } from './cache';

// Functions for managing admin data in local storage
export const getStoredAdminData = () => {
  const adminToken = localStorage.getItem('adminToken');
  const adminUserStr = localStorage.getItem('adminUser');
  let adminUserObj = null;
  
  if (adminToken === 'authenticated' && adminUserStr) {
    try {
      adminUserObj = JSON.parse(adminUserStr);
      console.log("Found admin token in localStorage:", adminUserObj);
      return { adminToken, adminUserObj };
    } catch (error) {
      console.error("Error parsing admin user data:", error);
    }
  }
  
  return { adminToken, adminUserObj: null };
};

export const setAdminData = (userId: string) => {
  localStorage.setItem('adminToken', 'authenticated');
  localStorage.setItem('adminUser', JSON.stringify({ 
    id: userId,
    role: 'admin'
  }));
  setCacheVerified(true);
};

export const clearAdminData = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  setCacheVerified(false);
};
