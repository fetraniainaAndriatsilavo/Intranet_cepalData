import Comments from "../Components/Comments";
import Likes from "../Components/Likes";

function PostFooter({setIsOpen ,id, open, comments, likes}){ 
    return <div className={`bg-white  gap-3 p-2 w-full flex items-center justify-start ${ open == false ? 'rounded-b-lg' : ''}`} id={id}>  
        <Likes id={id} like={likes}> </Likes> 
        <Comments setIsOpen={setIsOpen} id={id} comments={comments}> </Comments>
    </div>
}   
export default PostFooter;