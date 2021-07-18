$(document).ready(function(){
    $('#commentForm').submit(function(e){
        e.preventDefault()
        let commentContent=document.querySelector('#commentbody').value
        document.querySelector('#commentbody').value=``
        let author = commentAuthor
        let url = 'http://localhost:3000/api/commentForm'
        $.post(url,{commentContent,ideaId}).done(function(data){

            const commentComponent = document.createElement('div')      //commentComponent
            commentComponent.classList.add('card', 'mb-3')
            commentComponent.id = `commentComponent${data.commentId}`
            $('#commentsContainer').prepend(commentComponent)

            const eachCommentContainer = document.createElement('div')
            eachCommentContainer.classList.add('card-body')
            eachCommentContainer.id=`eachCommentContainer${data.commentId}`
            commentComponent.appendChild(eachCommentContainer)
            eachCommentContainer.innerHTML=`
                <div class="card-title commentReplyUsername">${author}</div>
                <div class="card-text mx-3 mb-2">${commentContent}</div>`
            eachCommentContainer.innerHTML += `
                <div class='d-flex flex-row'>
                    <form class="ms-3 deleteComment" action='/${ideaId}/comment/${data.commentId}?_method=DELETE' method="POST" id='deleteComment${data.commentId}'>
                        <button class='btn btn-sm btn-danger commentDeleteButton'>Delete</button>
                    </form>
                </div>`
            let replyContainer = document.createElement('div')  //replyContainer
            replyContainer.classList.add('collapse')
            replyContainer.id = `replyToComment${data.commentId}`
            eachCommentContainer.appendChild(replyContainer)
            console.log(data.commentId)
            replyContainer.innerHTML += `
                <form action="/${ideaId}/comment/${data.commentId}/reply" id='replyToComment${data.commentId}' class="validated-form mb-3 mx-5 replyToCommentForm" method="POST" novalidate>
                    <div class="mb-3">
                        <textarea class='form-control replyBody' name='reply'
                            cols='30' rows='1' required></textarea>
                        <div class="valid-feedback">good!</div>
                        <div class="invalid-feedback">Please provide reply content.</div>
                    </div>
                    <button class="btn commentSubmit btn-sm">Submit</button>
                </form>`
            // $(document).on('submit','.replyToCommentForm',function(e){
            //     e.preventDefault()
            //     console.log('hello')
            //     // let reply = this[0].value
            //     // this[0].value = ``
            //     // let commentId = this.id.slice(14)
            //     // let url = this.action
            //     // $.post(url,{reply}).done(function(data){
            //     //     let eachReply = document.createElement('div')
            //     //     eachReply.classList.add('card-body', 'eachReply')
            //     //     eachReply.id = `eachReply${data.replyId}`
            //     //     eachReply.innerHTML=`
            //     //         <p class="card-title">
            //     //             <span class="commentReplyUsername">
            //     //             ${currentUser.username} reply to ${data.commentAuthor}
            //     //             </span>
            //     //             :
            //     //         </p>
            //     //         <p class="card-text ms-3">
            //     //             ${reply}
            //     //         </p>
            //     //         <div class="d-flex flex-row">
            //     //             <p class="">
            //     //                 <a class="btn btn-primary replyButton btn-sm ms-3"
            //     //                     data-bs-toggle="collapse"
            //     //                     href="#reply${data.replyId}" role="button"
            //     //                     aria-expanded="false"
            //     //                     aria-controls="reply${data.replyId}">
            //     //                     Reply
            //     //                 </a>
            //     //             </p>
            //     //             <form class="ms-2 deleteReply"
            //     //                 action='/${ideaId}/comment/${commentId}/reply/${data.replyId}?_method=DELETE'
            //     //                 method="POST" id = 'deleteReply${data.replyId}'>
            //     //                 <button class='btn btn-sm btn-danger commentDeleteButton'>Delete</button>
            //     //             </form>
            //     //         </div>`
            //     //     document.getElementById(`replyIndex${commentId}`).prepend(eachReply)
            //     // })
            // })
        })
    })

    $(document).on('submit','.deleteComment',function(e){
        e.preventDefault()
        let commentId = this.id.slice(13)
        let url = this.action
        document.getElementById(`commentComponent${commentId}`).remove()
        $.post(url,{}).done(function(data){})
    })
})

// (function(){
// let commentForm = document.querySelector('#commentForm')
// let commentsContainer = document.querySelector('#commentsContainer')
// let commentContent = document.querySelector('#commentbody')

// const addComment = (username, content)=>{
//     const newComment = document.createElement('div')
//     newComment.classList.add('card','mb-3')
//     newComment.innerHTML=`
//     <div class="card-body">
//         <div class="card-title commentReplyUsername">${username}</div>
//         <div class="card-text mx-3 mb-2">${content}</div>
//     </div>`
//     commentsContainer.insertAdjacentElement('afterbegin',newComment)
// }

// const postCommentToApi = async (commentContent)=>{
//     const API_URL = `http://localhost:3000/api/commentForm`
//     await fetch(API_URL, {
//         method:"POST",
//         headers:{
//             'Content-Type': 'application/json'
//         },
//         body:JSON.stringify({commentContent,ideaId})
//     })
// }
// commentForm.addEventListener('submit',async function(e){
//     e.preventDefault();
//     if(commentContent.value!==''){
//         let content = commentContent.value
//         commentContent.value=''
//         addComment(commentAuthor,content)
//         await postCommentToApi(content)
//     }   
// })
// })()
