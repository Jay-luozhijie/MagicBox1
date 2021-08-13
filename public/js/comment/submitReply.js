$(document).ready(function(){
    $(document).on('submit','.replyToCommentForm',function(e){
        e.preventDefault()
        let reply = this[0].value
        this[0].value = ``
        let commentId = this.id.slice(18)
        let url = this.action
        const noReplyContent = document.querySelector(`#noReplyContentWarning${commentId}`)
        if(reply === ``){
            noReplyContent.innerHTML=`Please provide reply content`
        } else {
            noReplyContent.innerHTML=``
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
                        class="mb-3 mx-5 replyToReplyForm" id = 'replyToReplyForm${data.replyId}'
                        method="POST">
                        <div class="mb-3">
                            <textarea class='form-control' name='reply' class='replyBody' cols='30' rows='1'></textarea>
                            <div class='noContentWarning' id='noReplyToReplyContent${data.replyId}'>
                            
                            </div>
                        </div>
                        <button class="btn commentSubmit btn-sm">Submit</button>
                    </form>`
                    eachReply.appendChild(replyToReplyForm)
                document.getElementById(`replyIndex${commentId}`).prepend(eachReply)
            })
        }
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
        const noReplyContent = document.querySelector(`#noReplyToReplyContent${oldReplyId}`)
        if(replyContent === ``){
            noReplyContent.innerHTML='Please provide reply content.'
        } else {
            noReplyContent.innerHTML=``
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
                        class="mb-3 mx-5 replyToReplyForm" id = 'replyToReplyForm${data.newReplyId}'
                        method="POST">
                        <div class="mb-3">
                            <textarea class='form-control' name='reply' class='replyBody' cols='30' rows='1'></textarea>
                            <div class='noContentWarning' id='noReplyToReplyContent${data.newReplyId}'>
                            
                            </div>
                        </div>
                        <button class="btn commentSubmit btn-sm">Submit</button>
                    </form>`
                    eachReply.appendChild(replyToReplyForm)
                document.getElementById(`eachReply${oldReplyId}`).insertAdjacentElement('afterend',eachReply)
            })
        }
    })
})