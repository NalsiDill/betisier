var db = require('../configDb');

module.exports.getListeCitation = function (callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT per_num, cit_libelle, DATE_FORMAT(cit_date, '%d/%m/%Y') AS cit_date FROM citation WHERE cit_valide = 1", callback);

            connexion.release();
        }
    });
};