
import { useEffect, useRef, useState } from "react";
import api from "../../../components/axios";
import { Alert, Avatar } from "@mui/material";

export default function EditPost({ PostID, setIsOpen, fetchPost }) {
  const [post, setPost] = useState({
    content: '',
    lastName: '',
    firstName: '',
    attachments: []
  })
  const modalRef = useRef(null);
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  useEffect(() => {
    api
      .get('/posts/' + PostID + '/getInfo')
      .then((response) => {
        const data = response.data.post
        setPost({
          content: data.content,
          lastName: data.user.last_name,
          firstName: data.user.first_name,
          attachments: data.attachments || []
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }, [PostID]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const Publish = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", post.content);

    if (!post.content) {
      setError('Vous devez remplir ce champ')
      return;
    }

    try {
      const response = await api.put(
        '/posts/' + PostID + '/update',
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setError('')
      setSuccess("La modification de votre contenu a été effectuée.")
      setIsOpen(false);
      fetchPost()
    } catch (error) {
      setSuccess('')
      setError('Une erreur s’est produite lors de la publication.')
    } finally {
      setError('')
      setSuccess('')
    }
  }; 

  return (
    <div className="fixed inset-0 z-25 flex items-center justify-center 
                bg-white/30 backdrop-blur-md">
      <div
        ref={modalRef}
        className="bg-white w-[400px] max-w-xl mx-auto rounded-xl shadow-lg animate-scaleIn overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center gap-2">
            <Avatar> {post.lastName.charAt(0) + '' + post.firstName.charAt(0) || ''} </Avatar>
            <span className="font-semibold text-md">
              Modifier le contenu votre publication
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-black text-xl cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 6l-12 12" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-1 max-h-[70vh] overflow-y-auto space-y-2">
          <textarea
            name="description"
            id="description"
            value={post.content || ''}
            onChange={(e) =>
              setPost({
                ...post,
                content: e.target.value
              })
            }
            className="w-full p-2 rounded bg-gray-50 border border-none resize-none"
            rows={4}
            placeholder="A quoi pensiez-vous ?"
          />
          {error && (
            <div className="w-full">
              <Alert severity="error" className="dark:bg-gray-700 dark:text-red-400">
                {error}
              </Alert>
            </div>
          )}
          {success && (
            <div className="w-full">
              <Alert severity="error" className="dark:bg-gray-700 dark:text-red-400">
                {success}
              </Alert>
            </div>
          )}
          {/* Footer */}
          <div className="flex justify-end"> 
            
            <button
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md transition-all w-full cursor-pointer"
              onClick={Publish}
            >
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
