var db = require('../configDb');

/* On ajoute un étudiant en BD */
module.exports.insertEtudiant = function (data, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("INSERT INTO etudiant SET ?", data, callback);
            connexion.release();
        }
    });
};

/* On supprime un étudiant de la BD */
module.exports.deleteEtudiant = function (data, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("DELETE FROM etudiant WHERE per_num=" + data, callback);
            connexion.release();
        }
    });
};

/* On met à jour un étudiant de la BD */
module.exports.updateEtudiant = function (data, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("UPDATE etudiant SET ? WHERE per_num=" + data.per_num, data, callback);
            connexion.release();
        }
    });
};