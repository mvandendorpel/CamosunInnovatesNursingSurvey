import { Sequelize, DataTypes } from 'sequelize';
import db from './index.mjs';
export const Survey = db.sequelize.define('survey', {
   
    Description: DataTypes.STRING,
    surveyDate: DataTypes.STRING,
    nurses_ID: DataTypes.INTEGER,
    survey_type_id: DataTypes.INTEGER,
    fitbitData_id:DataTypes.INTEGER

}, {
    createdAt: false,
    updateAte: false,
    timestamps: false,
    freezeTableName: true
});

