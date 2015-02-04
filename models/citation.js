var db = require('../configDb');

module.exports.getListeCitation = function (callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT per_nom, per_prenom, cit_libelle, DATE_FORMAT(cit_date, '%d/%m/%Y') AS cit_date FROM citation c JOIN PERSONNE p ON c.per_num = p.per_num WHERE cit_valide = 1", callback);

            connexion.release();
        }
    });
};