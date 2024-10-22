import { useEffect } from "react"
import Navbar from "../../components/User/Home/NavBar/NavBar"
import AddPost from "../../components/User/Post/Addpost"
import { useNavigate } from "react-router-dom"

const AddNewPost = () => {
    console.log('add post function is called')
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/')
        }
    })
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-grow">
                <main className="flex flex-grow items-center justify-center p-4 ml-[250px]">
                    <AddPost />
                </main>
            </div>
        </div>
    )
}

export default AddNewPost
