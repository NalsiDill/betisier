var db = require('../configDb');

/* On récupère la liste des votes */
module.exports.getListeVote = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT cit_num, per_num, vot_valeur FROM vote", callback);
            connexion.release();
        }
    });
};

/* On note une citation en BD */
module.exports.noteCitation = function (data, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query('INSERT INTO vote SET ? ', data, callback);
            connexion.release();
        }
    });
};