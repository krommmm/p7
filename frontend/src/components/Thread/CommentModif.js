import { useEffect, useState } from "react";
import varGlobal from "../varGlobal";

export default function CommentModif() {
  //Définition du moment où l'utilisateur modifie son commentaire
  var time = new Date();
  time =
    "modifié le " +
    time.getDate() +
    "-" +
    (time.getMonth() + 1) +
    "-" +
    time.getFullYear() +
    " à " +
    time.getHours() +
    "h" +
    time.getMinutes();

  sessionStorage.removeItem("modifComment");

  var idDuCommentaire = sessionStorage.getItem("idDuCommentaire");
  var idDuCommenteur = sessionStorage.getItem("idDuCommenteur");
  var idDuPost = sessionStorage.getItem("idDuPostComment");

  var identifiant = sessionStorage.getItem("state");
  var identifiantObjet = JSON.parse(identifiant);
  var id = identifiantObjet.userId;

  const [user, setUser] = useState([]);
  const [list, setList] = useState([]);
  const [textCom, setTextCom] = useState(""); // contient le texte du commentaire
  const [post, setPost] = useState(""); // contient les info envoyé à la bdd

  //---------FETCH USER------------------
  useEffect(() => {
    // on utilise le use effect avec le fetch pour que ça ne le fasse qu'une seule fois
    fetch(`${varGlobal}/api/auth/${id}`)
      .then((response) => response.json())
      .then(setUser);
  }, []);

  //---------FETCH LIST---------------
  useEffect(() => {
    fetch(`${varGlobal}/api/posts/${idDuPost}`, {
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
        //Pour tous les commentaires
        for (var a = 0; a < data.comments.length; a++) {
          //Si l'id du commentaire dans la table des commentaires = l'id du commentaire dans le sessionStorage
          if (data.comments[a]._id === idDuCommentaire) {
            //Alors textCom est le commentaire de celui qui l'a commenté
            setTextCom(data.comments[a].text);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  //---------Modification d'un commentaire---------------
  function HandleModif(e) {
    e.preventDefault();
    var identifiant = sessionStorage.getItem("state");
    var identifiantObjet = JSON.parse(identifiant);
    var id = identifiantObjet.userId;

    var idDuCommentaire = sessionStorage.getItem("idDuCommentaire");
    var idDuCommenteur = sessionStorage.getItem("idDuCommenteur");
    var idDuPost = sessionStorage.getItem("idDuPostComment");

    fetch(`${varGlobal}/api/posts/${idDuPost}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${identifiantObjet.token}`,
      },
      body: JSON.stringify({
        commenterId: id,
        commenterName: user.name,
        commenterFirstName: user.firstName,
        text: post,
        date: time,
        crud: "u", // u pour update
        commentaireId: idDuCommentaire,
      }),
    })
      .then((response) => response.json())
      .then((donnée) => {
        //console.log(donnée);
        //Si le commentaire est modifié, retour à l'accueil
        window.location = "/";
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function handleReturn() {
    window.location = "/";
  }
 
  return (
    <>
      <div className="commentModif-container">
        <div className="display-container">
          <div className="displayFormModif">
            <form method="PATCH" id="modif-comment-form" onSubmit={HandleModif}>
              <div className="form-modif-container-label">
                <label htmlFor="comment">
                  <h1>Modifier votre commentaire</h1>
                </label>
              </div>
              <br />
              <br />
              <textarea
                className="comment"
                name="comment"
                id="comment"
                placeholder="Ecrivez un commentaire"
                spellCheck="false"
                onChange={(e) => setPost(e.target.value)}
                defaultValue={textCom}
              />
              <br />
              <br />
              <div className="form-modif-container-label">
                <input
                  className="bouton-rouge"
                  type="submit"
                  value="Modifier"
                />
              </div>
              <br /> <br />
            </form>
            <div type="button" onClick={handleReturn}>
              <i className="fa-solid fa-rotate-left" />{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
