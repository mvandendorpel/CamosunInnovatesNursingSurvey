import { Sequelize, DataTypes } from "sequelize";
import db from './index.mjs'

export const UserProfile = db.sequelize.define('user_info', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    dateOfBirth: DataTypes.STRING,
    city: DataTypes.STRING,
    gender: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    registrationDate: DataTypes.DATE
}, {
    createdAt: false,
    updatedAt: false,
    timestamps: false,
    freezeTableName: true
});