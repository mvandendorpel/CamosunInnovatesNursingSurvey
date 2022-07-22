import { Sequelize, DataTypes } from 'sequelize';
import db from './index.mjs';
import { encrypt, decrypt } from '../util.js';
export const ShiftData = db.sequelize.define('shiftdata', {
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    survey_Id: DataTypes.INTEGER,
  }, 
  {
    hooks : {
    
      beforeCreate : (obj , options) => {
          {
              
              obj.startTime = encrypt(obj.startTime);
              obj.endTime = encrypt(obj.endTime);
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
                      
                      objArray[i].dataValues.startTime = decrypt(objArray[i].dataValues.startTime);
                      objArray[i].dataValues.endTime = decrypt(objArray[i].dataValues.endTime);
                  }
              } else {
                objArray.dataValues.startTime = decrypt(objArray.dataValues.startTime);
                objArray.dataValues.endTime = decrypt(objArray.dataValues.endTime);
              }
              
              
          }
      }
  },
    createdAt: false,
    updateAte: false,
    timestamps: false,
    freezeTableName: true
});