var db = require('../configDb');

module.exports.insertEtudiant = function (data, callback) {
    db.getConnection(function(err, connexion){
        if(!err){
            connexion.query("INSERT INTO etudiant SET ?", data, callback);
            connexion.release();
        }
    });
};

module.exports.estEtudiant = function (id, callback) {
	db.getConnection(function(err, connexion){
	    if(!err){
		connexion.query("SELECT per_nom, per_prenom, per_mail, per_tel, div_nom, vil_nom FROM personne p JOIN etudiant e on p.per_num=e.per_num JOIN division di on di.div_num=e.div_num JOIN departement de on de.dep_num=e.dep_num JOIN ville v on v.vil_num=de.vil_num WHERE e.per_num="+id, callback);
		connexion.release();
	    }
   	});
};

module.exports.estSalarie = function (id, callback) {
	db.getConnection(function(err, connexion){
	    if(!err){
		connexion.query("SELECT per_nom, per_prenom, per_mail, per_tel, sal_telprof, fon_libelle FROM personne p JOIN salarie s on p.per_num=s.per_num JOIN fonction f on f.fon_num=s.fon_num WHERE s.per_num="+id, callback);
		connexion.release();
	    }
   	});
};

module.exports.deleteEtudiant = function (data, callback) {
    db.getConnection(function(err, connexion){
        if(!err){
            connexion.query("DELETE FROM etudiant WHERE per_num="+data, callback);
            connexion.release();
        }
    });
};

module.exports.updateEtudiant = function (data, callback) {
    db.getConnection(function(err, connexion){
        if(!err){
            connexion.query("UPDATE etudiant SET ? WHERE per_num="+data.per_num, data, callback);
            connexion.release();
        }
    });
};