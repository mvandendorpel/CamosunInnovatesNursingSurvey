import { Sequelize, DataTypes } from 'sequelize';
import db from './index.mjs';
import { encrypt, decrypt } from '../util.js';

export const SurveyAnswer = db.sequelize.define('surveyanswer', {
    answer: DataTypes.STRING,
    survey_question_id: DataTypes.INTEGER,

}, {
    hooks : {
    
        beforeCreate : (obj , options) => {
            {
                
                const encrypted = encrypt(obj.answer);
                console.log("TESTING TESTING",encrypted);
                obj.answer = encrypted;
            }
        },
        afterFind : (objArray) => {
            {
                // Maybe you want to do something like, encrypt every string field
                // You should be able to loop through the fields and look for the types

                // Another possibility is that you inspect the objects to see what type they are
                // and have a configuration of what fields are encrypted

                // Or maybe sequelize lets you add custom attributes to fields? this might be best;
                // then you would just encrypt every field that has that attribute set

                // If you could do that, then the encrypt/decrypt, beforeCreate, afterFind implementations could be shared.
                if(objArray.constructor === Array) {
                    for (let i = 0; i < objArray.length; i++) {
                        console.log("TESTING TESTING obj", objArray[i].dataValues.answer);
    
                        const decrypted = decrypt(objArray[i].dataValues.answer);
                        console.log("TESTING Decrypted", decrypted);
                        objArray[i].dataValues.answer = decrypted;
                    }
                } else {
                    const decrypted = decrypt(objArray.dataValues.answer);
                    console.log("TESTING Decrypted single",decrypted);
                    objArray.answer = decrypted;
                }
                
                
            }
        }
    },
    createdAt: false,
    updateAte: false,
    timestamps: false,
    freezeTableName: true
});

