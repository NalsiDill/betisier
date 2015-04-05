var db = require('../configDb');

/* On récupère la liste des mots interdits de la BD */
module.exports.getListeMot = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT mot_interdit FROM mot", callback);
            connexion.release();
        }
    });
};