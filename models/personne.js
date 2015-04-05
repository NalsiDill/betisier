var crypto = require('crypto');
var db = require('../configDb');


/*
 * Vérifie le nom utilisateur et son mot de passe
 *
 * @param     data.login : le login de l'utilisateur
 * @param     data.pass : le mot de passe
 * @return l'identifiant de la personne si le mot de passe et le login sont bons
 *     Rien sinon
 *
 */
module.exports.getLoginOk = function (data, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            // Cryptage du mdp en sha256
            var sha256 = crypto.createHash("sha256");
            sha256.update(data.pass, "utf8");
            var resu = sha256.digest("base64");
            req = "SELECT per_num, per_admin from personne where per_login =" + connexion.escape(data.login) + " and per_pwd = " + connexion.escape(resu);
            connexion.query(req, callback);
            connexion.release();
        }
    });
};

/* On récupère la liste des personnes de la BD */
module.exports.getListePersonne = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT per_num, per_nom, per_prenom FROM personne", callback);
            connexion.release();
        }
    });
};

/* On récupère une personne de la BD par son identifiant */
module.exports.getPersonne = function (id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT per_nom, per_prenom, per_tel, per_mail, per_login, per_pwd FROM personne WHERE per_num=" + id, callback);
            connexion.release();
        }
    });
};
/* On ajoute une personne à la BD */
module.exports.ajoutePersonne = function (data, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            var sha256 = crypto.createHash("sha256");
            sha256.update(data.per_pwd, "utf8");
            var resu = sha256.digest("base64");
            data.per_pwd = resu;
            connexion.query("INSERT INTO personne SET ?", data, callback);
            connexion.release();
        }
    });
};

/* On met à jour une personne de la BD */
module.exports.modifiePersonne = function (data, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            if (data.per_pwd != null) {
                var sha256 = crypto.createHash("sha256");
                sha256.update(data.per_pwd, "utf8");
                var resu = sha256.digest("base64");
                data.per_pwd = resu;
            }
            connexion.query("UPDATE personne SET ? WHERE per_num=" + data.per_num, data, callback);
            connexion.release();
        }
    });
};

/* On récupère une personne de la BD par son login */
module.exports.getIdByLogin = function (data, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT per_num FROM personne WHERE per_login='" + data + "'", callback);
            connexion.release();
        }
    });
};

/* On demande si oui ou non la personne est un étudiant */
module.exports.estEtudiant = function (id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT per_nom, per_prenom, per_mail, per_tel, div_nom, vil_nom, e.dep_num, e.div_num FROM personne p JOIN etudiant e on p.per_num=e.per_num JOIN division di on di.div_num=e.div_num JOIN departement de on de.dep_num=e.dep_num JOIN ville v on v.vil_num=de.vil_num WHERE e.per_num=" + id, callback);
            connexion.release();
        }
    });
};

/* On demande si oui ou non la personne est un salarié */
module.exports.estSalarie = function (id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT per_nom, per_prenom, per_mail, per_tel, sal_telprof, fon_libelle, s.fon_num FROM personne p JOIN salarie s on p.per_num=s.per_num JOIN fonction f on f.fon_num=s.fon_num WHERE s.per_num=" + id, callback);
            connexion.release();
        }
    });
};

/* On supprime une personne de la BD */
module.exports.deletePersonne = function (id, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("DELETE FROM personne WHERE per_num=" + id, callback);
            connexion.release();
        }
    });
};