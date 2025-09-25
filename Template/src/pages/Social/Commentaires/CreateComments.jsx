import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../../../context/AppContext";
import api from "../../../components/axios";
import { Avatar } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
function CreateComments({ id, fetchComments, selectedComment, setSelectedComment }) {
  const { user } = useContext(AppContext);
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const emojiButtonRef = useRef(null);

  const [loading, setLoading] = useState(false)
  const [isShown, setIsShown] = useState(false);

  const PublishComment = (PostId) => {
    setLoading(true)
    api
      .post(
        "/posts/" + PostId + "/comments",
        {
          content: content,
          user_id: user.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setLoading(false)
        setContent("");
        fetchComments(PostId)
      })
      .catch((error) => {
      })
      .finally(() => {
        setLoading(false)
      });
  };


  const updateComment = (id) => {
    setLoading(true)
    api
      .put(
        "/comments/" + id + "/update",
        {
          content: content,
          user_id: user.id,
          post_id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setLoading(false)
        fetchComments(response.data.post_id)
        setContent("");
        setSelectedComment(null)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const fetchCommentContent = (id) => {
    api.get('/comments/' + id + '/getInfo')
      .then((response) => {
        const comments = response.data[0]
        setContent(comments.content)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (selectedComment) {
      fetchCommentContent(selectedComment)
    }
  }, [selectedComment])

  const colorName = user.last_name + ' ' + user.first_name || ''

  function stringToColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  function stringAvatar(name) {
    const initials = name
      ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
      : "?";
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 40,
        height: 40,
        fontSize: "0.9rem",
      },
      children: initials.toUpperCase(),
    };
  }

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
    setContent((prev) => prev + emojiData.emoji); // Append emoji to current text
  };


  return (
    <div className="flex items-center gap-2 bg-white p-1">
      {/* Avatar */}
      <Avatar {...stringAvatar(colorName)} />

      {/* Textarea + Emoji */}
      <div className="flex-1 relative">
        <textarea
          name="content"
          id="content"
          ref={textareaRef}
          className="w-full bg-gray-100 rounded-xl text-gray-700 p-3 border border-transparent resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Écrivez votre commentaire..."
          rows={1}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            const el = e.target;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}
        />

        {/* Emoji Button */}
        <button
          type="button"
          ref={emojiButtonRef}
          onClick={() => setIsShown((prev) => !prev)}
          className="absolute right-3 bottom-3 text-gray-500 hover:text-yellow-400 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-mood-smile">
            <title> Emojicons </title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M9 10l.01 0" />
            <path d="M15 10l.01 0" />
            <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
          </svg>
        </button>

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

      {/* Send Button */}
      {content && (
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-600 hover:bg-sky-700 text-white transition"
          onClick={(e) => {
            e.preventDefault();
            if (!selectedComment) {
              PublishComment(id);
            } else {
              updateComment(selectedComment);
            }
          }}
        >
          {!loading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icon-tabler-send-2"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
              <path d="M6.5 12h14.5" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-spin icon icon-tabler icon-tabler-loader"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 6l0 -3" />
              <path d="M16.25 7.75l2.15 -2.15" />
              <path d="M18 12l3 0" />
              <path d="M16.25 16.25l2.15 2.15" />
              <path d="M12 18l0 3" />
              <path d="M7.75 16.25l-2.15 2.15" />
              <path d="M6 12l-3 0" />
              <path d="M7.75 7.75l-2.15 -2.15" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

export default CreateComments;
