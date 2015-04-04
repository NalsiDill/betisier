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
    model.ajoutePersonne(data, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        model.getIdByLogin(data.per_login, function (err, result2) {
            if (err) {
                console.log(err);
                return;
            }
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
                    response.render('etudiantAjoute', response);
                });


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
                    response.render('salarieAjoute', response);
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
                    response.per_pwd = result[0].per_pwd;

                    model.estEtudiant(data, function (err, result) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        if (result != "") {
                            response.dep_num = result[0].dep_num;
                            response.div_num = result[0].div_num;
                            response.render('modifierPersonne', response);
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
        per_login: request.body.loginPers,
        per_pwd: request.body.mdpPers
    };
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
                        response.render('personneModifiee', response);
                    });
                });
            } else {
                modelEtu.updateEtudiant(dataEtudiant, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    response.render('personneModifiee', response);
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
                        response.render('personneModifiee', response);
                    });
                });
            } else {
                modelSal.updateSalarie(dataSalarie, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    response.render('personneModifiee', response);
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
        } else {
            response.etudiant = true;
            response.personne = result;
            response.render('detailPersonne', response);
        }
    });
};