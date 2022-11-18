import OneComment from "../components/Thread/OneComment";
import CommentModif from "../components/Thread/CommentModif";

export default function Commentaires() {
  var isModifComment = sessionStorage.getItem("modifComment");

  return <>{isModifComment === null ? <OneComment /> : <CommentModif />}</>;
}
