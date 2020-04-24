'use strict';
let bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstname: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1,255],
          msg: 'Do.. don\'t you have a name?'
        }
      }
    },
    lastname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail:{
          msg: 'YO, PROPER EMAIL YO'
        }
      }
    },
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args:[8,255], msg:'LONGER PASSWORD. AT LEAST 8 CHARACTERS. UNLESS...'
        }
      }
    },
    admin: DataTypes.BOOLEAN,
    birthday: DataTypes.DATE,
    zipcode: DataTypes.INTEGER,
    bio: DataTypes.TEXT,
    picture: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: pendingUser => {
        pendingUser.password = bcrypt.hashSync(pendingUser.password, 13) // 13 salt rounds
      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
  };
  user.prototype.validPassword = function(plainTextPassword) {
    // Determine if the password hashes to the same hash
    return bcrypt.compareSync(plainTextPassword, this.password)
  }
  return user;
};