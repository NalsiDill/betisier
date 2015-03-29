var db = require('../configDb');

/* Récupère les citations valides */
module.exports.getListeCitation = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT c.cit_num, per_nom, per_prenom, cit_libelle, DATE_FORMAT(cit_date, '%d/%m/%Y') AS cit_date, AVG(vot_valeur) as vot_moy FROM citation c LEFT JOIN personne p ON c.per_num = p.per_num LEFT JOIN vote v on v.cit_num=c.cit_num WHERE cit_valide = 1 GROUP BY c.cit_num ", callback);
            
            connexion.release();
        }
    });
};

/* Récupère les citations non valides */
module.exports.getListeCitationNonValide = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT cit_num, per_nom, per_prenom, cit_libelle, DATE_FORMAT(cit_date, '%d/%m/%Y') AS cit_date FROM citation c JOIN personne p ON c.per_num = p.per_num WHERE cit_valide = 0", callback);

            connexion.release();
        }
    });
};

/* Récupère seulement les dates des citations */
module.exports.getListeCitationDate = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT c.cit_num, date_format(cit_date, '%d/%m/%Y') as cit_date FROM citation c WHERE cit_valide=1 GROUP BY c.cit_date", callback);
            connexion.release();
        }
    });
};

/* Récupère seulement les salariés des citations */ 
module.exports.getListeCitationSalarie = function (callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query("SELECT c.cit_num, c.per_num, per_nom , per_prenom FROM citation c JOIN personne p ON c.per_num = p.per_num WHERE cit_valide=1 GROUP BY c.per_num", callback);
            connexion.release();
        }
    });
};

/* Insère une citation dans la BD */
module.exports.insertCitation = function (data, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query('INSERT INTO citation SET ? ', data, callback);
            connexion.release();
        }
    });
};

/* Valide une citation dans la BD */
module.exports.citationValidee = function (data, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            connexion.query('UPDATE citation SET cit_valide = 1, per_num_valide=' + data.per_num_valide + ', cit_date_valide=CURDATE() WHERE cit_num=' + data.cit_num, callback);
            connexion.release();
        }
    });
};

/* Récupère les citations suivant les arguments de "data" */
module.exports.getRechercheCitation = function (data, callback) {
    db.getConnection(function (err, connexion) {
        if (!err) {
            var requete = "SELECT c.cit_num, per_nom, per_prenom, cit_libelle, DATE_FORMAT(cit_date, '%d/%m/%Y') AS cit_date, AVG(vot_valeur) as vot_moy FROM citation c LEFT JOIN personne p ON c.per_num = p.per_num LEFT JOIN vote v on v.cit_num=c.cit_num WHERE cit_valide = 1";
            if (data.per_num) {
                requete += " AND c.per_num=" + data.per_num;
            }
            if (data.cit_date) {
                requete += " AND cit_date='" + data.cit_date+"'";
            }
            requete += " GROUP BY c.cit_num";
            if (data.noteMoinsUn) {
                requete += " HAVING vot_moy>=" + data.noteMoinsUn + " AND vot_moy<=" + data.notePlusUn;
            }
        }
        connexion.query(requete, callback);
        connexion.release();
    });
};