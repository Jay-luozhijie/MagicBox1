$(document).ready(function(){
    $(document).on('submit','.replyToCommentForm',function(e){
        e.preventDefault()
        let reply = this[0].value
        this[0].value = ``
        let commentId = this.id.slice(18)
        let url = this.action
        $.post(url,{reply}).done(function(data){
            let eachReply = document.createElement('div')
            eachReply.classList.add('card-body', 'eachReply')
            eachReply.id = `eachReply${data.replyId}`
            eachReply.innerHTML=`
                <p class="card-title">
                    <span class="commentReplyUsername">
                    ${currentUser.username} reply to ${data.commentAuthor}
                    </span>
                    :
                </p>
                <p class="card-text ms-3">
                    ${reply}
                </p>
                <div class="d-flex flex-row">
                    <p>
                        <a class="btn btn-primary replyButton btn-sm ms-3" data-bs-toggle="collapse" href="#replyToReply${data.replyId}" role="button" aria-expanded="false" aria-controls="replyToReply${data.replyId}">
                            Reply
                        </a>
                    </p>
                    <form class="ms-3 deleteReply"
                        action='/${ideaId}/comment/${commentId}/reply/${data.replyId}?_method=DELETE'
                        method="POST" id = 'deleteReply${data.replyId}'>
                        <button class='btn btn-sm btn-danger commentDeleteButton'>Delete</button>
                    </form>
                </div>`
                let replyToReplyForm = document.createElement('div')
                replyToReplyForm.classList.add('collapse')
                replyToReplyForm.id = `replyToReply${data.replyId}`
                replyToReplyForm.innerHTML += `
                <form action="/${ideaId}/comment/${commentId}/reply/${data.replyId}"
                    class="validated-form mb-3 mx-5 replyToReplyForm" id = 'replyToReplyForm${data.replyId}'
                    method="POST" novalidate>
                    <div class="mb-3">
                        <textarea class='form-control'
                            name='reply' class='replyBody'
                            cols='30' rows='1'
                            required></textarea>
                        <div class="valid-feedback">good!</div>
                        <div class="invalid-feedback">Please provide reply content</div>
                    </div>
                    <button class="btn commentSubmit btn-sm">Submit</button>
                </form>`
                eachReply.appendChild(replyToReplyForm)
            document.getElementById(`replyIndex${commentId}`).prepend(eachReply)
        })
    })

    $(document).on('submit','.deleteReply',function(e){
        e.preventDefault()
        let replyId = this.id.slice(11)
        let url = this.action
        document.getElementById(`eachReply${replyId}`).remove()
        $.post(url,{}).done(function(data){})
    })

    $(document).on('submit','.replyToReplyForm',function(e){
        e.preventDefault()
        const oldReplyId = this.id.slice(16)
        const replyContent = this[0].value
        this[0].value = ``
        let url=this.action
        $.post(url,{reply:replyContent}).done(function(data){
            let eachReply = document.createElement('div')
            eachReply.classList.add('card-body', 'eachReply')
            eachReply.id = `eachReply${data.newReplyId}`
            eachReply.innerHTML=`
                <p class="card-title">
                    <span class="commentReplyUsername">
                    ${currentUser.username} reply to ${data.userRepliedTo}
                    </span>
                    :
                </p>
                <p class="card-text ms-3">
                    ${replyContent}
                </p>
                <div class="d-flex flex-row">
                    <p>
                        <a class="btn btn-primary replyButton btn-sm ms-3" data-bs-toggle="collapse" href="#replyToReply${data.newReplyId}" role="button" aria-expanded="false" aria-controls="replyToReply${data.newReplyId}">
                            Reply
                        </a>
                    </p>
                    <form class="ms-3 deleteReply"
                        action='/${ideaId}/comment/${data.commentId}/reply/${data.newReplyId}?_method=DELETE'
                        method="POST" id = 'deleteReply${data.newReplyId}'>
                        <button class='btn btn-sm btn-danger commentDeleteButton'>Delete</button>
                    </form>
                </div>`
                let replyToReplyForm = document.createElement('div')
                replyToReplyForm.classList.add('collapse')
                replyToReplyForm.id = `replyToReply${data.newReplyId}`
                replyToReplyForm.innerHTML += `
                <form action="/${ideaId}/comment/${data.commentId}/reply/${data.newReplyId}"
                    class="validated-form mb-3 mx-5 replyToReplyForm" id = 'replyToReplyForm${data.newReplyId}'
                    method="POST" novalidate>
                    <div class="mb-3">
                        <textarea class='form-control'
                            name='reply' class='replyBody'
                            cols='30' rows='1'
                            required></textarea>
                        <div class="valid-feedback">good!</div>
                        <div class="invalid-feedback">Please provide reply content</div>
                    </div>
                    <button class="btn commentSubmit btn-sm">Submit</button>
                </form>`
                eachReply.appendChild(replyToReplyForm)
            document.getElementById(`eachReply${oldReplyId}`).insertAdjacentElement('afterend',eachReply)
        })
        // const postReplyToApi = async (replyContent) => { 
        //     const API_URL = e.target.action
        //     await fetch(API_URL, {
        //         method: "POST",
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ reply:replyContent })
        //     })
        // }
        // postReplyToApi(replyContent)
    })
})
// (function(){
//     const addCommentReply = (username, content, insertCommentId) => {
//         let eachReply = document.createElement('div')
//         eachReply.classList.add('card-body', 'eachReply')
//         eachReply.innerHTML=`
//             <p class="card-title">
//                 <span class="commentReplyUsername">
//                 ${username}
//                 </span>
//                 :
//             </p>
//             <p class="card-text ms-3">
//                 ${content}
//             </p>`
//         document.getElementById(`replyIndex${insertCommentId}`).prepend(eachReply)
//     }

