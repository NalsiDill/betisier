var model = require('../models/personne.js');
var departement = require('../models/departement.js');


// ////////////////////// L I S T E R     P E R S O N N E S 

module.exports.ListerPersonne = function (request, response) {
    response.title = 'Liste des personnes';

    model.getListePersonne(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.listePersonne = result;
        response.nbPersonne = result.length;
        response.render('listerPersonne', response);
    });
};

// ////////////////////// A J O U T E R     P E R S O N N E S 

module.exports.AjouterPersonne = function (request, response) {
    response.title = 'Ajouter une personne';
    response.render('ajouterPersonne', response);
};

module.exports.AjoutePersonne = function (request, response) {
    // ajout de la personne en base
    data = {
        per_nom: request.body.nomPers,
        per_prenom: request.body.prenomPers,
        per_tel: request.body.telPers,
        per_mail: request.body.mailPers,
        per_admin: 0,
        per_login: request.body.loginPers,
        per_pwd: request.body.mdpPers
    };
    console.log('ajout : ', data);
    model.ajoutePersonne(data);
    // renvoi du numéro de la personne pour la page suivante
    response.numero = request.insertId;
    // teste si la redirection est vers la page étudiant ou salarié
    if (request.body.catPers == "Etudiant") {
        response.title = 'Ajouter un étudiant';
        // liste des départements
        response.deps = departement.GetAllDepartements();
        response.render('ajouterEtudiant', response);
    } else {
        response.title = 'Ajouter un salarié';
        response.render('ajouterSalarie', response);
    };
};

module.exports.EtudiantAjoute = function (request, response) {
    data = {
        per_num: request.numero,
        dep_num: request.body.departement,
        div_num: request.body.annee
    }
    response.title = 'Ajout de l\'étudiant réussi';
    // ajout en base avec result.insertId pour le n° de personne
    // connexion.query("INSERT INTO personne SET ?", data, callback);
    response.render('etudiantAjoute', response);
}

module.exports.SalarieAjoute = function (request, response) {
        response.title = 'Ajout du salarié réussi';
        response.render('salarieAjoute', response);
    }
    // ////////////////////// A F F I C H E R    P E R S O N N E

module.exports.DetailPersonne = function (request, response) {
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
