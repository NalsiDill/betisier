var db = require('../configDb');

module.exports.getListeCitation = function (callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT c.cit_num, per_nom, per_prenom, cit_libelle, DATE_FORMAT(cit_date, '%d/%m/%Y') AS cit_date, AVG(vot_valeur) as vot_moy FROM citation c LEFT JOIN personne p ON c.per_num = p.per_num LEFT JOIN vote v on v.cit_num=c.cit_num WHERE cit_valide = 1 GROUP BY v.cit_num ", callback);

            connexion.release();
        }
    });
};

module.exports.getListeCitationNonValide = function (callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT cit_num, per_nom, per_prenom, cit_libelle, DATE_FORMAT(cit_date, '%d/%m/%Y') AS cit_date FROM citation c JOIN personne p ON c.per_num = p.per_num WHERE cit_valide = 0", callback);

            connexion.release();
        }
    });
};

module.exports.insertCitation = function (data, callback) {
    db.getConnection(function(err, connexion) {
        if(!err){
            connexion.query('INSERT INTO citation SET ? ', data, callback);
            connexion.release();
		}
    });
};

module.exports.citationValidee = function (id, callback) {
    db.getConnection(function(err, connexion) {
        if(!err){
            connexion.query('UPDATE citation SET cit_valide = 1 WHERE cit_num='+id, callback);
            connexion.release();
		}
    });
};