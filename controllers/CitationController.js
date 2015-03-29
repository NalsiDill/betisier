var model = require('../models/citation.js');
var modelSalarie = require('../models/salarie.js');
var modelMot = require('../models/mot.js');
var modelVote = require('../models/vote.js');

/* LISTER CITATION */
module.exports.ListerCitation = function (request, response) {
    response.title = 'Liste des citations';

    model.getListeCitation(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        modelVote.getListeVote(function (err, result2) {
            if (err) {
                console.log(err);
                return;
            }

            for (var index = 0; index < result.length; index++) {
                result[index].estNotable = true;
                for (var index2 = 0; index2 < result2.length; index2++) {
                    // On regarde si la citation a déjà été notée par l'étudiant connecté
                    if (result[index].cit_num == result2[index2].cit_num && result2[index2].per_num == request.session.idPersonne) {
                        result[index].estNotable = false;
                    }
                }
                if (result[index].vot_moy == null) {
                    result[index].vot_moy = 'Aucune note';
                }
            }

            response.listeCitation = result;
            response.nbCitation = result.length;

            response.render('listerCitation', response);
        });
    });

};

/* AJOUTER CITATION */
module.exports.AjouterCitation = function (request, response) {
    response.title = 'Ajouter des citations';

    modelSalarie.getListeSalarie(function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listePersonne = result;
        response.render('ajouterCitation', response);
    });
};

/* INSERER CITATION */
module.exports.InsertCitation = function (request, response) {
    response.title = 'Ajouter des citations';

    modelMot.getListeMot(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }

        var citation = request.body.citation;
        var estCorrecte = true;
        var listeMotsChanges = [];
        
        // Vérification des mots interdits
        for (var index = 0; index < result.length; index++) {
            var mot = result[index].mot_interdit;
            var motInterdit = citation.match(new RegExp(mot, "i"));
            while (motInterdit) {
                estCorrecte = false;
                citation = citation.replace(new RegExp(motInterdit, "g"), '---');
                listeMotsChanges.push(motInterdit);
                motInterdit = citation.match(new RegExp(mot, "i"));
            }
        }

        // On revient sur le formulaire avec les mots interdits changés
        if (estCorrecte == false) {
            response.enseignant = request.body.selectEnseignant;
            response.date = request.body.date;
            response.citation = citation;
            response.motsInterdits = listeMotsChanges;
            modelSalarie.getListeSalarie(function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                response.listePersonne = result;
                response.render('ajouterCitation', response);
            });

        // Pas de mots interdits trouvés
        } else {
            var dateAnglaise = request.body.date;
            var membres = dateAnglaise.split('/');
            dateAnglaise = new Date(membres[2], membres[1]-1, membres[0]);
            data = {
                per_num: parseInt(request.body.selectEnseignant),
                per_num_valide: null,
                per_num_etu: request.session.idPersonne,
                cit_libelle: request.body.citation,
                cit_date: dateAnglaise,
                cit_valide: 0,
                cit_date_valide: null

            };
            model.insertCitation(data);
            response.render('citationAjoutee', response);
        }
    });
};


/* RECHERCHER CITATION */
module.exports.RechercherCitation = function (request, response) {
    response.title = 'Rechercher des citations';

    model.getListeCitationDate(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.listeCitationDate = result;
        model.getListeCitationSalarie(function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            response.listeCitationSalarie = result;
            response.render('rechercherCitation', response);
        });
    });
};

/* CITATION RECHERCHEE */
module.exports.CitationRecherchee = function (request, response) {
    response.title = 'Rechercher des citations';
    var data = {};
    if (request.body.salarie != "0") {
        data.per_num = request.body.salarie;
    }
    if (request.body.date != "0") {
        var dateAnglaise = request.body.date;
        var membres = dateAnglaise.split('/');
        dateAnglaise = membres[2] + "-" + membres[1] + "-" + membres[0];
        data.cit_date = dateAnglaise;
    }
    if (request.body.note != "-1") {
        data.noteMoinsUn = parseInt(request.body.note) - 1;
        data.notePlusUn = parseInt(request.body.note) + 1;
    }
    model.getRechercheCitation(data, function (err, result) {
        if (result != undefined) {
            for (var index = 0; index < result.length; index++) {
                if (result[index].vot_moy == null) {
                    result[index].vot_moy = 'Aucune note';
                }
            }

        }
        response.citation = 1;
        response.listeCitation = result;
        response.render('rechercherCitation', response);
    });
};

/* NOTER CITATION */
module.exports.NoterCitation = function (request, response) {
    var id = parseInt(request.param("id"));
    response.idCitation = id;
    response.render('noterCitation', response);
};

/* CITATION NOTEE */
module.exports.CitationNotee = function (request, response) {
    var data = {
        cit_num: parseInt(request.param("id")),
        per_num: request.session.idPersonne,
        vot_valeur: request.body.note
    }
    modelVote.noteCitation(data, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.render('citationNotee', response);
    });
};

/* VALIDER CITATION */
module.exports.ValiderCitation = function (request, response) {
    response.title = 'Valider des citations';

    model.getListeCitationNonValide(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.listeCitation = result;
        response.nbCitation = result.length;
        response.render('listerCitationNonValide', response);
    });


};

/* CITATION VALIDEE */
module.exports.CitationValidee = function (request, response) {
    var data = {
        cit_num: parseInt(request.param("id")),
        per_num_valide: request.session.idPersonne
    }
    model.citationValidee(data, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
    });

    response.title = 'Valider des citations';

    model.getListeCitationNonValide(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.listeCitation = result;
        response.nbCitation = result.length;
        response.render('citationValidee', response);
    });

};