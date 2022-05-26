import { Sequelize, DataTypes } from 'sequelize';
import db from './index.mjs';
export const SurveyAnswer = db.sequelize.define('surveyanswer', {
    answer: DataTypes.STRING,
    survey_question_id: DataTypes.INTEGER,

}, {
    createdAt: false,
    updateAte: false,
    timestamps: false,
    freezeTableName: true
});

