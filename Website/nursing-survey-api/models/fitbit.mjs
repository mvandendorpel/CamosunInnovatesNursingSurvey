import { Sequelize, DataTypes } from 'sequelize';
import { decrypt, encrypt } from '../util.js';
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
    hooks : {
    
        beforeCreate : (obj , options) => {
            {
                obj.step_activity_all = encrypt(JSON.stringify(obj.step_activity_all));
                obj.step_activity_shift = encrypt(JSON.stringify(obj.step_activity_shift));
                obj.step_activity_preshift = encrypt(JSON.stringify(obj.step_activity_preshift));
                obj.step_activity_postshift = encrypt(JSON.stringify(obj.step_activity_postshift));
                obj.hr_activity_all = encrypt(JSON.stringify(obj.hr_activity_all));
                obj.hr_activity_shift = encrypt(JSON.stringify(obj.hr_activity_shift));
                obj.hr_activity_preshift = encrypt(JSON.stringify(obj.hr_activity_preshift));
                obj.hr_activity_postshift = encrypt(JSON.stringify(obj.hr_activity_postshift));
                obj.sleep = encrypt(JSON.stringify(obj.sleep));
            }
        },
        afterFind : (objArray) => {
            {
    
                if(objArray.constructor === Array) {
                    for (let i = 0; i < objArray.length; i++) {
                        // const decrypted = decrypt(objArray[i].dataValues.answer);
                        // objArray[i].dataValues.answer = decrypted;
                        objArray[i].dataValues.step_activity_all = JSON.parse(decrypt(objArray[i].step_activity_all.replaceAll('"','')));
                        objArray[i].dataValues.step_activity_shift = JSON.parse(decrypt(objArray[i].step_activity_shift.replaceAll('"','')));
                        objArray[i].dataValues.step_activity_preshift = JSON.parse(decrypt(objArray[i].step_activity_preshift.replaceAll('"','')));
                        objArray[i].dataValues.step_activity_postshift = JSON.parse(decrypt(objArray[i].step_activity_postshift.replaceAll('"','')));
                        objArray[i].dataValues.hr_activity_all = JSON.parse(decrypt(objArray[i].hr_activity_all.replaceAll('"','')));
                        objArray[i].dataValues.hr_activity_shift = JSON.parse(decrypt(objArray[i].hr_activity_shift.replaceAll('"','')));
                        objArray[i].dataValues.hr_activity_preshift = JSON.parse(decrypt(objArray[i].hr_activity_preshift.replaceAll('"','')));
                        objArray[i].dataValues.hr_activity_postshift = JSON.parse(decrypt(objArray[i].hr_activity_postshift.replaceAll('"','')));
                        const decryptedSleep = decrypt(objArray[i].sleep.replaceAll('"',''));
                        objArray[i].dataValues.sleep = decryptedSleep ? JSON.parse(decryptedSleep) : '';
                    }
                } else {
                    objArray.dataValues.step_activity_all = JSON.parse(decrypt(objArray.step_activity_all.replaceAll('"','')));
                    objArray.dataValues.step_activity_shift = JSON.parse(decrypt(objArray.step_activity_shift.replaceAll('"','')));
                    objArray.dataValues.step_activity_preshift = JSON.parse(decrypt(objArray.step_activity_preshift.replaceAll('"','')));
                    objArray.dataValues.step_activity_postshift = JSON.parse(decrypt(objArray.step_activity_postshift.replaceAll('"','')));
                    objArray.dataValues.hr_activity_all = JSON.parse(decrypt(objArray.hr_activity_all.replaceAll('"','')));
                    objArray.dataValues.hr_activity_shift = JSON.parse(decrypt(objArray.hr_activity_shift.replaceAll('"','')));
                    objArray.dataValues.hr_activity_preshift = JSON.parse(decrypt(objArray.hr_activity_preshift.replaceAll('"','')));
                    objArray.dataValues.hr_activity_postshift = JSON.parse(decrypt(objArray.hr_activity_postshift.replaceAll('"','')));
                    objArray.dataValues.sleep = JSON.parse(decrypt(objArray.sleep.replaceAll('"','')));
                }
                
                
            }
        }
    },
    createdAt: false,
    updateAte: false,
    timestamps: false,
    freezeTableName: true
});