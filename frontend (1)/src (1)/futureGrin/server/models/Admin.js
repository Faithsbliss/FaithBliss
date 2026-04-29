// server/models/Admin.js
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    // Using a shared secret key as the authentication method
    adminKey: {
        type: String,
        required: true,
        unique: true
    }
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;