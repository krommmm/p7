import React from "react";
import { useState } from "react";
import varGlobal from "../varGlobal";

export default function Comments(props) {
  const [comment, setComment] = useState([]); //state qui reçoit le commentaire

  //Définition du moment où l'utilisateur poste un commentaire
  var time = new Date();
  time =
    "           " +
    time.getDate() +
    "-" +
    (time.getMonth() + 1) +
    "-" +
    time.getFullYear() +
    " à " +
    time.getHours() +
    "h" +
    time.getMinutes();

  //Récupération de l'id et du token du poster
  var infoState = sessionStorage.getItem("state");
  var infoStateObject = JSON.parse(infoState);
  var idUser = infoStateObject.userId;
  var tokenUser = infoStateObject.token;

  //Création d'un commentaire
  function HandleComment(e) {
    e.preventDefault();

    fetch(`${varGlobal}/api/posts/${props.myUserValues._id}`, {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenUser}`,
      },
      body: JSON.stringify({
        commenterId: idUser,
        commenterName: infoStateObject.name,
        commenterFirstName: infoStateObject.firstName,
        text: comment,
        date: time,
        crud: "c",//indication de c pour Create comment 
      }),
    })
      .then((response) => response.json())
      .then((donnée) => {
        //console.log(donnée);
        window.location = "/";
      })
      .catch((e) => {
        console.log(e);
      });
  }
 
  return (
    <>
      <form method="PATCH" onSubmit={HandleComment}>
  


        <label htmlFor="commentaires-input">Commentaires:</label>
        <br/>
        <textarea
          name="commentairess"
          id="commentaires-input"
          placeholder="Un commentaire ?"
          onChange={(e) => setComment(e.target.value)}
        /> 
      
      
        <br />
        <br />
       
       
          <button type="submit" id="ok" name="poster">
            Envoyer &nbsp;<i className="fa-regular fa-paper-plane" />
          </button>
      </form>
    </>
  );
}