//     $(document).on('submit','.replyToCommentForm',function(e){
//         e.preventDefault()
//         const replyId = e.target.id.slice(14)
//         const replyContent = e.target[0].value
//         e.target[0].value = ``
//         addCommentReply(currentUser.username, replyContent, replyId)
//         const postReplyToApi = async (replyContent) => { 
//             const API_URL = e.target.action
//             await fetch(API_URL, {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ reply:replyContent })
//             })
//         }
//         postReplyToApi(replyContent)
//     })

//     const addReplyReply = (username,content, insertReplyId)=>{
//         let eachReply = document.createElement('div')
//         eachReply.classList.add('card-body', 'eachReply')
//         eachReply.innerHTML=`
//             <p class="card-title">
//                 <span class="commentReplyUsername">
//                 ${username}
//                 </span>
//                 :
//             </p>
//             <p class="card-text ms-3">
//                 ${content}
//             </p>`
//         document.getElementById(`eachReply${insertReplyId}`).insertAdjacentElement('afterend',eachReply)
//     }

//     $(document).on('submit','.replyToReplyForm',function(e){
//         e.preventDefault()
//         const replyId = e.target.id.slice(16)
//         const replyContent = e.target[0].value
//         e.target[0].value = ``
//         addReplyReply(currentUser.username, replyContent, replyId)
//         const postReplyToApi = async (replyContent) => { 
//             const API_URL = e.target.action
//             await fetch(API_URL, {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ reply:replyContent })
//             })
//         }
//         postReplyToApi(replyContent)
//     })

//     $(document).on('submit','.deleteComment',function(e){
//         e.preventDefault()
//         const commentId = e.target.id.slice(13)
//         document.getElementById(`commentComponent${commentId}`).remove()
//         const deleteComment = async () => { 
//             const API_URL = e.target.action
//             await fetch(API_URL, {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//             })
//         }
//         deleteComment()
//     })

//     $(document).on('submit','.deleteReply',function(e){
//         e.preventDefault()
//         const replyId = e.target.id.slice(11)
//         document.getElementById(`eachReply${replyId}`).remove()
//         const deleteReply = async () => { 
//             const API_URL = e.target.action
//             await fetch(API_URL, {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//             })
//         }
//         deleteReply()
//     })
// })()