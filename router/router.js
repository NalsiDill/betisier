var HomeController = require('./../controllers/HomeController');
var ConnectController = require('./../controllers/ConnectController');
var PersonneController = require('./../controllers/PersonneController');
var CitationController = require('./../controllers/CitationController');
var VilleController = require('./../controllers/VilleController');

function verifConnecte(request, response, next){
    if(request.session.idPersonne){
        next();
    } else {
        response.redirect('/accesRefuse'); 
    }
}

function verifAdmin(request, response, next){
    if(request.session.admin){
        next();
    } else {
        response.redirect('/accesRefuse'); 
    }
}

function verifEtudiant(request, response, next){
    if(request.session.estEtudiant){
        next();
    } else {
        response.redirect('/accesRefuse'); 
    }
}

// Routes
module.exports = function (app) {

    // Main Routes
    app.get('/', HomeController.Index);
    app.get('/accesRefuse', HomeController.AccesRefuse);

    // citations
    app.get('/listerCitation', CitationController.ListerCitation);
    app.get('/ajouterCitation', verifEtudiant, CitationController.AjouterCitation);
    app.post('/insertCitation', verifEtudiant, CitationController.InsertCitation);
    app.get('/rechercherCitation', verifConnecte, CitationController.RechercherCitation);
    app.post('/rechercherCitation', CitationController.CitationRecherchee);
    app.get('/validerCitation', verifAdmin, CitationController.ValiderCitation);
    app.get('/citationValidee/:id', verifAdmin, CitationController.CitationValidee);
    app.get('/noterCitation/:id', verifEtudiant, CitationController.NoterCitation);
    app.post('/citationNotee/:id', verifEtudiant, CitationController.CitationNotee);
    app.get('/supprimerCitation', verifAdmin, CitationController.SupprimerCitation);
    app.get('/supprimerCitation/:id', verifAdmin, CitationController.CitationSupprimee);

    // villes
    app.get('/listerVille', VilleController.ListerVille);
    app.get('/ajouterVille', verifConnecte, VilleController.AjouterVille);
    app.post('/insertVille', verifConnecte, VilleController.InsertVille);
    app.get('/modifierVille', verifAdmin, VilleController.ModifierVille);
    app.get('/supprimerVille', verifAdmin, VilleController.SupprimerVille);
    app.get('/supprimerVille/:id', verifAdmin, VilleController.VilleSupprimee);

    // connection
    app.get('/connect', ConnectController.Connect);
    app.post('/tentativeConnexion', ConnectController.TentativeConnexion);
    app.get('/deconnect', ConnectController.Deconnect);

    //personne
    app.get('/listerPersonne', PersonneController.ListerPersonne);
    app.get('/detailPersonne/:id', PersonneController.DetailPersonne);
    app.get('/ajouterPersonne', verifAdmin, PersonneController.AjouterPersonne);
    app.post('/etudiantAjoute', verifAdmin, PersonneController.EtudiantAjoute);
    app.post('/salarieAjoute', verifAdmin, PersonneController.SalarieAjoute);

    // tout le reste
    app.get('*', HomeController.Index);
    app.post('*', HomeController.Index);

};