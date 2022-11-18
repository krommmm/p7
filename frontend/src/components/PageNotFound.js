import ErrorPageNotFound from "../images/ErrorPageNotFound.webp";

export default function PageNotFound() {
  return (
    <>
      <div className="pageNotFound-container">
        <h1>Erreur 404</h1>
        <img src={ErrorPageNotFound} alt="image-gorrille" />
        <p>La page que vous recherchez n'existe pas encore</p>
        <p>© Groupomania 2022</p>
      </div>
    </>
  );
}
