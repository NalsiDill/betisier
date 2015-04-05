var model = require('../models/ville.js');

/* LISTER VILLE */
module.exports.ListerVille = function (request, response) {
    response.title = 'Liste des villes';

    model.getListeVille(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.listeVille = result;
        response.nbVille = result.length;
        response.render('listerVille', response);
    });
};

/* AJOUTER VILLE */
module.exports.AjouterVille = function (request, response) {
    response.title = 'Ajouter des villes';
    response.render('ajoutVille', response);
};

/* INSERER VILLE */
module.exports.InsertVille = function (request, response) {
    response.title = 'Insertion d\'une ville';
    model.insertVille(request.body.nomVille, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.ville = request.body.nomVille;
        response.ajouter = true;
        response.render('ajoutVille', response);
    });
};

/* SUPPRIMER VILLE */
module.exports.SupprimerVille = function (request, response) {
    response.title = 'Supprimer des villes';

    model.getListeVille(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.listeVille = result;
        response.render('supprimerVille', response);
    });

};

/* VILLE SUPPRIMEE */
module.exports.VilleSupprimee = function (request, response) {
    response.title = 'Supprimer des villes';

    var id = parseInt(request.param("id"));
    model.supprimerVille(id, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
    });

    model.getListeVille(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.listeVille = result;

        response.supprimer = true;
        response.render('supprimerVille', response);
    });

};