
var model = require('../models/personne.js');
  
    
// ////////////////////////////////////////////// L I S T E R     P E R S O N N E S 
   
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

   response.render('listerPersonne', response);  
};   

// ////////////////////////////////////////////// A J O U T E R     P E R S O N N E S 
   
module.exports.AjouterPersonne = function(request, response){
   response.title = 'Ajout des personnes';

   response.render('ajouterPersonne', response);  
}; 