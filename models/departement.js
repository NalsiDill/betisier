var db = require('../configDb');

module.exports.GetAllDepartements = function (request, response) {
       // connexion à la base
	db.getConnection(function (err, connexion) {
        if (!err)
        {
                // s'il n'y a pas d'erreur de connexion
                // execution de la requête SQL
            connexion.query('SELECT dep_num, dep_nom from departement', callback);
            
            // la connexion retourne dans le pool
            connexion.release();
        }
      });  
};