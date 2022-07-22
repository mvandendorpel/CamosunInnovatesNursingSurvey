import { Sequelize, DataTypes } from 'sequelize';
import { encrypt, decrypt } from '../util.js';
import db from './index.mjs';

export const User = db.sequelize.define('user', {
    // ID:DataTypes.INTEGER,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    

}, {
    createdAt: false,
    updateAte: false,
    timestamps: false,
    freezeTableName: true
});



