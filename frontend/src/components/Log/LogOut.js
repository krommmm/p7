function Logout() {
  //Suppression du sessionStorage pour déconnecté l'utilisateur.
  sessionStorage.clear();
  //Redirection vers la page d'accueil
  window.location = "/";
}

export default Logout;
