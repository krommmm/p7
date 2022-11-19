import React from "react";
import { useEffect, useState } from "react";
import Comments from "../Thread/Comments";
import Likes from "../Thread/Likes";
import varGlobal from "../varGlobal";
export default function DisplayPost() {
  const [list, setList] = useState([]); //Contient tous les posts
  const [users, setUsers] = useState([]); //Contient tous les utilisateurs
  const [objet, setObjet] = useState([]); // Contient les posts et les utilisateurs

  useEffect(() => {
    fetchList(); // get posts
    fetchUsers(); // get utilisateurs
  }, []);

  useEffect(() => {
    //Quel utilisateur a posté ce post ?
    //Pour tous les utilisateurs
    for (var a = 0; a < users.length; a++) {
      //pour tous les posts
      for (var b = 0; b < list.length; b++) {
        //Si l'id de l'utilisateur correspond à l'id du post
        if (users[a]._id === list[b].posterId) {
          //Est-ce que le post contient une image ?
          if (list[b].imageUrl !== undefined) {
            var isImage = true;
          } else {
            isImage = false;
          }

          //Jointure des posts et des utilisateurs dans la var objetmodel
          var objetmodel = {
            _id: list[b]._id,
            posterId: list[b].posterId,
            posterMessage: list[b].posterMessage,
            imageUrl: list[b].imageUrl,
            likes: list[b].likes,
            dislikes: list[b].dislikes,
            usersLiked: list[b].usersLiked,
            usersDisliked: list[b].usersDisliked,
            date: list[b].date,
            name: users[a].name,
            firstName: users[a].firstName,
            imageProfil: users[a].imageProfil,
            comments: list[b].comments,
            isImage: isImage,
          };

          // Remplacement de chaque post par l'objet de jointure
          list[b] = objetmodel;
          //Si un utilisateur n'a pas posté de message(seulement une image, n'affiche pas undefined)
          if (list[b].posterMessage == "undefined") {
            list[b].posterMessage = "";
          }
          if (list[b].imageUrl == "undefined") {
            list[b].imageUrl = "";
          }
          //Transmition de list à objet après les conditions
          setObjet([...list]);
        }
      }
    }
  }, [users, list]); // Est appellé au montage du composant et dès qu'on change users ou list

  //----------------Récupération des utilisateurs------------------
  const fetchUsers = async () => {
    //Récupération du token pour l'identification
    var identifiant = sessionStorage.getItem("state");
    var identifiantObjet = JSON.parse(identifiant);

    try {
      const result = await fetch(`${varGlobal}/api/auth`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${identifiantObjet.token}`,
        },
      });
      const body = await result.json();
      setUsers(body);
    } catch (err) {
      console.log(err);
    }
  };

  //----------------Récupération des posts------------------
  const fetchList = async () => {
    // fetch api/auth pour récupérer le token
    var identifiant = sessionStorage.getItem("state");
    var identifiantObjet = JSON.parse(identifiant);
    //Fetch pour LIST
    try {
      const result = await fetch(`${varGlobal}/api/posts`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${identifiantObjet.token}`,
        },
      });
      const body = await result.json();
      setList(body);
    } catch (err) {
      console.log(err);
    }
  };

  //Accès à un post selon son id
  function handleSoloPost(e, r) {
    //Ajout de l'_id du post et de l'utilisateur dans le sessionStorage
    sessionStorage.setItem("idDuPost", e);
    sessionStorage.setItem("posterId", r);
    window.location = "/User";
  }

  //Accès à un commentaire selon son id
  function handleSoloComment(a, b, c) {
    //Ajout de l'id du commentaire du commenteur et du post
    sessionStorage.setItem("idDuCommentaire", a);
    sessionStorage.setItem("idDuCommenteur", b);
    sessionStorage.setItem("idDuPostComment", c);
    window.location = "/Commentaires";
  }

  return (
    <>
      {/*Mappage antéchronologique du state objet */}
      <div className="display-post">
        {objet
          .slice(0)
          .reverse()
          .map((todo, index) => (
            <div key={index}>
              <article className="display-container">
                <div className="head-container">
                  <div className="profil_post">
                    <p>
                      <img
                        className="image-profil"
                        alt={todo.name + todo.firstName}
                        src={varGlobal + "/images/" + todo.imageProfil}
                      />

                      <span className="en-gras">
                        {todo.name} {todo.firstName}
                      </span>
                    </p>
                    Posté le <span className="en-gras">{todo.date}</span>
                  </div>

                  <div>
                    <p></p>
                  </div>
                </div>
                <br />
                {/*Si objet contient une image alors affiche l'image (pour le pas afficher le alt) */}
                {todo.isImage && (
                  <img
                    src={varGlobal + "/images/" + todo.imageUrl}
                    alt="images-du-post"
                    className="images"
                  />
                )}

                <div className="msg-container">
                  <p>{todo.posterMessage}</p>
                </div>
                <br />
                <div className="likes-modif-container">
                  {/*Envoie du state objet à son enfant likes en prop */}
                  <Likes myUserValues={todo} />

                  <div className="modify">
                    <div
                      type="button"
                      onClick={(e) => handleSoloPost(todo._id, todo.posterId)}
                    >
                      <i className="fa-solid fa-ellipsis" />
                    </div>
                  </div>
                </div>
                <br />
                <br />
                <div className="ligne-séparation"></div>
                {/*Mappage antéchronologique des commentaires */}
                {todo.comments
                  .slice(0)
                  .reverse()
                  .map((all, index) => (
                    <div key={index}>
                      <div className="comment-container">
                        <div className="comment_container-header">
                          <span className="en-gras">
                            {all.commenterName} {all.commenterFirstName}
                          </span>
                          <br />
                          Le {all.date}
                        </div>
                        <div className="comment_container-body">
                          <br />
                          {all.text}{" "}
                        </div>
                      </div>
                      <br />
                      <br />
                      <div
                        type="button"
                        onClick={(e) =>
                          handleSoloComment(all._id, all.commenterId, todo._id)
                        }
                      >
                        <i className="fa-solid fa-ellipsis" />
                      </div>
                      <br />
                      <br />
                      <div className="ligne-séparation"></div>
                    </div>
                  ))}
                {/*Envoie du state objet à son enfant comments en prop */}
                <Comments myUserValues={todo} />
                <br />
                <br />
                <br />
              </article>
            </div>
          ))}
      </div>
    </>
  );
}
