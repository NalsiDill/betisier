var model = require('../models/personne.js');
var modelDep = require('../models/departement.js');
var modelDiv = require('../models/division.js');
var modelFon = require('../models/fonction.js');
var modelEtu = require('../models/etudiant.js');
var modelSal = require('../models/salarie.js');


/* LISTER PERSONNE */
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

/* AJOUTER PERSONNE */
module.exports.AjouterPersonne = function (request, response) {
    response.title = 'Ajouter une personne';

    modelDep.getAllDepartements(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.listeDep = result;

        modelDiv.getAllDivisions(function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            response.listeDiv = result;

            modelFon.getAllFonctions(function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                response.listeFon = result;
                response.render('ajouterPersonne', response);
            });
        });
    });
};

/* INSERER PERSONNE */
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
    // On ajoute la personne dans la BD
    model.ajoutePersonne(data, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        // On récupère son id par son login
        model.getIdByLogin(data.per_login, function (err, result2) {
            if (err) {
                console.log(err);
                return;
            }
            // Si la personne est un étudiant
            if (request.body.categorie == "etudiant") {
                dataEtudiant = {
                    per_num: result2[0].per_num,
                    dep_num: request.body.selectDep,
                    div_num: request.body.selectDiv
                }

                modelEtu.insertEtudiant(dataEtudiant, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    response.ajouterEtu = true;
                    response.render('ajouterPersonne', response);
                });

                // Si la personne est un salarié
            } else if (request.body.categorie == "salarie") {
                dataSalarie = {
                    per_num: result2[0].per_num,
                    sal_telprof: request.body.telPro,
                    fon_num: request.body.selectFon
                }
                modelSal.insertSalarie(dataSalarie, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    response.ajouterSal = true;
                    response.render('ajouterPersonne', response);
                });

            } else {
                console.log("Houston, nous avons un problème !");
            }
        });
    });
};

/* SUPPRIMER PERSONNE */
module.exports.SupprimerPersonne = function (request, response) {
    response.title = 'Supprimer des personnes';

    model.getListePersonne(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.listePersonne = result;
        response.render('supprimerPersonne', response);
    });
};

/* PERSONNE SUPPRIMEE */
module.exports.PersonneSupprimee = function (request, response) {
    var id = request.params.id;
    response.title = 'Supprimer des personnes';

    model.estEtudiant(id, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        // Si c'est un étudiant
        if (result != "") {
            modelEtu.deleteEtudiant(id, function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }

                model.deletePersonne(id, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    response.suppression = true;
                    response.render('supprimerPersonne', response);
                });
            });
            // Si c'est un salarié
        } else {
            modelSal.deleteSalarie(id, function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                model.deletePersonne(id, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    response.suppression = true;
                    response.render('supprimerPersonne', response);
                });
            });
        }
    });
};

/* MODIFIER PERSONNE */
module.exports.ModifierPersonne = function (request, response) {
    var data = request.params.id;
    response.title = 'Modifier une personne';
    response.per_num = data;
    modelDep.getAllDepartements(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.listeDep = result;

        modelDiv.getAllDivisions(function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            response.listeDiv = result;

            modelFon.getAllFonctions(function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                response.listeFon = result;

                // On récupère les infos de la personne à modifier
                model.getPersonne(data, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    response.per_nom = result[0].per_nom;
                    response.per_prenom = result[0].per_prenom;
                    response.per_tel = result[0].per_tel;
                    response.per_mail = result[0].per_mail;
                    response.per_login = result[0].per_login;

                    model.estEtudiant(data, function (err, result) {
                        if (err) {
                            console.log(err);
                            return;
                        }

                        // Infos supplémentaires si la personne est un étudiant
                        if (result != "") {
                            response.dep_num = result[0].dep_num;
                            response.div_num = result[0].div_num;
                            response.render('modifierPersonne', response);
                            // Infos supplémentaires si la personne est un salarié
                        } else {
                            model.estSalarie(data, function (err, result) {
                                if (err) {
                                    console.log(err);
                                    return;
                                }

                                response.sal_telprof = result[0].sal_telprof;
                                response.fon_num = result[0].fon_num;
                                response.render('modifierPersonne', response);
                            });
                        }
                    });
                });
            });
        });
    });
};

/* PERSONNE MODIFIEE */
module.exports.PersonneModifiee = function (request, response) {
    var id = request.params.id;
    data = {
        per_num: id,
        per_nom: request.body.nomPers,
        per_prenom: request.body.prenomPers,
        per_tel: request.body.telPers,
        per_mail: request.body.mailPers,
        per_admin: 0,
        per_login: request.body.loginPers

    };
    // On regarde si le mot de passe a voulu être chnagé
    if (request.body.changerMdp == "changerMdp") {
        data.per_pwd = request.body.mdpPers;
    }
    model.modifiePersonne(data, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        if (request.body.categorie == "etudiant") {
            dataEtudiant = {
                per_num: id,
                dep_num: request.body.selectDep,
                div_num: request.body.selectDiv
            };
            // Test si la personne était un salarié
            if (request.body.fon) {
                // Dans le cas d'un changement, on supprime dans salarié et on le rajoute dans étudiant
                modelSal.deleteSalarie(data.per_num, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    modelEtu.insertEtudiant(dataEtudiant, function (err, result) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        response.modifier = true;
                        response.render('modifierPersonne', response);
                    });
                });
            } else {
                // Dans l'autre, on met juste à jour dans étudiant
                modelEtu.updateEtudiant(dataEtudiant, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    response.modifier = true;
                    response.render('modifierPersonne', response);
                });
            }

        } else if (request.body.categorie == "salarie") {
            dataSalarie = {
                per_num: id,
                sal_telprof: request.body.telPro,
                fon_num: request.body.selectFon
            };
            // Test si la personne était un étudiant
            if (request.body.dep) {
                // Dans le cas d'un changement, on supprime dans étudiant et on le rajoute dans salarié
                modelEtu.deleteEtudiant(data.per_num, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    modelSal.insertSalarie(dataSalarie, function (err, result) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        response.modifier = true;
                        response.render('modifierPersonne', response);
                    });
                });
            } else {
                // Dans l'autre, on met juste à jour dans salarié
                modelSal.updateSalarie(dataSalarie, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    response.modifier = true;
                    response.render('modifierPersonne', response);
                });
            }
        }
    });
};


/* AFFICHER DETAILS PERSONNE */
module.exports.DetailPersonne = function (request, response) {
    var data = request.params.id;
    response.title = 'Detail personne';

    model.estEtudiant(data, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        // Si c'est un salarié
        if (result == "") {
            model.estSalarie(data, function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }

                response.etudiant = false;
                response.personne = result;
                response.render('detailPersonne', response);
            });
            // Sinon, c'est un étudiant
        } else {
            response.etudiant = true;
            response.personne = result;
            response.render('detailPersonne', response);
        }
    });
};