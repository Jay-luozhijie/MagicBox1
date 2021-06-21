(function () {
    let ideasIndex = document.querySelector('.ideas')
    let loader = document.querySelector('.loader')
    let page = 1;
    const limit = 10;
    let loading = false;

    const getIdeas = async (page, limit, isSearching) => {
        const API_URL = !isSearching
                        ?`http://localhost:3000/api/ideaIndex/?page=${page}&limit=${limit}`
                        :`http://localhost:3000/api/searchIdeas/?page=${page}&limit=${limit}`;     //fetch data from db
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
        const response = await getIdeas(page, limit)            //initialize
        showIdeas(response.result)
    })()

    const showIdeas = (ideas) => {
        ideas.forEach(idea => {
            const ideaComponent = document.createElement('div');
            ideaComponent.classList.add('idea');
            
            ideaComponent.innerHTML = `
            <div class="mb-3 indexIdeaContainer">
                <div class=" mt-4 ms-2 mb-3">author: ${idea.author.username}</div>
                <div class=" indexIdeaContent ms-5">
                    <div class="mb-3 indexIdeaTitle">
                    ${idea.title}
                    </div>
                    <div class="indexIdeaDescription mb-2">
                    ${idea.description}
                    </div>
                    <div>
                        <a href="/${idea._id}" class="btn btn-primary bt-auto">more</a>
                    </div>
                </div>
                <p>
                    ${idea.upVote.length} people like this post!
                </p>
            </div>`;
            ideasIndex.appendChild(ideaComponent)
        })
    }

    const loadIdeas = async (page, limit) => {
        setTimeout(async () => {
            const response = await getIdeas(page, limit)
           
            showIdeas(response.result)
            total = response.total
            loading = false;
        },300)
    }

    window.addEventListener('scroll', async () => {
        const totalHeight = document.documentElement.scrollHeight
        const scrolledHeight = window.scrollY;
        const pageHeight = window.innerHeight;
        if (pageHeight + scrolledHeight > totalHeight - 1 && !loading) {
            loading = true;
            page++;
            await loadIdeas(page, limit);
        }
    }, { passive: true })

    

})()



