import { useEffect, useState } from "react";
import varGlobal from "../varGlobal";

//inscription
const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prénom, setPrénom] = useState("");
  const [nom, setNom] = useState("");
  const [user, setUser] = useState([]); //Tous les utilisateurs dans la bdd

  var answer = document.querySelector(".answer-input");
  var answerEmail = document.querySelector(".email-error");
  var answerPassword = document.querySelector(".password-error");
  var answerPrénom = document.querySelector(".prénom-error");
  var answerNom = document.querySelector(".nom-error");
  var answerMaj = document.querySelector(".maj-error");
  var answerMin = document.querySelector(".min-error");
  var answerNb = document.querySelector(".nb-error");
  var answerSpecial = document.querySelector(".charSpecial-error");

  var isTaken = false; // Si un utilisateur a la même email que le mail de l'inscription

  //Récupération des utilisateurs
  useEffect(() => {
    fetch(`${varGlobal}/api/auth/`, { 
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function HandleLogin(e) {
    e.preventDefault();

    //Si l'utilisateur est dans la bdd alors isTaken =true
    for (var a = 0; a < user.length; a++) {
      if (user[a].email.includes(email)) {
        isTaken = true;
      }
    }

    //Si au moins un des inputs du formulaire n'est pas remplit ou si un msg d'erreur est actif => affiche msg erreur
    if (
      email == "" ||
      password == "" ||
      prénom == "" ||
      nom == "" ||
      answerMaj == "" ||
      answerMin == "" ||
      answerNb == "" ||
      answerSpecial == "" ||
      answer.style.display == "flex" ||
      answerEmail.style.display == "flex" ||
      answerPassword.style.display == "flex" ||

      answerMaj.style.display == "flex" ||
      answerMin.style.display == "flex" ||
      answerNb.style.display == "flex" ||
      answerSpecial.style.display == "flex" ||

      answerPrénom.style.display == "flex" ||
      answerNom.style.display == "flex"
    ) {
      answer.style.display = "flex";
      answer.innerHTML = "Veuillez complêter le formulaire";
      setTimeout(() => {
        answer.innerHTML = "";
        answer.style.display = "none";
      }, 3000);
    } else {
      //Sinon post l'info et => affiche msg validation
      if (!isTaken) {
        fetch(`${varGlobal}/api/auth/signup`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            name: prénom,
            firstName: nom,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            answer.style.display = "flex";
            answer.innerHTML = "Utilisateur créé";
            setTimeout(() => {
              answer.style.display = "none";
              answer.innerHTML = "";
              window.location = "/";
            }, 3000);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        //Si isTaken = true(le mail du formulaire est déjà dans la bdd) => ne post pas et affiche msg erreur
        answer.style.display = "flex";
        answer.innerHTML = "Email déjà prit";
        setTimeout(() => {
          answer.innerHTML = "";
          answer.style.display = "none";
        }, 3000);
      }
    }
  }

  //----------Regex--------------------------
  function regexEmail(e) {
    setEmail(e.target.value);
    let testEmailName = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;

    if (testEmailName.test(e.target.value) || e.target.value == "") {
      document.querySelector(".email-error").style.display = "none";
      document.querySelector(".answer-input").innerHTML = "";
    } else {
      document.querySelector(".email-error").style.display = "flex";
    }
  }
  
  function regexPassword(e) {
    setPassword(e.target.value);
    let testPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{12,}$/;
    let testMajuscule= /[A-Z]/;
    let testMinuscule = /[a-z]/;
    let testChiffre = /[0-9]/;
    let testCharSpecial = /[\^>$*<%+=@!,;:?.]/;
    let test12Char = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=^.{12,}$)/;
    //Si problème avec espace /[\S]/ ou \S

    if (testMajuscule.test(e.target.value) || e.target.value == "") {
      document.querySelector(".maj-error").style.display = "none";
      document.querySelector(".answer-input").innerHTML = "";
    } else {
      document.querySelector(".maj-error").style.display = "flex";
    }
  

    if (testMinuscule.test(e.target.value) || e.target.value == "") {
      document.querySelector(".min-error").style.display = "none";
      document.querySelector(".answer-input").innerHTML = "";
    } else {
      document.querySelector(".min-error").style.display = "flex";
    }

    if (testChiffre.test(e.target.value) || e.target.value == "") {
      document.querySelector(".nb-error").style.display = "none";
      document.querySelector(".answer-input").innerHTML = "";
    } else {
      document.querySelector(".nb-error").style.display = "flex";
    }

    if (testCharSpecial.test(e.target.value) || e.target.value == "") {
      document.querySelector(".charSpecial-error").style.display = "none";
      document.querySelector(".answer-input").innerHTML = "";
    } else {
      document.querySelector(".charSpecial-error").style.display = "flex";
    }

    if (test12Char.test(e.target.value) || e.target.value == "") {
      document.querySelector(".password-error").style.display = "none";
      document.querySelector(".answer-input").innerHTML = "";
    } else {
      document.querySelector(".password-error").style.display = "flex";
    }

   /*
    if (testPassword.test(e.target.value) || e.target.value == "") {
      document.querySelector(".password-error").style.display = "none";
      document.querySelector(".answer-input").innerHTML = "";
    } else {
      document.querySelector(".password-error").style.display = "flex";
    }

    */



  }

  function regexName(e) {
    setPrénom(e.target.value);
    let testName =
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}$/i;
    if (testName.test(e.target.value) || e.target.value == "") {
      document.querySelector(".prénom-error").style.display = "none";
      document.querySelector(".answer-input").innerHTML = "";
    } else {
      document.querySelector(".prénom-error").style.display = "flex";
    }
  }

  function regexFirstName(e) {
    setNom(e.target.value);
    let testFirstName =
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}$/i;
    if (testFirstName.test(e.target.value) || e.target.value == "") {
      document.querySelector(".nom-error").style.display = "none";
      document.querySelector(".answer-input").innerHTML = "";
    } else {
      document.querySelector(".nom-error").style.display = "flex";
    }
  }

  return (
    <>
      <div className="sign-container">
        <h1>Inscrivez-vous</h1>
        <br />
        <form action="" onSubmit={HandleLogin} id="sign-up-form">
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
            Veuillez entrer <br />
            une adresse email valide
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
          <div className="errors">
          <div className="password-error">minimum: 12 caractères  {/*(hors charactères spéciaux)*/}</div>
            <div className="maj-error">1 majuscule</div>
            <div className="min-error"><br/>1 minuscule</div>
            <div className="nb-error">1 chiffre</div>
            <div className="charSpecial-error">1 charactère spécial</div>
            </div>
            
          <label htmlFor="prénom">Prénom</label>
          <br />
          <input
            type="text"
            name="prénom"
            id="prénom"
            placeholder="enter prénom"
            onChange={(e) => regexName(e)}
          />
          <div className="prénom-error">Minimum 2 lettres</div>
          <br />
          <label htmlFor="nom">Nom</label>
          <br />
          <input
            type="text"
            name="nom"
            id="nom"
            placeholder="enter nom"
            onChange={(e) => regexFirstName(e)}
          />
          <div className="nom-error">Minimum 2 lettres</div>
          <br />
          <input type="submit" className="submit" value="Valider inscription" />
          <div className="answer-input"></div>
        </form>
      </div>
    </>
  );
};

export default SignUpForm;
