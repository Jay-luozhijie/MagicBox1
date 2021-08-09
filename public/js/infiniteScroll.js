(function () {
    let ideasIndex = document.querySelector('.ideas')
    let loader = document.querySelector('.loader')
    let page = 1;
    const limit = 10;
    let loading = false;
    let apiResponse = undefined;
    let keyword = window.keyword;
    window.keyword = undefined;

    const getIdeas = async (page, limit) => {//fetch data from api
        const deployedAddress='https://secure-brushlands-03249.herokuapp.com'
        const localAddress ='http://localhost:3000'
        const API_URL = keyword
            // ? `https://secure-brushlands-03249.herokuapp.com/api/searchIndex/?page=${page}&limit=${limit}&keyword=${keyword}`// deploy version
            // : `https://secure-brushlands-03249.herokuapp.com/api/ideaIndex/?page=${page}&limit=${limit}`;
            ? localAddress+`/api/searchIndex/?page=${page}&limit=${limit}&keyword=${keyword}`
            : localAddress+`/api/ideaIndex/?page=${page}&limit=${limit}`;
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
        loader.style.visibility = "visible"
        apiResponse = await getIdeas(page, limit)
        showIdeas(apiResponse.result)
        loader.style.visibility = "hidden"

        if (keyword) {
            for (let i = 0; document.getElementsByClassName('indexIdeaTitle')[i] !== undefined; i++) {
                if (document.getElementsByClassName('indexIdeaTitle')[i].innerText.includes(keyword)) {
                    let title = document.getElementsByClassName('indexIdeaTitle')[i].innerText;
                    document.getElementsByClassName('indexIdeaTitle')[i].innerHTML = `<span class='colorRed'>` + title + `</span>`
                }
                if (document.getElementsByClassName('indexIdeaDescription')[i].innerText.includes(keyword)) {
                    const arr = document.getElementsByClassName('indexIdeaDescription')[0].innerText
                    const len = keyword.length
                    let newArr = '';
                    for (let j = 0; j < arr.length - len; j++) {
                        let word = arr.slice(j, j + len);
                        if (word == keyword) {
                            newArr = newArr + `<span class='colorRed'>` + word + `</span>`
                            j = j + len
                        } else {
                            newArr = newArr + arr[j]
                        }
                    }
                    document.getElementsByClassName('indexIdeaDescription')[i].innerHTML = newArr;
                }
            }
        }
    })()

    const showIdeas = (ideas) => {//show 10 ideas
        ideas.forEach(idea => {
            const ideaComponent = document.createElement('div');
            ideaComponent.classList.add('idea');
            if(!idea.deleted){
                ideaComponent.innerHTML = `
                <div class="mb-3 ideaCard">
                    <div class=" mt-1 ms-2 mb-3 indexIdeaAuthor">${idea.author.username}</div>
                    <div class=" indexIdeaContent ms-5">
                        <div class="mb-3 indexIdeaTitle">
                            ${idea.title}
                        </div>
                        <div class="indexIdeaDescription mb-2">
                            ${idea.description}
                        </div>
                        <div>
                            <a href="/${idea._id}" class="more-btn mt-5">more</a>
                        </div>
                    </div>
                    <p class="ms-5 mb-1 likedNum">
                        ${idea.upVote.length} people like this post!
                    </p>
                </div>`;
            } else {
                ideaComponent.innerHTML = `
                <div class="mb-3 ideaCard">
                    <div class="indexIdeaContent ms-5 mt-5">
                        <div class="mb-5 deletedIdeaDescription">
                            ${idea.description}
                        </div>
                        <div>
                            <a href="/${idea._id}" class="more-btn mt-5">more</a>
                        </div>
                    </div>
                    <p class="ms-5 mb-1 likedNum">
                        ${idea.upVote.length} people like this post!
                    </p>
                </div>`;
            }
            ideasIndex.appendChild(ideaComponent)
        })
    }

    const loadIdeas = async (page, limit) => {
        (async () => {
            apiResponse = await getIdeas(page, limit)
            showIdeas(apiResponse.result)
            loading = false;
            loader.style.visibility = "hidden";

            if (keyword) {
                for (let i = 0; document.getElementsByClassName('indexIdeaTitle')[i] !== undefined; i++) {
                    if (document.getElementsByClassName('indexIdeaTitle')[i].innerText.includes(keyword)) {
                        let title = document.getElementsByClassName('indexIdeaTitle')[i].innerText;
                        document.getElementsByClassName('indexIdeaTitle')[i].innerHTML = `<span class='colorRed'>` + title + `</span>`
                    }
                    if (document.getElementsByClassName('indexIdeaDescription')[i].innerText.includes(keyword)) {
                        const arr = document.getElementsByClassName('indexIdeaDescription')[0].innerText
                        const len = keyword.length
                        let newArr = '';
                        for (let j = 0; j < arr.length - len; j++) {
                            let word = arr.slice(j, j + len);
                            if (word == keyword) {
                                newArr = newArr + `<span class='colorRed'>` + word + `</span>`
                                j = j + len
                            } else {
                                newArr = newArr + arr[j]
                            }
                        }
                        document.getElementsByClassName('indexIdeaDescription')[i].innerHTML = newArr;
                    }
                }
            }
        })()
    }

    window.addEventListener('scroll', async () => {//listen to scroll-to-bottom event
        const totalHeight = document.documentElement.scrollHeight
        const scrolledHeight = window.scrollY;
        const pageHeight = window.innerHeight;

        if (pageHeight + scrolledHeight > totalHeight - 1 && !loading && apiResponse && apiResponse.next) {
            loader.style.visibility = "visible";
            loading = true;
            page++;
            await loadIdeas(page, limit);
        }
    }, { passive: true })
})()