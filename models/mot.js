var db = require('../configDb');

module.exports.getListeMot = function (callback) {

    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT mot_interdit FROM mot", callback);

            connexion.release();
        }
    });
};

