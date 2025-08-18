import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../../Context/AppContext";

export default function EditComment({ id, commentId, setIsOpen }) {
  const [content, setContent] = useState("");
  const { user } = useContext(AppContext); 

    useEffect(()=> {
        axios.get('http://127.0.0.1:8000/api/comments/'+ commentId +'/getOneComment')
        .then((response) => { 
            setContent(response.data.content)
        }) 
        .catch((error) => {  
            console.log(error)
        }) 
    }, [commentId])  


  const Edit = (e) => {
    e.preventDefault();
    axios
      .put(
        "http://127.0.0.1:8000/api/comments/" + commentId + "/modify",
        {
          content: content,
          user_id: user.id,
          post_id:id, 
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        setContent("");
        alert('Commentaire modifiée ! ')
        setIsOpen(false)
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const close = ( ) => { 
    setIsOpen(false)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h1 className="text-lg font-bold mb-4">
          Modifier le commentaire
        </h1>

        <textarea
          name="content"
          id="content"
          className="w-full bg-gray-100 rounded-lg text-gray-700 p-2 resize-none h-24 mb-4"
          placeholder="Écrivez votre commentaire"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <div className="flex justify-end"> 
            <button
            className="bg-gray-100 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg mx-2 cursor-pointer"
            onClick={close}
          >
            Annuler 
          </button> 

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer"
            onClick={Edit}
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}
