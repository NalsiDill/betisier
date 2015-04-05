var db = require('../configDb');

module.exports.getAllDepartements = function (callback) {
       // connexion à la base
	db.getConnection(function (err, connexion) {
        if (!err)
        {
            connexion.query('SELECT dep_num, dep_nom from departement', callback);
            
            connexion.release();
        }
      });  
};