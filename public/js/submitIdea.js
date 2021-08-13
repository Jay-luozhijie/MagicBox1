$(document).ready(function(){
    $('#submitIdeaForm').submit(function(e){
        let content = tinyMCE.get('submitIdeaDescription').getContent();
        if(content===''){
            e.preventDefault()
            const noAnswerContent = document.querySelector('#noIdeaDescriptionErrorMessage')
            noAnswerContent.innerHTML=`
                Please provide idea description!
            `
        }
    })
})