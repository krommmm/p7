import { useEffect, useState } from "react";
import varGlobal from "../varGlobal";

var idDuCommentaire = sessionStorage.getItem("idDuCommentaire");
var idDuCommenteur = sessionStorage.getItem("idDuCommenteur");
var idDuPost = sessionStorage.getItem("idDuPostComment");

export default function OneComment() {
  const [list, setList] = useState([]);
  const [user, setUser] = useState([]);
  const [textCom, setTextCom] = useState("");
  const [idCom, setIdCom] = useState([]);
  const [isUser, setIsUser] = useState(false);

  var identifiant = sessionStorage.getItem("state");
  //Transformation de identifiant en objet pour avoir accès à token et userId
  var identifiantObjet = JSON.parse(identifiant);
  //Récupération de l'id de l'objet
  var id = identifiantObjet.userId;

  //---------FETCH USER---------------
  useEffect(() => {
    // on utilise le use effect avec le fetch pour que ça ne le fasse qu'une seule fois
    fetch(`${varGlobal}/api/auth/${idDuCommenteur}`)
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

        //Boucle pour récupérer le n° de tableau du commentaire
        for (var a = 0; a < data.comments.length; a++) {
          if (data.comments[a]._id === idDuCommentaire) {
            setTextCom(data.comments[a].text);
          }
        }
        //Est-ce que l'utisateur est le propriétaire du com'?
        if ((id !== idDuCommenteur)  && (identifiantObjet.isAdmin!==true)) {             
          setIsUser(false);
        } else {
          setIsUser(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function handleDelete() {
    //---------FETCH SUPPRESSION---------------

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
        text: "123",
        date: "123",
        crud: "d",
        commentaireId: idDuCommentaire,
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

  function handlePut() {
    sessionStorage.setItem("modifComment", "ok");
    window.location = "/Commentaires";
  }

  function handleReturn() {
    window.location = "/";
  }

  return (
    <>
      <div className="oneComment-container">
        <div className="display-container">
         
            {" "}
            <h1>Commentaire de {user.name}{" "}
            {user.firstName}</h1>
          

          <p>{textCom}</p>

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
