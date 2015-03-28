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
                    if (result[index].cit_num == result2[index2].cit_num && result2[index2].per_num == request.session.idPersonne) {
                        result[index].estNotable = false;
                    }
                }
                if(result[index].vot_moy == null){
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

/* INSERER CTATION */
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

        } else {
            var dateAnglaise = request.body.date;
            var membres = dateAnglaise.split('/');
            dateAnglaise = new Date(membres[2], membres[1], membres[0]);
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
    response.render('rechercherCitation', response);


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
    var id = parseInt(request.param("id"));
    model.citationValidee(id, function (err, result) {
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