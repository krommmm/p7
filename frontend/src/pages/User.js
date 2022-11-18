import OnePost from '../components/Thread/OnePost';
import FormModif from '../components/Thread/FormModif';

export default function User(){
  
//Si la clée "modif" du sessionStorage ne contient pas de valeur, alors le post n'a pas été modifié, donc renvoit vers formModif, sinon sur le Onepost   
var isModif = sessionStorage.getItem("modif");

  return (
    <>
    <section className="user">
       {isModif===null ? <OnePost/> : <FormModif/>}
       </section>
    </>
  )
}