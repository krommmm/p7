import { useEffect, useState } from "react";
import MyProfil from "../components/Profil/MyProfil";
import PageAttente from "../components/Profil/PageAttente";

export default function Profil() {
  var isUserConnected = sessionStorage.getItem("state");
//Si l'utilisateur est connecté => myProfil , sinon pageAttente
  return (
    <>
      <section className="profil">
        <div className="main">
          {isUserConnected !== null ? <MyProfil /> : <PageAttente />}
        </div>
        <br />
      </section>
    </>
  );
}
