import { useState } from "react";
import varGlobal from "../varGlobal";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  var answer = document.querySelector(".answer-input");  //msg erreur en bas
  var answerMail = document.querySelector(".email-error"); // msg erreur mail 
  var answerPassword = document.querySelector(".password-error"); // msg erreur password

  function HandleLogin(e) {
    e.preventDefault();

    if (
      email == "" ||
      password == "" ||
      answerMail.style.display == "flex" ||
      answerPassword.style.display == "flex"
    ) {
      answer.style.display = "flex";
      answer.innerHTML = "Veuillez complêter le formulaire";
      setTimeout(() => {
        answer.innerHTML = "";
        answer.style.display = "none";
      }, 3000);
    } else {
      fetch(`${varGlobal}/api/auth/login`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // La réponse([userId + token] ou ["paire login/mdp incorrecte"]) est récupéré et placé dans le sessionStorage
          sessionStorage.setItem("state", JSON.stringify(data));
          // le contenu de session Storage est récupéré dans isUserConnected
          var isUserConnected = sessionStorage.getItem("state");
          // Si la réponse sessionStorage = "msg login/mdp incorrecte"=> on supprime le sessionStorage
          if (
            isUserConnected ===
            '{"message":"Paire login/mot de passe incorrecte"}'
          ) {
            sessionStorage.clear();
            answer.style.display = "flex";
            answer.innerHTML = "Paire login/mot de passe incorrecte";
            setTimeout(() => {
              answer.innerHTML = "";
              answer.style.display = "none";
            }, 3000);
            answer.innerHTML = "Paire login/mot de passe incorrecte";
          } else {
            window.location = "/";
          }
        })

        .catch((e) => {
          console.log(e);
        });
    }
  }

  //----------Regex--------------------------
  //Regex pour controller que le format de l'adresse email soit bien respecté
  function regexEmail(e) {
    let testEmailName = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    if (testEmailName.test(e.target.value) || e.target.value == "") {
      document.querySelector(".email-error").style.display = "none";
      document.querySelector(".answer-input").innerHTML = "";
      setEmail(e.target.value);
    } else {
      document.querySelector(".email-error").style.display = "flex";
    }
  }

  function regexPassword(e) {
    //minimum: 10 charactères, 1 majuscule, 1 minuscule, 1 chiffre
    let testPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{12,}$/;
    if (testPassword.test(e.target.value) || e.target.value == "") {
      document.querySelector(".password-error").style.display = "none";
      document.querySelector(".answer-input").innerHTML = "";
      setPassword(e.target.value);
    } else {
      document.querySelector(".password-error").style.display = "flex";
    }
  }

  return (
    <>
      <div className="sign-container">
        <h1>Connectez-vous</h1>
        <br />
        <form action="" onSubmit={HandleLogin} id="sign-in-form">
          <div className="input-things">
            <label htmlFor="email">Email</label>
            <br />
            <input
              type="text"
              name="email"
              id="email"
              placeholder="enter email"
              onChange={(e) => regexEmail(e)}
            />
            <div className="email-error">
              Veuillez entrer<br/> une adresse email valide.
            </div>
            <br />
            <label htmlFor="password">Mot de passe</label>
            <br />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="enter password"
              onChange={(e) => regexPassword(e)}
            />
            <div className="password-error">
              Minimum:
              <br /> 12 caractères
              <br />
              (hors charactères spéciaux),
              <br /> 1 majuscule,
              <br /> 1 minuscule,
              <br /> 1 chiffre
            </div>
          </div>
          <br />
          <input type="submit" className="submit" value="Valider inscription" />
          <div className="answer-input"></div>
        </form>
      </div>
    </>
  );
};

export default SignInForm;
