import { Sequelize, DataTypes } from 'sequelize';
import db from './index.mjs';
export const Fitbit = db.sequelize.define('fitbitdata', {
    nurses_ID: DataTypes.INTEGER,
    date: DataTypes.DATE,
    step_activity_all: DataTypes.JSON,
    step_activity_shift: DataTypes.JSON,
    step_activity_preshift: DataTypes.JSON,
    step_activity_postshift: DataTypes.JSON,
    hr_activity_all: DataTypes.JSON,
    hr_activity_shift: DataTypes.JSON,
    hr_activity_preshift: DataTypes.JSON,
    hr_activity_postshift: DataTypes.JSON,
    sleep: DataTypes.JSON,
    survey_ID: DataTypes.INTEGER

}, {
    createdAt: false,
    updateAte: false,
    timestamps: false,
    freezeTableName: true
});