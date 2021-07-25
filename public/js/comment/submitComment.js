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
                    <p>
                        <a class="btn btn-primary replyButton btn-sm ms-3" data-bs-toggle="collapse" href="#replyToComment${data.commentId}" role="button" aria-expanded="false" aria-controls="replyToComment${comment._id}">
                            Reply
                        </a>
                    </p>
                    <form class="ms-3 deleteComment" action='/${ideaId}/comment/${data.commentId}?_method=DELETE' method="POST" id='deleteComment${data.commentId}'>
                        <button class='btn btn-sm btn-danger commentDeleteButton'>Delete</button>
                    </form>
                </div>`

            let replyContainer = document.createElement('div')  //replyContainer
            replyContainer.classList.add('collapse')
            replyContainer.id = `replyToComment${data.commentId}`
            eachCommentContainer.appendChild(replyContainer)
            
            replyContainer.innerHTML += `
                <form action="/${ideaId}/comment/${data.commentId}/reply" id='replyToCommentForm${data.commentId}' class="validated-form mb-3 mx-5 replyToCommentForm" method="POST" novalidate>
                    <div class="mb-3">
                        <textarea class='form-control replyBody' name='reply'
                            cols='30' rows='1' required></textarea>
                        <div class="valid-feedback">good!</div>
                        <div class="invalid-feedback">Please provide reply content.</div>
                    </div>
                    <button class="btn commentSubmit btn-sm">Submit</button>
                </form>`
            let replyIndex = document.createElement('div')      //replyIndex
            replyIndex.classList.add('card','replyIndex','ms-4')
            replyIndex.id = `replyIndex${data.commentId}`
            replyContainer.appendChild(replyIndex)
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
