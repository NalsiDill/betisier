var db = require('../configDb');

module.exports.insertEtudiant = function (data, callback) {
    db.getConnection(function(err, connexion){
        if(!err){
            connexion.query("INSERT INTO etudiant SET ?", data, callback);
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