import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import { useState } from "react";
import "../../styles/Sign.css";

const Log = () => {
  const [signUpModal, setSignUpModal] = useState(true);//Modèle inscription if true affiche le composant signUp
  const [signInModal, setSignInModal] = useState(false);//Modèle connexion if true affiche le composante signIn
  const [isSignActive, setIsSignActive] = useState(true);//Partie SignUp du menu if true l'affiche en rouge
  const [isLogActive, setIsLogActive] = useState(false); // Partie login du menu if true l'affiche en gris


  function handleModals(e) {
    if (e.target.id === "register") {
      setSignInModal(false);
      setSignUpModal(true);

      setIsSignActive(true);
      setIsLogActive(false);
    } else if (e.target.id === "login") {
      setSignInModal(true);
      setSignUpModal(false);

      setIsSignActive(false);
      setIsLogActive(true);
    }
  }

  return (
    <>
      <div className="connexion-form">
        <div className="form-container">
          <ul>
            <li
              style={{ backgroundColor: isSignActive ? "#FD2D01" : "grey" }}
              id="register"
              onClick={handleModals}
            >
              S'inscrire
            </li>
            <li
              style={{ backgroundColor: isLogActive ? "#FD2D01" : "grey" }}
              id="login"
              onClick={handleModals}
            >
              Se connecter
            </li>
          </ul>
          {signUpModal && <SignUpForm />}
          {signInModal && <SignInForm />}
        </div>
      </div>
    </>
  );
};
export default Log;
