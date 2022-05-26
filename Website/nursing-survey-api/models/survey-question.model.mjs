import { Sequelize, DataTypes } from 'sequelize';
import db from './index.mjs';
export const SurveyQuestion = db.sequelize.define('survey_question', {
    Survey_Id: DataTypes.INTEGER,
    Question_Id: DataTypes.INTEGER,

}, {
    createdAt: false,
    updateAte: false,
    timestamps: false,
    freezeTableName: true
});

