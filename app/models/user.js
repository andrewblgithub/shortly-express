var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function() {
    this.on('creating', this.hashPassword, this);
    this.on('fetching', this.hashPassword, this)
  },
  hashPassword: function(model, attrs, options) {
    return new Promise(function(resolve, reject) {
      bcrypt.genSalt(10, function(err, salt) {
        if (model.attributes.salt) {
          console.log('we have the salt', salt)
          salt = model.attributes.salt;
        }
        console.log(model.attributes.password);
        bcrypt.hash(model.attributes.password, salt, null, function(err, hash) {
          if(err) {
            reject (err);
          }
          console.log('password is ', hash);
          model.set('salt', salt);
          model.set('password', hash);
          resolve(hash);
        });
      });
    })
  },
});

module.exports = User;

// $2a$10$bldTTqi/ddje/BSQKD.mT.jCKXG1hEeVWvg/7m7dEjzKlPBSm2wE.
// $2a$10$bldTTqi/ddje/BSQKD.mT.jCKXG1hEeVWvg/7m7dEjzKlPBSm2wE.