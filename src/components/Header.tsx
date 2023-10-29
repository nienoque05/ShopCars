import  { useContext } from "react";
import logoImg from '../assets/logo.svg'
import { Link } from "react-router-dom";
import {FiUser, FiLogIn} from 'react-icons/fi'
import { AuthContext } from "../contexts/AuthContext";
export default function Header(){
const {signed, loadingAuth, user} = useContext(AuthContext)
  
    return(
        <div className="w-full flex items-center justify-center h-15 bg-white drop-shadow mb-4">
            <header className="flex w-full items-center justify-between max-w-7xl px-4 mx-auto">
                <Link to="/">
                <img src={logoImg} alt="logo"/>
                </Link>
               {!loadingAuth && signed && (
                 <Link to="/dashboard">
                 <div className="flex gap-2  ">
                 <FiUser size={34} color="#000" className="border-2 rounded-full p-1 border-gray-900"/> 
                 <span>{user?.name}</span>
                 </div>
                
                 </Link>
               )}
               {!loadingAuth && !signed && (
                 <Link to="/login">
                 <FiLogIn size={24} color="#000"/>
                 </Link>
               )}
            </header>
        </div>
    )
}