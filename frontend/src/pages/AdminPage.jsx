import {useParams} from "react-router-dom";



export default function AdminPage(){
    const {username} = useParams();



    return `Hello ${username}!`
}