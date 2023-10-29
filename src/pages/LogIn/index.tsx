import Container from "../../components/Container";
import logoImg from '../../assets/logo.svg'
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import {useForm} from 'react-hook-form'
import  {z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { useEffect } from "react";
import toast from "react-hot-toast";
const schema = z.object({
    email: z.string().email("Insira um email válido").nonempty("Campo obrigatorio"),
    password: z.string().nonempty("campo obrigatorio")
})

type FormData = z.infer<typeof schema>

export default function LogIn(){

useEffect(()=>{
    async function handleLogout() {
        await signOut(auth)
        }
    handleLogout()
},[])

const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    function onSubmit(data: FormData){
        signInWithEmailAndPassword(auth, data.email, data.password).then(()=>{
            console.log("Logado com sucesso")
            toast.success("Logado com sucesso!!!")
            navigate("/", {replace: true})
        }).catch(()=>{
                console.log("ERRO AO LOGAR NO SISTEMA")
        })
    }
    return(
       <Container>
       <div className="w-full min-h-screen flex items-center justify-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
        <img src={logoImg} alt="Logo" className="w-full"/>
        </Link>
        <form className="bg-white max-w-xl w-full p-4 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
          <Input type="email" placeholder="Digite seu email" name="email" error={errors.email?.message} register={register}/>
           
          </div>
          <div className="mb-3">
          <Input type="password" placeholder="Digite sua senha" name="password" error={errors.password?.message} register={register}/>
           
          </div>
          <button className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium" type="submit">Acessar</button>
          <Link to="/register">Ainda não possui uma conta? Cadastre-se</Link>
        </form>
       </div>
       </Container>
    )
}