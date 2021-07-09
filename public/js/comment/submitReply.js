(function(){
    const addCommentReply = (username, content, insertCommentId) => {
        let eachReply = document.createElement('div')
        eachReply.classList.add('card-body', 'eachReply')
        eachReply.innerHTML=`
            <p class="card-title">
                <span class="commentReplyUsername">
                ${username}
                </span>
                :
            </p>
            <p class="card-text ms-3">
                ${content}
            </p>`
        document.getElementById(`replyIndex${insertCommentId}`).prepend(eachReply)
    }

    $(document).on('submit','.replyToCommentForm',function(e){
        e.preventDefault()
        const replyId = e.target.id.slice(14)
        const replyContent = e.target[0].value
        e.target[0].value = ``
        addCommentReply(currentUser.username, replyContent, replyId)
        const postReplyToApi = async (replyContent) => { 
            const API_URL = e.target.action
            await fetch(API_URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reply:replyContent })
            })
        }
        postReplyToApi(replyContent)
    })

    const addReplyReply = (username,content, insertReplyId)=>{
        let eachReply = document.createElement('div')
        eachReply.classList.add('card-body', 'eachReply')
        eachReply.innerHTML=`
            <p class="card-title">
                <span class="commentReplyUsername">
                ${username}
                </span>
                :
            </p>
            <p class="card-text ms-3">
                ${content}
            </p>`
        document.getElementById(`eachReply${insertReplyId}`).insertAdjacentElement('afterend',eachReply)
    }

    $(document).on('submit','.replyToReplyForm',function(e){
        e.preventDefault()
        const replyId = e.target.id.slice(16)
        const replyContent = e.target[0].value
        e.target[0].value = ``
        addReplyReply(currentUser.username, replyContent, replyId)
        const postReplyToApi = async (replyContent) => { 
            const API_URL = e.target.action
            await fetch(API_URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reply:replyContent })
            })
        }
        postReplyToApi(replyContent)
    })

    $(document).on('submit','.deleteComment',function(e){
        e.preventDefault()
        const commentId = e.target.id.slice(13)
        document.getElementById(`commentComponent${commentId}`).remove()
        const deleteComment = async () => { 
            const API_URL = e.target.action
            await fetch(API_URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
        }
        deleteComment()
    })

    $(document).on('submit','.deleteReply',function(e){
        e.preventDefault()
        const replyId = e.target.id.slice(11)
        document.getElementById(`eachReply${replyId}`).remove()
        const deleteReply = async () => { 
            const API_URL = e.target.action
            await fetch(API_URL, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
        }
        deleteReply()
    })
})()