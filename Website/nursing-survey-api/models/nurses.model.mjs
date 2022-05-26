import { Sequelize, DataTypes } from 'sequelize';
import db from './index.mjs';
export const Nurses = db.sequelize.define('nurses', {
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

