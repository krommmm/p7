
import '../styles/Menu.css';
import { NavLink } from 'react-router-dom';
import groupo from '../images/groupo_black.webp'; 

export default function Menu(){
    return (
        <>
        <section className="menu">
        <div className="titre">
             <img id="logo-groupomania" src={groupo} alt="img-logo"/>
        </div>
        <div className="logos-menu">
        <ul>
            <li aria-label="first link"><NavLink aria-label="first link" to="/" className={({ isActive }) => (isActive ? "activeLink" : undefined)}><i className="fa-solid fa-house"/></NavLink></li>
            <li><NavLink aria-label="2nd link link" to ="/Profil"className={({ isActive }) => (isActive ? "activeLink" : undefined)}><i className="fa-solid fa-id-card"/></NavLink></li>
            <li><NavLink aria-label="3ème link" to ="/Logout"className={({ isActive }) => (isActive ? "activeLink" : undefined)}><i className="fa-solid fa-arrow-right-from-bracket"/></NavLink></li>
        </ul>
        </div>
        </section>
        </>
    )
}


                  
