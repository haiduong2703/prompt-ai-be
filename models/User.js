const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    full_name: { type: DataTypes.STRING },
    account_status: { type: DataTypes.INTEGER, defaultValue: 1 },
    role: { type: DataTypes.INTEGER, defaultValue: 1 },
    profile_image: { type: DataTypes.STRING },
    otp_code: { type: DataTypes.STRING },
    otp_expires_at: { type: DataTypes.DATE },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;
