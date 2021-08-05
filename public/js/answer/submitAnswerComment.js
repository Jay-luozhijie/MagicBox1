$(document).ready(function(){

    $(document).on('submit', '.commentToAnswerForm',function(e){
        e.preventDefault()
        let commentToAnswer = this[0].value
        this[0].value=``
        let answerId = this.id.slice(19)
        let url = this.action

        $.post(url,{commentToAnswer}).done(function(data){
            const commentComponent = document.createElement('div')      //commentComponent
            commentComponent.classList.add('card', 'mb-3')
            commentComponent.id = `commentComponent${data.commentId}`
            $(`#answerCommentsContainer${answerId}`).prepend(commentComponent)

            const eachCommentContainer = document.createElement('div')
            eachCommentContainer.classList.add('card-body')
            eachCommentContainer.id=`eachCommentContainer${data.commentId}`
            commentComponent.appendChild(eachCommentContainer)
            eachCommentContainer.innerHTML=`
                <div class="card-title commentReplyUsername">${data.commentAuthor}</div>
                <div class="card-text mx-3 mb-2">${commentToAnswer}</div>`
            eachCommentContainer.innerHTML += `
                <div class='d-flex flex-row'>
                    <p>
                        <a class="btn btn-primary replyButton btn-sm ms-3" data-bs-toggle="collapse" href="#replyToComment${data.commentId}" role="button" aria-expanded="false" aria-controls="replyToComment${data.commentId}">
                            Reply
                        </a>
                    </p>
                    <form class="ms-3 deleteComment" action='/${ideaId}/answer/${answerId}/${data.commentId}?_method=DELETE' method="POST" id='deleteComment${data.commentId}'>
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

})
