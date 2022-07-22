import { Sequelize, DataTypes } from "sequelize";
import db from './index.mjs'
import { encrypt, decrypt } from '../util.js';
export const UserProfile = db.sequelize.define('user_info', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    dateOfBirth: DataTypes.STRING,
    city: DataTypes.STRING,
    gender: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    registrationDate: DataTypes.DATE
}, {
    hooks: {
        beforeCreate : (user , options) => {
            {
                user.firstName = encrypt(user.firstName);
                user.lastName = encrypt(user.lastName);
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
                  
                        objArray[i].dataValues.firstName =  decrypt(objArray[i].dataValues.firstName);
                        objArray[i].dataValues.lastName =  decrypt(objArray[i].dataValues.lastName);
                    }
                } else {
              
                
                    objArray.dataValues.firstName = encrypt(objArray.dataValues.firstName);
                    objArray.dataValues.lastName = encrypt(objArray.dataValues.lastName);
                }
                
                
            }
        }
    },
    createdAt: false,
    updatedAt: false,
    timestamps: false,
    freezeTableName: true
});