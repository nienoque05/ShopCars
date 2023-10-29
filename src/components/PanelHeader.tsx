import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../services/firebaseConnection";




export default function DahsboardHeader(){
    async function handleLogout(){
        await signOut(auth)
    }
return(
    <div className="w-full items-center flex mb-4 h-10 bg-red-500 rounded-lg text-white gap-4 px-4">
         <Link to="/home">
                Página inicial
        </Link>
        <Link to="/dashboard">
            Meus anuncios
        </Link>
        <Link to="/dashboard/new">
            Cadastrar carro
        </Link>
        <button  onClick={handleLogout} className="ml-auto">Sair da conta</button>
    </div>
)
}