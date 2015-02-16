
var model = require('../models/personne.js');
  
    
// ////////////////////// L I S T E R     P E R S O N N E S 
   
module.exports.ListerPersonne = function(request, response){
   response.title = 'Liste des personnes';
   
   model.getListePersonne( function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listePersonne = result;
        response.nbPersonne = result.length;
        response.render('listerPersonne', response);
    }); 
};   

// ////////////////////// A J O U T E R     P E R S O N N E S 
   
module.exports.AjouterPersonne = function(request, response){
   response.title = 'Ajout des personnes';
   response.render('ajouterPersonne', response);  
}; 

// ////////////////////// A F F I C H E R    P E R S O N N E

module.exports.DetailPersonne = function(request, response){
   var data = request.params.id;
   response.title = 'Detail personne';
   
   model.estEtudiant(data, function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        if (result == "") {
	     model.estSalarie(data, function (err, result) {
		if (err) {
		    // gestion de l'erreur
		    console.log(err);
		    return;
		}
		  
		  response.etudiant = false;
		  response.personne = result;
		  response.render('detailPersonne', response);
	      });
	} else {
	  response.etudiant = true;
	  response.personne = result;
	  response.render('detailPersonne', response);
	}
    }); 
}; 