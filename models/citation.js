var db = require('../configDb');

module.exports.getListeCitation = function (callback) {
    
    db.getConnection (function (err, connexion) {
        if (!err)
        {
            connexion.query('SELECT * FROM citation', callback);
            
            connexion.release();
        }
    });
};