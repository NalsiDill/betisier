module.exports.GetAllFonctions = function (request, response) {
       // connection à la base
	db.getConnection(function (err, connexion) {
        if (!err)
        {
                // s'il n'y a pas d'erreur de connexion
                // execution de la requête SQL
            connexion.query('SELECT fon_num, fon_libelle from ville', callback);
            
            // la connexion retourne dans le pool
            connexion.release();
        }
      });  
};