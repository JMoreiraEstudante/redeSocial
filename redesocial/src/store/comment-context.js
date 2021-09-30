import { createContext, useState } from "react";

const CommentContext = createContext({
    comment: '',
    commentPick: (id) => {}    
})

export function CommentContextProvider(props){
    const [commentSelected, setCommentSelected] = useState('');

    function commentPick(id) {
        setCommentSelected(id)
    }

    const context = {
        comment: commentSelected,
        commentPick: commentPick,
    }

    return (
        <CommentContext.Provider value={context}>
            {props.children}
        </CommentContext.Provider>
    )
}

export default CommentContext