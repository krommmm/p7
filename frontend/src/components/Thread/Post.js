import React from "react";
import { useState } from "react";
import varGlobal from "../varGlobal";

export default function Post() {
  const [image, setImage] = useState();
  const [post, setPost] = useState(); // contient le msg
  const [infoPost, setInfoPost] = useState([]); // contient le post plus l'id du post

  //Pour afficher ou non le alt de l'image en preview
  var isPreview = false;

  var time = new Date();
  time =
    time.getDate() +
    "-" +
    (time.getMonth() + 1) +
    "-" +
    time.getFullYear() +
    " à " +
    time.getHours() +
    "h" +
    time.getMinutes() +
    "m" + 
    time.getSeconds() +
    "s"
  

  //Vérification du type de identifiant(sessionStorage)
  var identifiant = sessionStorage.getItem("state");
  //Transformation de identifiant en objet pour avoir accès à token et userId
  var identifiantObjet = JSON.parse(identifiant);
  //Récupération de l'id de l'objet
  var id = identifiantObjet.userId;

  //function HandlePost qui envoie données à l'api
  function HandlePost(e) {
    e.preventDefault();

    //Transformation des donnes en objet pour pouvoir effectuer une condition dessus(!= formData)
    var objetData = {
      image: image,
      posterMessage: post,
      date: time,
      posterId: id,
    };

    // Si l'image et le texte sont absent alors on ne post pas
    if (objetData.image == undefined && objetData.posterMessage == undefined) {
      document.querySelector(".msg-error-post").style.visibility = "visible";
    } else {
      // Transformation des données en FormData
      const data = new FormData();
      data.append("image", image);
      data.append("posterMessage", post);
      data.append("date", time);
      data.append("posterId", id);

      //Enregistrement de l'id du post dans le localStorage
      localStorage.setItem("infoPost", infoPost);

      fetch(`${varGlobal}/api/posts`, {
        method: "POST",
        //mode: 'no-cors', // no-cors, *cors, same-origin
        //suppression   Accept: "application/json",  "Content-Type": "application/json",  "Content-Type":"multipart/form-data"
        "Content-Type": "multipart/form-data",
        headers: {
          Authorization: `Bearer ${identifiantObjet.token}`, // pour le backend middleware/auth.js qui recup req.headers.authorization
        },
        body: data,
      })
        .then((response) => response.json())
        .then((donnée) => {
          setInfoPost(donnée); //Envoit dans le state l'_id du post
          //Après un post, on reset les donnés en undefined
          objetData = {
            image: undefined,
            posterMessage: undefined,
            date: undefined,
            posterId: undefined,
          };
          window.location = "/";
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  //Prévisualisation de l'image
  function handleImage(e) {
    document.getElementById("blah").src = window.URL.createObjectURL(e);
  }

  //Return formulaire, submit lance la fonction HandlePost
  return (
    <>
      <div className="post-container">
        <h1>Quoi de neuf {identifiantObjet.name} ?</h1>
        <form method="POST" onSubmit={HandlePost}>
          <div className="preview">
            <img id="blah" alt="" width="200" height="100%" />
          </div>
          <label htmlFor="post" className="preview" aria-label="image" >Envoyez un post </label>  
          <textarea
            name="post"
            id="post"
            placeholder="Nouveau post ?"
            onChange={(e) => setPost(e.target.value)}
          />
          <br />
          <br />

          <div className="post-buttons">
            <div className="espace-bouton">
              <p className="image_space"></p>
              <label htmlFor="image" id="btn-image" aria-label="image"> Image : &nbsp;   &nbsp; 
              
                <i className="fa-regular fa-image" />
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
              <p className="envoyer_space"></p>
              <label htmlFor="envoyer-image" aria-label="envoyer image">Envoyer :&nbsp; &nbsp; 
                
                <i className="fa-solid fa-paper-plane" />
              </label>
              <input type="submit" id="envoyer-image" value="Postez" />
            </div>
          </div>
          <div className="msg-error-post">
            Veuillez au moins écrire un message ou poster une image
          </div>
        </form>
      </div>
    </>
  );
}
