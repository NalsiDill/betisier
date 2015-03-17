// appel du module pour le cryptage du mot de passe
var crypto=require('crypto');
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
	db.getConnection(function(err, connexion){
	    if(!err){
		var sha256 = crypto.createHash("sha256"); // cryptage en sha256
		sha256.update(data.pass, "utf8");
		var resu = sha256.digest("base64");	
		//console.log ('Mot de passe en clair : ' + data.pass); 
		//console.log ('Mot de passe crypté : ' + resu);	 	
			req= "SELECT per_num from personne where per_login =" + connexion.escape(data.login) + " and per_pwd = " +connexion.escape(resu);
		//console.log(req);
		connexion.query(req, callback);
		connexion.release();
	     }
   	});
};

module.exports.getListePersonne = function (callback) {
	db.getConnection(function(err, connexion){
	    if(!err){
		connexion.query("SELECT per_num, per_nom, per_prenom FROM personne", callback);
		connexion.release();
	    }
   	});
};

module.exports.getPersonne = function (id, callback) {
	db.getConnection(function(err, connexion){
	    if(!err){
		connexion.query("SELECT per_prenom FROM personne WHERE per_num="+id, callback);
		connexion.release();
	    }
   	});
};

module.exports.ajoutePersonne = function (data, callback) {
    db.getConnection(function(err, connexion){
        if(!err){
            console.log(data);
            connexion.query("INSERT INTO personne SET ?", data, callback);
            connexion.release();
        }
    });
}

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