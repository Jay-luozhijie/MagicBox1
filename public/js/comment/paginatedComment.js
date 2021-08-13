(function(){
    let commentsContainer = document.querySelector('#commentsContainer')
    let loader = document.querySelector('#commentNavigation')
    let page = 1;
    const limit = 5;
    let apiResponse = undefined;
    const commentPreviousPage = document.querySelector('#commentPreviousPage')
    const commentNextPage = document.querySelector('#commentNextPage')

    const getComments = async (page, limit) => {//fetch data from api
        const deployedAddress='https://secure-brushlands-03249.herokuapp.com'
        const localAddress ='http://localhost:3000'
        const API_URL = deployedAddress+`/api/paginatedComment/?page=${page}&limit=${limit}&commentNum=${commentArrayLength}&ideaId=${ideaId}`;
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.status}`);
        }
        return await response.json();
    }

    (async function () {//initialize
        apiResponse = await getComments(page, limit)
        showComments(apiResponse.result)
    })()

    const showComments = (comments) => {//show 5 comment
        const commentNavigation = document.querySelector('#commentNavigation')
        if (apiResponse.previous && apiResponse.next) {
            commentNavigation.innerHTML = `
            <a class='btn me-3 commentNavigationBtn' id='commentPreviousPage'>&lt;---previous</a>
            <span style="font-size:18px;">${page}</span>
            <a class='btn ms-3 commentNavigationBtn' id='commentNextPage'>next---&gt;</a>`
        } else if(!apiResponse.next && !apiResponse.previous){
            commentNavigation.innerHTML = `
            <span style="font-size:18px;">${page}</span>`
        } else if(!apiResponse.next){
            commentNavigation.innerHTML = `
            <a class='btn me-3 commentNavigationBtn' id='commentPreviousPage'>&lt;---previous</a>
            <span style="font-size:18px;">${page}</span>`
        } else {
            commentNavigation.innerHTML = `
            <span style="font-size:18px;">${page}</span>
            <a class='btn ms-3 commentNavigationBtn' id='commentNextPage'>next---&gt;</a>`
        }
        comments.forEach(comment => {
            const commentComponent = document.createElement('div')      //commentComponent
            commentComponent.classList.add('card', 'mb-3')
            commentComponent.id = `commentComponent${comment._id}`
            commentsContainer.appendChild(commentComponent)
            
            const eachCommentContainer = document.createElement('div'); //eachCommentContainer
            eachCommentContainer.classList.add('card-body')
            eachCommentContainer.id = `eachCommentContainer${comment._id}`
            commentComponent.appendChild(eachCommentContainer)
                eachCommentContainer.innerHTML = `
                <div class="card-title commentReplyUsername">${comment.author.username}</div>
                <div class="card-text mx-3 mb-2">${comment.commentBody}</div>`
            if (currentUser) {
                if (comment.author._id === currentUser._id) {
                    eachCommentContainer.innerHTML += `
                    <div class='d-flex flex-row'>
                        <p>
                            <a class="btn btn-primary replyButton btn-sm ms-3" data-bs-toggle="collapse" href="#replyToComment${comment._id}" role="button" aria-expanded="false" aria-controls="replyToComment${comment._id}">
                                Reply
                            </a>
                        </p>
                        <form class="ms-2 deleteComment" action='/${ideaId}/comment/${comment._id}?_method=DELETE' method="POST" id='deleteComment${comment._id}'>
                            <button class='btn btn-sm btn-danger commentDeleteButton'>Delete</button>
                        </form>
                    </div>`
                } else {
                    eachCommentContainer.innerHTML += `
                    <p>
                        <a class="btn btn-primary replyButton btn-sm ms-3" data-bs-toggle="collapse" href="#replyToComment${comment._id}" role="button" aria-expanded="false" aria-controls="replyToComment${comment._id}">
                            Reply
                        </a>
                    </p>`
                }
            }
                    let replyContainer = document.createElement('div')  //replyContainer
                    replyContainer.classList.add('collapse')
                    replyContainer.id = `replyToComment${comment._id}`
                    eachCommentContainer.appendChild(replyContainer)
                    if (currentUser) {
                        replyContainer.innerHTML += `
                        <form action="/${ideaId}/comment/${comment._id}/reply" id='replyToCommentForm${comment._id}' class="mb-3 mx-5 replyToCommentForm" method="POST">
                            <div class="mb-3">
                                <textarea class='form-control replyBody' name='reply'
                                    cols='30' rows='1'></textarea>
                                <div class='noContentWarning' id='noReplyContentWarning${comment._id}'>
                                
                                </div>
                            </div>
                            <button class="btn commentSubmit btn-sm">Submit</button>
                        </form>`
                    }
                        // <div class='card replyIndex ms-4'>
                        let replyIndex = document.createElement('div')      //replyIndex
                        replyIndex.classList.add('card','replyIndex','ms-4')
                        replyIndex.id = `replyIndex${comment._id}`
                        replyContainer.appendChild(replyIndex)
                        for (let reply of comment.reply) {
                            // <div class='card-body eachReply'>
                            let eachReply = document.createElement('div')
                            eachReply.classList.add('card-body','eachReply')
                            eachReply.id = `eachReply${reply._id}`
                            replyIndex.appendChild(eachReply)
                            eachReply.innerHTML += `
                                <p class="card-title">
                                    <span class="commentReplyUsername">
                                        ${reply.author.username}
                                    </span>
                                    reply to 
                                    <span class="commentReplyUsername">
                                        ${reply.replyTo.username}
                                    </span> :
                                </p>
                                <p class="card-text ms-3">
                                    ${reply.replyBody}
                                </p>`
                        if (currentUser) {
                            if (reply.author._id === currentUser._id) {
                                eachReply.innerHTML += `
                                <div class="d-flex flex-row">
                                    <p class="">
                                        <a class="btn btn-primary replyButton btn-sm ms-3"
                                            data-bs-toggle="collapse"
                                            href="#replyToReply${reply._id}" role="button"
                                            aria-expanded="false"
                                            aria-controls="replyToReply${reply._id}">
                                            Reply
                                        </a>
                                    </p>
                                    <form class="ms-2 deleteReply"
                                        action='/${ideaId}/comment/${comment._id}/reply/${reply._id}?_method=DELETE'
                                        method="POST" id = 'deleteReply${reply._id}'>
                                        <button class='btn btn-sm btn-danger commentDeleteButton'>Delete</button>
                                    </form>
                                </div>`
                            } else {
                                eachReply.innerHTML += `
                                <p>
                                    <a class="btn replyButton btn-sm ms-3"
                                        data-bs-toggle="collapse"
                                        href="#replyToReply${reply._id}" role="button"
                                        aria-expanded="false"
                                        aria-controls="replyToReply${reply._id}">
                                        Reply
                                    </a>
                                </p>`
                            }
                        }
                                //<div class='collapse'>
                                let replyToReplyForm = document.createElement('div')
                                replyToReplyForm.classList.add('collapse')
                                replyToReplyForm.id = `replyToReply${reply._id}`
                                eachReply.appendChild(replyToReplyForm)
                                if (currentUser) {
                                    replyToReplyForm.innerHTML += `
                                    <form action="/${ideaId}/comment/${comment._id}/reply/${reply._id}"
                                        class="mb-3 mx-5 replyToReplyForm" id = 'replyToReplyForm${reply._id}'
                                        method="POST">
                                        <div class="mb-3">
                                            <textarea class='form-control' name='reply' class='replyBody' cols='30' rows='1'></textarea>
                                            <div class='noContentWarning' id='noReplyToReplyContent${reply._id}'>
                                            
                                            </div>
                                        </div>
                                        <button class="btn commentSubmit btn-sm">Submit</button>
                                    </form>`
                                }
                        }
        })
    }

    $(document).on('click', '#commentPreviousPage', async function (e) {
        e.preventDefault()
        if (apiResponse.previous) {
            commentsContainer.innerHTML = ``
            page--;
            await loadComments(page, limit);
        } else {

        }
    })

    $(document).on('click', '#commentNextPage', async function (e) {
        e.preventDefault()
        if (apiResponse.next) {
            commentsContainer.innerHTML = ``
            page++;
            await loadComments(page, limit);
        } else {

        }
    })

    const loadComments = async (page, limit) => {
        (async () => {
            apiResponse = await getComments(page, limit)
            showComments(apiResponse.result)
        })()
    }
})()
