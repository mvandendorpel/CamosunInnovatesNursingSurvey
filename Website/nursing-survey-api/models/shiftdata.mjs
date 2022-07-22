import { Sequelize, DataTypes } from 'sequelize';
import db from './index.mjs';
export const ShiftData = db.sequelize.define('shiftdata', {
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    survey_Id: DataTypes.INTEGER,
  }, 
  {
    createdAt: false,
    updateAte: false,
    timestamps: false,
    freezeTableName: true
});