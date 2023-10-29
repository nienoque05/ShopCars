import  { ChangeEvent, useContext, useState } from "react";
import Container from "../../../components/Container";
import DahsboardHeader from "../../../components/PanelHeader";
import { FiTrash, FiUpload } from "react-icons/fi";
import {Controller, useForm} from 'react-hook-form'
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../components/Input";
import { AuthContext } from "../../../contexts/AuthContext";
import {v4 as uuidV4} from 'uuid'
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";
const schema =z.object({
    name: z.string().nonempty("O campo nome é obrigatório"),
    model: z.string().nonempty("O campo modelo é obrigatório"),
    city: z.string().nonempty("O campo cidade é obrigatório"),
    year: z.string().nonempty("O campo ano é obrigatório"),
    km: z.string().nonempty("O KM do carro é obrigatório"),
    price: z.string().nonempty("O campo cidade é obrigatório"),
    whatsapp: z.string().nonempty("O telefone é obrigatório"),
    description: z.string().nonempty("Descrição obrigatória")
})

type FormData = z.infer<typeof schema>;

interface ImageItemProps{
    uid: string;
    name: string;
    previewURL: string;
    url: string
}

export default function New(){
    const {user} = useContext(AuthContext)
    const [carImg, setCarImg] = useState<ImageItemProps[]>([])
    const {register, handleSubmit, formState: {errors}, reset, control} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
   async function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0]

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
             await   handleUpload(image)
            } else{
                alert("ENVIE JPG OU PNG")
                return;
            }
        }

    }

    async function handleUpload(image: File) {
        if(!user?.uid){
            return;
        }
        const currentId = user?.uid;
        const uidImage = uuidV4();
        const uploadRef = ref(storage, `images/${currentId}/${uidImage}`)
        uploadBytes(uploadRef, image).then((snapshot)=>{
            getDownloadURL(snapshot.ref).then((dowloadUrl)=>{
               const imageItem = {
                name: uidImage,
                uid: currentId,
                previewURL: URL.createObjectURL(image),
                url: dowloadUrl
               }

               setCarImg((images)=> [...images, imageItem])

            })
        })
    }
    function onSubmit(data: FormData){
       if(carImg.length === 0){
       toast.error("Por favor envie uma imagem")
        return;
       }
    const carListImages = carImg.map((item) => {
        return {
            uid: item.uid,
            name: item.name,
            url: item.url
        }
    })

    addDoc(collection(db, "cars"),{
        name: data.name,
        model: data.model,
        whatsapp: data.whatsapp,
        city: data.city,
        year: data.year,
        km: data.km,
        price: data.price,
        description: data.description,
        created: new Date(),
        owner: user?.name,
        uid: user?.uid,
        images: carListImages

    })
    .then(()=>{
        toast.success("Carro publicado com sucesso!!!")
        reset();
        setCarImg([])
    })
    .catch(()=>{
        toast.error("Erro ao publicar o carro")
    })
    }
async function handleDeleteImage(item: ImageItemProps){
    const imagePath =  `images/${item?.uid}/${item?.name}`

    const imageRef = ref(storage, imagePath);

    try {
        await deleteObject(imageRef)
        setCarImg(carImg.filter((car) => car.url !== item.url))
    } catch (error) {
        console.log(error)
    }

}
 
    return(
        <Container>
        <DahsboardHeader/>

        <div className="w-full bg-zinc-100 p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
            <button className="border-2 w-48 rounded-lg flex items-center border-black justify-center md:w-48">
                <div className="absolute cursor-pointer">
                    <FiUpload size={34} color="#000"/>
                </div>
                <div className="cursor-pointer">
                    <input type="file" accept="imgae/*"
                     className="opacity-0 cursor-pointer h-28"
                        onChange={handleFile}
                     />
                </div>
            </button>
            {carImg.map((item)=>(
                <div className="w-full h-32 flex items-center  relative justify-center">
                    <button className="absolute" onClick={()=> handleDeleteImage(item)}>
                        <FiTrash size={28} color="#FFF"/>
                    </button>
                    <img src={item?.previewURL} className="rounded-lg w-full h-32 object-cover" alt="Foto do carro"/>
                </div>
            ))}
        </div>
        <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
<form className="w-full" onSubmit={handleSubmit(onSubmit)}>

    <div className="mb-3">
        <p className="mb-2 font-medium"> Nome do carro </p>
        <Input 
        type="text"
        register={register}
        name="name"
        error={errors.name?.message}
        placeholder="Ex: Onix 1.0"
        
        />
    </div>
    <div className="mb-3">
        <p className="mb-2 font-medium"> Modelo do Carro </p>
        <Input 
        type="text"
        register={register}
        name="model"
        error={errors.model?.message}
        placeholder="Ex: Onix 1.0..."
         />
    </div>
<div className="flex w-full mb-3 flex-row items-center gap-4">
<div>
        <p className="mb-2 font-medium"> Ano </p>
        <Input 
        type="text"
        register={register}
        name="year"
        error={errors.year?.message}
        placeholder="Ex: 2016"
        
        />
    </div>
    <div>
        <p className="mb-2 font-medium"> Km Rodados </p>
        <Input 
        type="text"
        register={register}
        name="km"
        error={errors.km?.message}
        placeholder="Ex: 10.000"
        
        />
    </div>
    <div>
        <p className="mb-2 font-medium"> Telefone/Whatsapp </p>
       <Controller 
       name="whatsapp"
       control={control}
       render={({field}) =>(
        <input 
        className="w-full border-2 rounded-md h-11 px-2"
        {...field}
        type="text"
        name="whastapp"
        placeholder="11-912345678"
        
        />
       )}/>
    </div>
    <div>
        <p className="mb-2 font-medium"> Cidade </p>
        <Input 
        type="text"
        register={register}
        name="city"
        error={errors.city?.message}
        placeholder="São Paulo - SP"
        
        />
    </div>
    </div>
    <div className="mb-3">
        <p className="mb-2 font-medium"> Preço </p>
        <Input 
        type="text"
        register={register}
        name="price"
        error={errors.price?.message}
        placeholder="Ex: R$50.000"
        
        />
        <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea className="border-2 w-full rounded-md h-24 px-2" {...register("description")} id="description" placeholder="Digite a descrição do carro"/>
            {errors.description && <p className="mb-1 rext-red-500">{errors.description?.message}</p>}
        </div>
    </div>
    <button type="submit" className="rounded-md bg-zinc-900 w-full text-white font-medium h-10">
        Cadastrar
    </button>
    </form>
        </div>
       </Container>
    )
}