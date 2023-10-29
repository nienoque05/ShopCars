import Container from "../../components/Container";
import logoImg from '../../assets/logo.svg'
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import {useForm} from 'react-hook-form'
import  {z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth/cordova";
import { auth } from "../../services/firebaseConnection";
import { signOut, updateProfile } from "firebase/auth";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const schema = z.object({
    name: z.string().nonempty("Campo nome é obrigatório"),
    email: z.string().email("Insira um email válido").nonempty("Campo obrigatorio"),
    password: z.string().min(6, "DEVE CONTER PELO MENOS 6 CARACTERES").nonempty("campo obrigatorio")
})

type FormData = z.infer<typeof schema>

export default function Register(){
const {handleInfoUser} = useContext(AuthContext)
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
  async  function onSubmit(data: FormData){
       createUserWithEmailAndPassword(auth, data.email, data.password).then(async (user)=>{
        await updateProfile(user.user, {
            displayName: data.name
        })
        handleInfoUser({
            name: data.name,
            email: data.email,
             uid: user.user.uid})
        navigate("/", {replace: true})
        toast.success("Bem-vindo ao sistema")
       }).catch((error)=>{
        console.log("erro ao cadastrar este usuário", error)
       })
 }
 useEffect(()=>{
        async function handleLogout() {
            await signOut(auth)
            }
        handleLogout()
    },[])
    return(
       <Container>
       <div className="w-full min-h-screen flex items-center justify-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
        <img src={logoImg} alt="Logo" className="w-full"/>
        </Link>
        <form className="bg-white max-w-xl w-full p-4 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Input type="text" placeholder="Digite seu nome completo" name="name" error={errors.name?.message} register={register}/>
           
          </div>
          <div className="mb-3">
          <Input type="email" placeholder="Digite seu email" name="email" error={errors.email?.message} register={register}/>
           
          </div>
          <div className="mb-3">
          <Input type="password" placeholder="Digite sua senha" name="password" error={errors.password?.message} register={register}/>
           
          </div>
          <button className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium" type="submit">Acessar</button>
          <Link to="/login">Já possui uma conta? Faça o login</Link>
        </form>
       </div>
       </Container>
    )
}