var model = require('../models/personne.js');

/* CONNEXION UTILISATEUR */
module.exports.Connect = function (request, response) {
    response.title = 'Connexion';
    // Chiffres pour le captcha
    response.nb1 = Math.floor(Math.random() * (9 - 1 + 1) + 1);
    response.nb2 = Math.floor(Math.random() * (9 - 1 + 1) + 1);
    request.session.total = response.nb1 + response.nb2;
    response.render('connect', response);
};

/* TENTATIVE CONNEXION */
module.exports.TentativeConnexion = function (request, response) {
    var data = {
        login: request.body.username,
        pass: request.body.password
    }
    response.title = 'Connexion';

    model.getLoginOk(data, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        // Si la personne s'est trompé de id/mdp
        if (result == "") {
            response.erreur = "Id/Mdp erroné(s)"
            response.nb1 = Math.floor(Math.random() * (9 - 1 + 1) + 1);
            response.nb2 = Math.floor(Math.random() * (9 - 1 + 1) + 1);
            request.session.total = response.nb1 + response.nb2;
            response.render('connect', response);
            // Si la personne s'est trompé pour le captcha
        } else if (request.session.total != request.body.nb) {
            response.erreur = "Captcha erroné"
            response.nb1 = Math.floor(Math.random() * (9 - 1 + 1) + 1);
            response.nb2 = Math.floor(Math.random() * (9 - 1 + 1) + 1);
            request.session.total = response.nb1 + response.nb2;
            response.render('connect', response);
            // Si la personne a réussi
        } else {
            // Variables de session
            request.session.nom = request.body.username;
            request.session.idPersonne = result[0].per_num;


            if (result[0].per_admin == 1) {
                request.session.admin = 1;
            }
            var id = request.session.idPersonne;
            model.estEtudiant(id, function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }

                if (result != "") {
                    request.session.estEtudiant = true;
                }
            });
            response.render('connection', response);
        }
    });

};

/* DECONNEXION UTILISATEUR */
module.exports.Deconnect = function (request, response) {
    request.session.destroy();
    response.redirect('/connect');
};