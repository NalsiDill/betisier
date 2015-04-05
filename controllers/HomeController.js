/* ACCUEIL */
module.exports.Index = function (request, response) {
    response.title = "Bienvenue sur le site du bêtisier de l'IUT.";
    response.render('home', response);
};

/* ACCES REFUSE */
module.exports.AccesRefuse = function (request, response) {
    response.title = "Accès refusé";
    response.render('accesRefuse', response);
};