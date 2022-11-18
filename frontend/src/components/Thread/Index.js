import React from "react";
import Post from "../Thread/Post";
import DisplayPost from "./DisplayPost";

//Affiche le formulaire pour poster ainsi que le contenu du post
export default function Index() {
  return (
    <>
      <div className="index-container">
        <Post />
        <br />
        <DisplayPost />
      </div>
    </>
  );
}
