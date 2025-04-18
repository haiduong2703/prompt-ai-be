const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Referral = require('./Referral');
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: true },
    full_name: { type: DataTypes.STRING },
    device_log: { type: DataTypes.STRING, allowNull: true },
    account_status: { type: DataTypes.INTEGER, defaultValue: 1 },
    role: { type: DataTypes.INTEGER, defaultValue: 1 },
    count_promt: { type: DataTypes.INTEGER, defaultValue: 5 },
    google_id: { type: DataTypes.STRING, allowNull: true },
    profile_image: { type: DataTypes.STRING },
    otp_code: { type: DataTypes.STRING },
    otp_expires_at: { type: DataTypes.DATE },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    referral_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Referral,
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, {
    tableName: "users",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;
