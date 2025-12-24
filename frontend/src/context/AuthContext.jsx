import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            // Backend expects 'email' field, but logic checks both username/email
            const res = await axios.post('http://localhost:8000/api/auth/staff/login', { email: username, password });
            return processLogin(res.data);
        } catch (err) {
            return { success: false, message: err.response?.data?.detail || 'Login failed' };
        }
    };

    const loginWithPin = async (username, pin) => {
        try {
            // Backend only needs PIN to find user
            const res = await axios.post('http://localhost:8000/api/auth/staff/pin', { pin });
            return processLogin(res.data);
        } catch (err) {
            return { success: false, message: err.response?.data?.detail || 'PIN Login failed' };
        }
    };

    const loginGuest = async (name) => {
        try {
            const res = await axios.post('http://localhost:8000/api/auth/customer/login-guest', { name: name || "Guest" });
            return processLogin(res.data);
        } catch (err) {
            return { success: false, message: err.response?.data?.detail || 'Guest Login failed' };
        }
    };

    const processLogin = (data) => {
        const { access_token, role, username } = data;
        const userData = { username, role };
        setUser(userData);
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithPin, loginGuest, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
