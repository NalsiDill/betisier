var db = require('../configDb');

/* On récupère la liste des départements */
module.exports.getAllDepartements = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query('SELECT dep_num, dep_nom from departement', callback);
            connexion.release();
        }
    });
};