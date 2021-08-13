$(document).ready(function(){
    $('#submitAnswerForm').submit(function(e){
        let content = tinyMCE.get('submitAnswerContent').getContent();
        if(content===''){
            e.preventDefault()
            const noAnswerContent = document.querySelector('#noAnswerContentErrorMessage')
            noAnswerContent.innerHTML=`
                Please provide answer description!
            `
        }
    })
})