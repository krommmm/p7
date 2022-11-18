import { useState } from "react";
import varGlobal from "../../components/varGlobal";

export default function MyProfil() {
  const [image, setImage] = useState(); // Contient l'image

  const [infoPost, setInfoPost] = useState([]); // Contient le post plus l'id du post

  //Vérification du type de identifiant(sessionStorage)
  var identifiant = sessionStorage.getItem("state");
  //Transformation de identifiant en objet pour avoir accès à token et userId
  var identifiantObjet = JSON.parse(identifiant);
  //Récupération de l'id de l'objet
  var id = identifiantObjet.userId;

  //Apercu de l'avatar avant de l'envoyer
  function handleImage(e) {
    document.getElementById("blah").src = window.URL.createObjectURL(e);
  }

  //Transformation donnée + modification de l'avatar
  function HandleProfil(e) {
    e.preventDefault();

    //Si l'image ou le fichier n'est pas indéfini => le transforme en data
    if (image !== undefined) {
      const data = new FormData();
      data.append("image", image);
      

      fetch(`${varGlobal}/api/auth/${id}`, {
        method: "PUT",
        "Content-Type": "multipart/form-data",
        headers: {
          Authorization: `Bearer ${identifiantObjet.token}`, // pour le backend middleware/auth.js qui recup req.headers.authorization
        },
        body: data,
      })
        .then((response) => response.json())
        .then((donnée) => {
          setInfoPost(donnée); //Envoit dans le state l'_id du post

          window.location = "/";
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.log("image undefined");
    }
  }

  //Suppression de l'avatar
  function handleDelete() {
    fetch(`${varGlobal}/api/auth/${id}`, {
      method: "PATCH",
      Accept: "application/json",
      "Content-Type": "application/json",
      headers: {
        Authorization: `Bearer ${identifiantObjet.token}`,
      },
    })
      .then((response) => response.json())
      .then((donnée) => {
        window.location = "/";
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <>
      <div className="myProfil-container">
        <div className="myProfile-sous-container">
          <h1>Un nouveau look ?</h1> 
          <form
            method="POST"
            className="petit-formulaire"
            onSubmit={HandleProfil}
          >
            <div className="margin-bottom-20px">
              <img id="blah" width="200" height="100%" alt=""/>
            </div>
            <br />
            <br />
            <div className="margin-bottom-20px">
              <label htmlFor="image" id="btn-image">
                Changer d'avatar... <i className="fa-solid fa-user" />
                <br />
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={(e) => {
                    {
                      setImage(e.target.files[0]);
                    }
                    {
                      handleImage(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
            <br />
            <br />
            <div className="espace-bouton">
              <div className="margin-bottom-20px">
                <label htmlFor="envoyer-image">
                  Selectionner...
                  <i className="fa-solid fa-paper-plane" />
                </label>
              </div>
              <input type="submit" id="envoyer-image" value="Postez" />
            </div>

            <br />
            <br />
            <div type="button" className="bouton-rouge" onClick={handleDelete}>
              Supprimer
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
