var db = require('../configDb');

module.exports.getAllDivisions = function (callback) {
       // connexion à la base
	db.getConnection(function (err, connexion) {
        if (!err)
        {
            connexion.query('SELECT div_num, div_nom from division', callback);
            
            connexion.release();
        }
      });  
};