var db = require('../configDb');

/* On récupère la liste des fonctions en BD */
module.exports.getAllFonctions = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query('SELECT fon_num, fon_libelle from fonction', callback);
            connexion.release();
        }
    });
};