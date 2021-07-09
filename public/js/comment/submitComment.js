(function(){
let commentForm = document.querySelector('#commentForm')
let commentsContainer = document.querySelector('#commentsContainer')
let commentContent = document.querySelector('#commentbody')

const addComment = (username, content)=>{
    const newComment = document.createElement('div')
    newComment.classList.add('card','mb-3')
    newComment.innerHTML=`
    <div class="card-body">
        <div class="card-title commentReplyUsername">${username}</div>
        <div class="card-text mx-3 mb-2">${content}</div>
    </div>`
    commentsContainer.insertAdjacentElement('afterbegin',newComment)
}

const postCommentToApi = async (commentContent)=>{
    const API_URL = `http://localhost:3000/api/commentForm`
    await fetch(API_URL, {
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({commentContent,ideaId})
    })
}

commentForm.addEventListener('submit',async function(e){
    e.preventDefault();
    if(commentContent.value!==''){
        let content = commentContent.value
        commentContent.value=''
        addComment(commentAuthor,content)
        await postCommentToApi(content)
    }   
})
})()
