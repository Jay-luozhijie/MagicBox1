(function () {
    let ideasIndex = document.querySelector('.ideas')
    let loader = document.querySelector('.loader')
    let page = 1;
    const limit = 10;
    let loading = false;
    let apiResponse=undefined;
    let keyword = window.keyword;
    window.keyword = undefined;

    const getIdeas = async (page, limit) => {
        const API_URL = keyword
                        ? `https://secure-brushlands-03249.herokuapp.com/api/searchIndex/?page=${page}&limit=${limit}&keyword=${keyword}`     //fetch data from db
                        : `https://secure-brushlands-03249.herokuapp.com/api/ideaIndex/?page=${page}&limit=${limit}`;
                        // ? `http://localhost:3000/api/searchIndex/?page=${page}&limit=${limit}&keyword=${keyword}`     //fetch data from db
                        // : `http://localhost:3000/api/ideaIndex/?page=${page}&limit=${limit}`;
        const response = await fetch(API_URL, {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.status}`);
        }
        return await response.json();
    }

    (async function ()  {
        loader.style.visibility="visible"
        apiResponse = await getIdeas(page, limit)            //initialize
        showIdeas(apiResponse.result)
        loader.style.visibility="hidden"
    })()

    const showIdeas = (ideas) => {
        console.log(ideas);
        ideas.forEach(idea => {
            console.log(idea);
            const ideaComponent = document.createElement('div');
            ideaComponent.classList.add('idea');
            ideaComponent.innerHTML = `
            <div class="mb-3 indexIdeaContainer">
                <div class=" mt-1 ms-2 mb-3 IndexideaAuthor">${idea.author.username}</div>
                <div class=" indexIdeaContent ms-5">
                    <div class="mb-3 indexIdeaTitle">
                    ${idea.title}
                    </div>
                    <div class="indexIdeaDescription mb-2">
                    ${idea.description}
                    </div>
                    <div>
                        <a href="/${idea._id}" class="btn btn-primary btn-IndexMore">more</a>
                    </div>
                </div>
                <p class="ms-5 mb-1 indexLikedNumber">
                    ${idea.upVote.length} people like this post!
                </p>
            </div>`;
            ideasIndex.appendChild(ideaComponent)
        })
    }

    const loadIdeas = async (page, limit) => {
        setTimeout(async () => {
            apiResponse = await getIdeas(page, limit)
            showIdeas(apiResponse.result)
            loading = false;
            loader.style.visibility ="hidden";
        },0)
    }

    window.addEventListener('scroll', async () => {
        const totalHeight = document.documentElement.scrollHeight
        const scrolledHeight = window.scrollY;
        const pageHeight = window.innerHeight;
        if (pageHeight + scrolledHeight > totalHeight - 1 && !loading && apiResponse.next) {
            loader.style.visibility ="visible";
            loading = true;
            page++;
            await loadIdeas(page, limit);
        }
    }, { passive: true })
})()



