// utils/AuthService.js
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000';

const AuthService = {
    login: async (email, rollno, password) => {
        try {
            const response = await axios.post('/api/student/login', {
                email,
                rollNumber: rollno,
                password
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('rollNumber', response.data.rollno);
                
                // Dispatch auth change event
                window.dispatchEvent(new Event("authChange"));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            throw error;
        }
    },
    facultylogin: async (email, type, password) => {
        try {
            // console.log(email, type, password);
            const response = await axios.post('/api/faculty/login', {
                email,
                type: type,
                password
            });
            console.log(response.data.type)

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('type', response.data.type);
                
                window.dispatchEvent(new Event("authChange"));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            throw error;
        }
    },


    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp < Date.now() / 1000) {
                AuthService.logout();
                return false;
            }
            return true;
        } catch {
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('rollNumber');
        localStorage.removeItem('type');
        window.dispatchEvent(new Event("authChange"));
    },

    getUserDetails: () => {
        return {
            email: localStorage.getItem('email'),
            rollNumber: localStorage.getItem('rollNumber'),
            type : localStorage.getItem('type')
        };
    }
};

export default AuthService;