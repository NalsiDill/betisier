var db = require('../configDb');

/* On récupère la liste des villes */
module.exports.getListeVille = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query('SELECT vil_num, vil_nom from ville', callback);
            connexion.release();
        }
    });
};

/* On ajoute uen ville en BD */
module.exports.insertVille = function (data, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query('INSERT INTO ville set vil_nom = ? ', data, callback);
            connexion.release();
        }
    });
};

/* On suprime une ville de la BD */
module.exports.supprimerVille = function (id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query('DELETE FROM ville WHERE vil_num=' + id, callback);
        }
        connexion.release();
    });
};