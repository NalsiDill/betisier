var model = require('../models/citation.js');
var modelPersonne = require('../models/personne.js');
   
// ////////////////////////////////////////////// L I S T E R     C I T A T I O N 
   
module.exports.ListerCitation = 	function(request, response){
   response.title = 'Liste des citations';
    
    model.getListeCitation( function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeCitation = result;
        response.nbCitation = result.length;
        response.render('listerCitation', response);
    });
  } ;   

// ////////////////////////////////////////////// A J O U T E R     C I T A T I O N 
   
module.exports.AjouterCitation = 	function(request, response){
	response.title = 'Ajouter des citations';
	
	modelPersonne.getListePersonne( function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listePersonne = result;
		response.render('ajouterCitation', response);
    });
};

// ////////////////////////////////////////////// I N S E R E R    C I T A T I O N 
   
module.exports.InsertCitation = 	function(request, response){
	response.title = 'Ajouter des citations';
	data = {
        per_num: parseInt(request.body.selectEnseignant),
        per_num_valide: null,
        per_num_etu: request.session.idPersonne,
        cit_libelle: request.body.citation,
        cit_date: "2012-02-02",  /*AFFAIRE*/
        cit_valide: 0,
        cit_date_valide: null,
		cit_date_depo: "2012-02-02" /*AFFAIRE*/
		
    };
	model.insertCitation(data);
	response.render('citationAjoutee', response);
};   


// ////////////////////////////////////////////// R E C H E R C H E R     C I T A T I O N 
   
module.exports.RechercherCitation = function(request, response){
   response.title = 'Rechercher des citations';
   response.render('rechercherCitation', response);
 
     		 
  } ; 

