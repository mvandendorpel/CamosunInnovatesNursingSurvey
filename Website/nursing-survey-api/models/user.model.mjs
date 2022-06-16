import { Sequelize, DataTypes } from 'sequelize';
import db from './index.mjs';
export const User = db.sequelize.define('user', {
    ID:DataTypes.INTEGER,
    FirstName: DataTypes.STRING,
    LastName: DataTypes.STRING,
    email: DataTypes.STRING,
    Password: DataTypes.STRING,
    username: DataTypes.STRING,
    

}, {
    createdAt: false,
    updateAte: false,
    timestamps: false
});

