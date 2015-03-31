var db = require('../configDb');

module.exports.insertSalarie = function (data, callback) {
    db.getConnection(function(err, connexion){
        if(!err){
            connexion.query("INSERT INTO salarie SET ?", data, callback);
            connexion.release();
        }
    });
};

module.exports.getListeSalarie = function (callback) {
	db.getConnection(function(err, connexion){
	    if(!err){
		connexion.query("SELECT s.per_num, per_nom, per_prenom FROM salarie s JOIN personne p on s.per_num=p.per_num", callback);
		connexion.release();
	    }
   	});
};
