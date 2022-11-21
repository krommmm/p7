import { useEffect, useState } from "react";
import varGlobal from "../varGlobal";

//Récupération de l'_id du post dans le sessionStorage
var idDuPoste = sessionStorage.getItem("idDuPost");
var posterId = sessionStorage.getItem("posterId");
//Est-ce le post contient du texte ?
var isText = false;
//Est-ce que le post contient une image ?
var isImage = false;

export default function OnePost() {
  const [list, setList] = useState([]);
  const [user, setUser] = useState([]);
  const [isUser, setIsUser] = useState(false);

  //---------FETCH USER---------------
  useEffect(() => {
    // on utilise le use effect avec le fetch pour que ça ne le fasse qu'une seule fois
    fetch(`${varGlobal}/api/auth/${posterId}`)
      .then((response) => response.json())
      .then(setUser);
  }, []);

  //---------FETCH LIST---------------
  useEffect(() => {
    var identifiant = sessionStorage.getItem("state");
    //Transformation de identifiant en objet pour avoir accès à token et userId
    var identifiantObjet = JSON.parse(identifiant);
    //Récupération de l'id de l'objet
    var id = identifiantObjet.userId;

    //---------------------Récupération du post----------------------
    fetch(`${varGlobal}/api/posts/${idDuPoste}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${identifiantObjet.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setList(data);
        //Est-ce que le post contient un message ?
        if (data.posterMessage !== "undefined") {
          isText = true;
        } else {
          isText = false;
        }

        //Est-ce que le post contient une image ?
        if (data.imageUrl === undefined) {
          isImage = false;
        } else {
          isImage = true;
        }

        //Est-ce que l'utisateur est le propriétaire du post et peut donc voir l'app de modification
        if ((id !== data.posterId) && (identifiantObjet.isAdmin!==true)) {
          setIsUser(false);
        } else {
          setIsUser(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  //Suppression du post
  function handleDelete() {
    var identifiant = sessionStorage.getItem("state");
    //Transformation de identifiant en objet pour avoir accès à token et userId
    var identifiantObjet = JSON.parse(identifiant);
    //Récupération de l'id de l'objet
    var id = identifiantObjet.userId;
    //---------SUPPRESSION du post---------------
    fetch(`${varGlobal}/api/posts/${idDuPoste}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${identifiantObjet.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location = "/";
      })
      .catch((e) => {
        console.log(e);
      });
  }

  //Redirection vers la modification du post
  function handlePut() {
    //Avant la redirection => creation clée "modif" et valeur "ok" pour le user
    sessionStorage.setItem("modif", "ok");
    //Redirection ver l'index (la page user)
    window.location = "/User";
  }

  //Retour à l'accueil
  function handleReturn() {
    window.location = "/";
  }

  return (
    <>
      <div className="OnePost_container">
        <div className="display-container">
          <div className="head-container">
           
              <h1><span className="en-gras">Publié par</span> {user.name}{" "}
              {user.firstName}</h1>
            

            {list.date}
          </div>
          {isText && <p>{list.posterMessage}</p>}
          {isImage && (
            <img
              src={varGlobal + "/images/" + list.imageUrl} alt ="image du post"
              className="images"
            />
          )}
          <br />
          <br />
          <div className="one-post">
            <div type="button" onClick={handleReturn}>
              <i className="fa-solid fa-rotate-left" />
            </div>
            {isUser && (
              <div type="button" onClick={handlePut}>
                <i className="fa-regular fa-pen-to-square" />
              </div>
            )}
            {isUser && (
              <div type="button" onClick={handleDelete}>
                <i className="fa-regular fa-trash-can" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
