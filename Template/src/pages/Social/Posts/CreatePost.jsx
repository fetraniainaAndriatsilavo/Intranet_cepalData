import { useContext, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { AppContext } from "../../../context/AppContext";
import api from "../../../components/axios";
import { Avatar } from "@mui/material";

export default function CreatePost({ GroupId, fetchPost, fetchGroupPost }) {
  const { user } = useContext(AppContext)
  const [picture, setPicture] = useState([]);
  const [description, setDescription] = useState("");
  const emojiButtonRef = useRef(null);
  const [isShown, setIsShown] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setPicture((prev) => [...prev, ...selectedFiles]);
    }
  };

  const Publish = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", description);
    formData.append("user_id", user.id);
    if (GroupId) {
      formData.append("group_id", GroupId);
      formData.append("type", "groupe");
    } else {
      formData.append("type", "public");
    }
    formData.append('status', 'published')
    picture.forEach((file) => {
      formData.append("attachments[]", file);
    });

    try {
      const response = await api.post(
        "/posts/store",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Post created:", response.data);
      setDescription("");
      setPicture([]);

      if (GroupId) {
        fetchGroupPost(GroupId)
      } else {
        fetchPost()
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Une erreur s’est produite lors de la publication.");
    }
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setIsShown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle emoji selection
  const handleEmojiClick = (emojiData) => {
    setDescription((prev) => prev + emojiData.emoji); // Append emoji to current text
  };

  return (
    <div className="w-2/3">
      {/* en-tete */}
      <div className="bg-white p-2 mt-3 rounded-t-lg">
        <div className="flex items-center justify-start gap-2 w-full p-2">
          <Avatar> {user.first_name.charAt(0) + "" + user.last_name.charAt(0)} </Avatar>
          <span className="font-semibold"> Partager une nouvelle publication </span>
        </div>
      </div>
      {/* textarea */}
      <div className="bg-white p-1">
        <textarea
          name="description"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded bg-gray-50 p-2 w-full h-auto border border-none"
          placeholder={`Quoi de neuf ?, ${user.last_name + ' ' + user.first_name}`}
        />
      </div>

      {/* images selectionées */}
      {picture.length > 0 && (
        <div className="flex flex-row flex-wrap gap-2 p-2 bg-white items-center justify-center">
          {picture.map((file, key) => (
            <div key={key} className="relative group">
              {file.name.endsWith(".mp4") ? (
                <video
                  src={URL.createObjectURL(file)}
                  controls
                  className="w-40 h-24 rounded"
                />
              ) : (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <button
                onClick={() =>
                  setPicture((prev) => prev.filter((_, index) => index !== key))
                }
                className="absolute top-0 right-0 bg-gray-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-70 group-hover:opacity-100"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* button  */}
      <div className="flex items-center justify-between bg-white p-2 rounded-b-lg">
        <div className="flex fex-row items-center justify-start gap-3">
          <div className="items-center justify-center flex gap-2">
            <label htmlFor="image">
              {" "}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" className="text-sky-600 icon icon-tabler icons-tabler-outline icon-tabler-photo-plus">
                <title> uploader des Images  </title>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 8h.01" />
                <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" />
                <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" />
                <path d="M14 14l1 -1c.67 -.644 1.45 -.824 2.182 -.54" />
                <path d="M16 19h6" />
                <path d="M19 16v6" />
              </svg>
            </label>
            <input
              id="image"
              name="image[]"
              type="file"
              accept=".jpg,.png,.jpeg,.gif,.mp4"
              onChange={handleFileChange}
              multiple
              hidden
            ></input>
          </div>
          {/* Emoji Picker */}
          <div className="relative" ref={emojiButtonRef}>
            <span
              className="cursor-pointer"
              onClick={() => setIsShown((prev) => !prev)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-300 icon icon-tabler icons-tabler-filled icon-tabler-mood-happy">
                <title> Emojicons  </title>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-2 9.66h-6a1 1 0 0 0 -1 1v.05a3.975 3.975 0 0 0 3.777 3.97l.227 .005a4.026 4.026 0 0 0 3.99 -3.79l.006 -.206a1 1 0 0 0 -1 -1.029zm-5.99 -5l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993zm6 0l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993z" />
              </svg>
            </span>
            {isShown && (
              <div className="absolute top-12 left-0 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>
        </div>
        <button
          className="bg-blue-500 py-2 px-2 text-white rounded-lg cursor-pointer hover:bg-blue-600"
          onClick={Publish}
        >
          Partager
        </button>
      </div>
    </div>
  );
}
