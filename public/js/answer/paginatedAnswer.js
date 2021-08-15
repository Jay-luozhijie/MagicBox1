(function () {
    let page = 1;
    const limit = 5;
    let apiResponse = undefined;
    let loading = false;
    let loadingSign = document.querySelector('.loadingSign')
    
    const getAnswers = async (page, limit) => {//fetch data from api
        const deployedAddress = 'https://magicbox2021.herokuapp.com'
        const localAddress = 'http://localhost:3000'
        const API_URL = deployedAddress + `/api/paginatedAnswer/?page=${page}&limit=${limit}&ideaId=${ideaId}`;
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
        loadingSign.style.visibility = "visible"
        apiResponse = await getAnswers(page, limit)
        showAnswers(apiResponse.result)
        loadingSign.style.visibility = "hidden"
    })()

    const showAnswers = (answers) => {//show 10 ideas
        if (answers.length === 0) {
            const answerContainer = document.querySelector('#answerContainer')
            answerContainer.innerHTML += `This post hasn't received any answer.`
        }
        answers.forEach(answer => {
            const answerContainer = document.querySelector('#answerContainer')

            const answerComponent = document.createElement('div')      //answerComponent
            answerComponent.classList.add('card', 'my-3', 'answerComponent')
            answerComponent.id = `answerComponent${answer._id}`
            answerContainer.appendChild(answerComponent)

            const eachAnswerContainer = document.createElement('div')
            eachAnswerContainer.classList.add('card-body', 'ms-3', 'mb-3')
            eachAnswerContainer.id = `eachAnswerContainer${answer._id}`
            answerComponent.appendChild(eachAnswerContainer)

            const answerContent = document.createElement('div')
            eachAnswerContainer.appendChild(answerContent)
            answerContent.innerHTML += `
                <div class="answerAuthor mb-2">
                    ${answer.author.username}
                </div>
                <div class='answerContent'>
                    ${answer.content}
                </div>`

            const carousel = document.createElement('div')
            carousel.id = `carousel${answer._id}`
            carousel.classList.add('carousel', 'slide')
            carousel.dataBsInterval = "false"
            carousel.dataBsRide = "carousel"
            answerContent.appendChild(carousel)

            const innerCarousel = document.createElement('div')
            innerCarousel.classList.add('carousel-inner')
            carousel.appendChild(innerCarousel)
            answer.images.forEach(function (img, i) {
                if (i === 0) {
                    innerCarousel.innerHTML += `
                    <div class="carousel-item active">
                        <img style="max-width: 1000px; max-height: 500px;" src="${img.url}" class='d-block w-100' alt="">
                    </div>`
                } else {
                    innerCarousel.innerHTML += `
                    <div class="carousel-item">
                        <img style="max-width: 1000px; max-height: 500px;" src="${img.url}" class='d-block w-100' alt="">
                    </div>`
                }
            })
            
            if (answer.images.length > 1) {
                carousel.innerHTML += `
                <button class="carousel-control-prev carousel-button" type="button"
                    data-bs-target="#carousel${answer._id}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next carousel-button" type="button"
                    data-bs-target="#carousel${answer._id}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>`
            }


            const answerBtnGroup = document.createElement('div')
            answerBtnGroup.classList.add('my-3','answerBtnGroup')
            eachAnswerContainer.appendChild(answerBtnGroup)
            answerBtnGroup.innerHTML += `
            <div class='answerCommentBtnContainer'>
                <a class="btn showIdea-buttons mx-1" data-bs-toggle="collapse" href="#commentToAnswer${answer._id}" role="button" aria-expanded="false" aria-controls="#commentToAnswerForm${answer._id}">
                    Comment
                </a>
            </div>`
            if (currentUser) {
                if (currentUser && answer.author._id === currentUser._id) {
                    answerBtnGroup.innerHTML += `
                    <div class='answerDeleteBtnContainer'>
                        <form action='/${ideaId}/answer/${answer._id}?_method=DELETE' class='deleteAnswer' id='deleteAnswer${answer._id}' method="POST">
                            <button class='answerDeleteBtn showIdea-buttons mx-1'>Delete</button>
                        </form>
                    </div>
                    <div class='answerEditBtnContainer'>
                        <button class='answerEdit-btn showIdea-buttons mx-1' id='answerEditBtn${answer._id}'>
                            Edit
                        </button>
                    </div>`
                }
            }

            const commentContainer = document.createElement('div')
            commentContainer.classList.add('collapse')
            commentContainer.id = `commentToAnswer${answer._id}`
            eachAnswerContainer.appendChild(commentContainer)
            if (currentUser) {
                commentContainer.innerHTML += `
                <form action="/${ideaId}/answer/${answer._id}/comment" class="mb-3 commentToAnswerForm" id="commentToAnswerForm${answer._id}" method="POST">
                    <div class="my-3">
                        <label class="form-label" for="commentbody${answer._id}">Comment</label>
                        <textarea class='form-control' name='commentToAnswer' id='commentbody${answer._id}' cols='30' rows='2'></textarea>
                        <div class='noContentWarning' id='noAnswerCommentContentWarning${answer._id}'>
                        
                        </div>
                    </div>
                    <div class="d-flex flex-row-reverse">
                        <button class="btn btn-sm commentSubmit">Submit</button>
                    </div>
                </form>
                <hr style="height:20px; color:#ced4da;">`
            }
            commentContainer.innerHTML += `
            <div>
                <div class="mx-5" id="answerCommentsContainer${answer._id}">
                    
                </div>
                <div id='answerCommentNavigation${answer._id}' class='d-flex justify-content-center'>
                    
                </div>
            </div>`

            const editPage = document.createElement('div')
            editPage.classList.add('answerEdit-modal')
            editPage.id = `answerEditModal${answer._id}`
            eachAnswerContainer.appendChild(editPage)
            editPage.innerHTML += `
            <div class='answerEdit-modalHeader'>
                <div class="answerEditTitle">Edit your answer</div>
                <button class='answerEditClose-btn' id = 'answerEditCloseBtn${answer._id}'>&times;</button>
            </div>`

            const modalBody = document.createElement('div')
            modalBody.classList.add('answerEdit-modalBody')
            editPage.appendChild(modalBody)

            const editForm = document.createElement('form')
            modalBody.appendChild(editForm)
            editForm.action = `/${ideaId}/answer/${answer._id}?_method=PUT`
            editForm.classList.add('editAnswerForm','my-3')
            editForm.id=`editAnswerForm${answer._id}`
            editForm.method = "POST"
            editForm.enctype = 'multipart/form-data'
            editForm.noValidate = true
            editForm.innerHTML += `
            <label class='mb-2'>Share your product:</label>
            <textarea class='textEditorArea' name="answerContent" placeholder="description:">${answer.content}</textarea>
            <div class='noContentWarning' id='noEditedAnswerContent${answer._id}'>
            
            </div>
            <div class="mb-2 mt-3">
                <label class="mb-2">upload images:</label>
                <input class="form-control" type="file" id="answerImage" name='answerImage'
                    multiple>
            </div>`

            const imageIndex = document.createElement('div')
            imageIndex.style = 'display:flex; flex-direction:column; justify-content: left;'
            editForm.appendChild(imageIndex)
            answer.images.forEach(function (img) {
                imageIndex.innerHTML += `
                <img src="${img.url}" alt="">
                <label for='image-${img.filename}'>Delete</label>
                <input type='checkbox' name='deleteImages[]' value='${img.filename}' id='image-${img.filename}'>`
            })

            editForm.innerHTML += `
            <div class='mt-3'>
                <button type="submit" class="btn" id='answerSubmit'>Save</button>
            </div>`

            tinymce.init({
                width:'100%',
                height:'400px',
                selector: '.textEditorArea',
                plugins: 'advlist link lists',
                toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify| link',
            });

            let answerEditBtn = document.querySelector(`#answerEditBtn${answer._id}`)
            if(answerEditBtn !== null){
                answerEditBtn.addEventListener('click', function () {
                    const answerEditModal = document.querySelector('#answerEditModal' + answer._id)
                    answerEditModal.style.transform = 'translate(-50%,-50%) scale(1)';  
                    document.querySelector('#backgroundCover').style.visibility='visible'
                    $('body').css('overflow','hidden')
                })
                let answerEditCloseBtn = document.querySelector(`#answerEditCloseBtn${answer._id}`)
                answerEditCloseBtn.addEventListener('click',function(){
                    const answerEditModal = document.querySelector('#answerEditModal' + answer._id);
                    answerEditModal.style.transform = 'translate(-50%,-50%) scale(0)';  
                    document.querySelector('#backgroundCover').style.visibility='hidden';
                    $('body').css('overflow','auto')
                })
            }

            let answerId = answer._id
            let commentsContainer = document.querySelector(`#answerCommentsContainer${answerId}`)
            let commentPage = 1;
            const commentLimit = 5;
            let commentApiResponse = undefined;

            const getComments = async (page, limit) => {//fetch data from api
                const deployedAddress = 'https://magicbox2021.herokuapp.com'
                const localAddress = 'http://localhost:3000'
                const API_URL = deployedAddress + `/api/paginatedAnswerComment/?page=${commentPage}&limit=${commentLimit}&answerId=${answerId}`;
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

            const showComments = (comments) => {//show 5 comment
                const commentNavigation = document.querySelector(`#answerCommentNavigation${answerId}`)
                if (commentApiResponse.previous && commentApiResponse.next) {
                    commentNavigation.innerHTML = `
                <a class='btn me-3 commentNavigationBtn' id='answerCommentPreviousPage${answerId}'>&lt;---previous</a>
                <span style="font-size:18px;">${commentPage}</span>
                <a class='btn ms-3 commentNavigationBtn' id='answerCommentNextPage${answerId}'>next---&gt;</a>`
                } else if (!commentApiResponse.next && !commentApiResponse.previous) {
                    commentNavigation.innerHTML = `
                <span style="font-size:18px;">${commentPage}</span>`
                } else if (!commentApiResponse.next) {
                    commentNavigation.innerHTML = `
                <a class='btn me-3 commentNavigationBtn' id='answerCommentPreviousPage${answerId}'>&lt;---previous</a>
                <span style="font-size:18px;">${commentPage}</span>`
                } else {
                    commentNavigation.innerHTML = `
                <span style="font-size:18px;">${commentPage}</span>
                <a class='btn ms-3 commentNavigationBtn' id='answerCommentNextPage${answerId}'>next---&gt;</a>`
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
                                <form class="ms-2 deleteComment" action='/${ideaId}/answer/${answerId}/${comment._id}?_method=DELETE' method="POST" id='deleteComment${comment._id}'>
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
                    replyIndex.classList.add('card', 'replyIndex', 'ms-4')
                    replyIndex.id = `replyIndex${comment._id}`
                    replyContainer.appendChild(replyIndex)
                    for (let reply of comment.reply) {
                        // <div class='card-body eachReply'>
                        let eachReply = document.createElement('div')
                        eachReply.classList.add('card-body', 'eachReply')
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
                                                action='/${ideaId}/answer/${comment._id}/reply/${reply._id}?_method=DELETE'
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

            (async function () {//initialize
                commentApiResponse = await getComments(commentPage, commentLimit)
                showComments(commentApiResponse.result)
            })()



            const loadComments = async (page, limit) => {
                (async () => {
                    commentApiResponse = await getComments(page, limit)
                    showComments(commentApiResponse.result)
                })()
            }

            $(document).on('click', `#answerCommentPreviousPage${answerId}`, async function (e) {
                e.preventDefault()
                if (commentApiResponse.previous) {
                    commentsContainer.innerHTML = ``
                    commentPage--;
                    await loadComments(commentPage, commentLimit);
                } else {

                }
            })

            $(document).on('click', `#answerCommentNextPage${answerId}`, async function (e) {
                e.preventDefault()
                if (commentApiResponse.next) {
                    commentsContainer.innerHTML = ``
                    commentPage++;
                    await loadComments(commentPage, commentLimit);
                } else {

                }
            })
        })
    }

    $(document).on('submit','.editAnswerForm',function(e){
        let answerContent = this[0].value
        const answerId = this.id.slice(14)
        const noAnswerContent = document.querySelector(`#noEditedAnswerContent${answerId}`)
        if(answerContent === ``){
            e.preventDefault()
            noAnswerContent.innerHTML=`Please provide answer description.`
        } else {
            noAnswerContent.innerHTML=``
        }
    })

    $(document).on('submit', '.deleteAnswer', function (e) {
        e.preventDefault()
        let answerId = this.id.slice(12)
        let url = this.action
        document.getElementById(`answerComponent${answerId}`).remove()
        $.post(url, {}).done(function (data) { })
    })

    const loadAnswers = async (page, limit) => {
        (async () => {
            apiResponse = await getAnswers(page, limit)
            showAnswers(apiResponse.result)
            loading = false;
            loadingSign.style.visibility = "hidden";
        })()
    }

    window.addEventListener('scroll', async () => {//listen to scroll-to-bottom event
        const totalHeight = document.documentElement.scrollHeight
        const scrolledHeight = window.scrollY;
        const pageHeight = window.innerHeight;

        if (pageHeight + scrolledHeight > totalHeight - 1 && !loading && apiResponse && apiResponse.next) {
            loadingSign.style.visibility = "visible";
            loading = true;
            page++;
            await loadAnswers(page, limit);
        }
    }, { passive: true })
})()
