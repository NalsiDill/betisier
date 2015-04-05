var db = require('../configDb');

/* On récupère la liste des divisions */
module.exports.getAllDivisions = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query('SELECT div_num, div_nom from division', callback);
            connexion.release();
        }
    });
};