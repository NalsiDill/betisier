

  // ////////////////////////////////////////////// A C C U E I L
module.exports.Index = function(request, response){
    response.title = "Bienvenue sur le site du bêtisier de l'IUT.";
    response.render('home', response);
};


module.exports.AccesRefuse = function(request, response){
    response.title = "Accès refusé";
    response.render('accesRefuse', response);
};


