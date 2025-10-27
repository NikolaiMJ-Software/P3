import {useParams} from "react-router-dom";



export default function(){
    const {username} = useParams();
    return `Hello ${username}!`
}