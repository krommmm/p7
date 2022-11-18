import { useEffect, useState } from "react";
import varGlobal from "../varGlobal";

export default function Likes(props) {

  const [like, setLike] = useState(props.myUserValues.likes);
  const [dislike, setDislike] = useState(props.myUserValues.dislikes);


  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);

  const [ isRefreshLike , setIsRefreshLike] = useState(true);
  const [ isRefreshDislike, setIsRefreshDislike] = useState(true);

  function likesf(){

        //Vérification du type de identifiant(sessionStorage)
        var identifiant = sessionStorage.getItem("state");
        //Transformation de identifiant en objet pour avoir accès à token et userId
        var identifiantObjet = JSON.parse(identifiant);
        //Récupération de l'id de l'objet
        var id = identifiantObjet.userId;
   

//Si le tableau des likes de ce post contient l'id de l'utilisateur, et qu'on a pas refresh enlève un like
if(props.myUserValues.usersLiked.includes(id) && isRefreshLike){
  setLike(like-1);
  setIsRefreshLike(false);
}else if(props.myUserValues.usersDisliked.includes(id) && isRefreshLike){
  setLike(like+1);
  setDislike(dislike-1);
  setIsRefreshLike(false);
  window.location = "/";

}else{

    if(likeActive){
      setLikeActive(false);
      setLike(like-1);
    }else{
      setLikeActive(true);
      setLike(like+1);
         
          if(dislikeActive){
            setDislikeActive(false);
            setLike(like+1);
            setDislike(dislike-1)
          }
    }
  }

  

    fetch(`${varGlobal}/api/posts/${props.myUserValues._id}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${identifiantObjet.token}`,
      },
      body: JSON.stringify({
        like: +1,
        userId: id,
      }),
    })
      .then((response) => response.json())
      .then((donnée) => {
         console.log(donnée);
        //Redirection à l'accueil après un post
        //window.location = "/";
      })
      .catch((e) => {
        console.log(e);
      });




  }

  function dislikesf(){

      //Vérification du type de identifiant(sessionStorage)
      var identifiant = sessionStorage.getItem("state");
      //Transformation de identifiant en objet pour avoir accès à token et userId
      var identifiantObjet = JSON.parse(identifiant);
      //Récupération de l'id de l'objet
      var id = identifiantObjet.userId;
    

     //Si le tableau des dislikes de ce post contient l'id de l'utilisateur
      if(props.myUserValues.usersDisliked.includes(id) && isRefreshDislike){
        setDislike(dislike-1);
        setIsRefreshDislike(false);
      }else if(props.myUserValues.usersLiked.includes(id) && isRefreshLike){
        setLike(like-1);
        setDislike(dislike+1);
        setIsRefreshDislike(false);
        window.location = "/";
      }else{

    if(dislikeActive){
      setDislikeActive(false);
      setDislike(dislike-1);
    }else{
      setDislikeActive(true);
      setDislike(like+1);
         
          if(likeActive){
            setLikeActive(false);
            setDislike(dislike+1);
            setLike(like-1)
          }
    }
  }


  

  
    fetch(`${varGlobal}/api/posts/${props.myUserValues._id}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${identifiantObjet.token}`,
      },
      body: JSON.stringify({
        like: -1,
        userId: id,
      }),
    })
      .then((response) => response.json())
      .then((donnée) => {
        console.log(donnée);
        //Redirection à l'accueil après un post
        //window.location = "/";
      })
      .catch((e) => {
        console.log(e);
      });

  }


  return (
    <>
      <div className="likes">
        <div
          type="button"
          id="like"
          onClick={likesf}><i className="fa-regular fa-thumbs-up" /> {like}
        </div>
        <div
          type="button"
          id="dislike"
          onClick={dislikesf}><i className="fa-regular fa-thumbs-down" />{dislike}
        </div>
      </div>
    </>
  );
}
