const followBtn = document.querySelector('.followBtn');
const followed = document.querySelector('#cancelFollow');

let click0 = false;
if (followed) {
    click0 = true;
}

followBtn.addEventListener('click', async event => {
    if (click0) {
        click0 = false;
        followBtn.innerHTML = `Follow this author`;

        const data = { followBtn };
        const options = {
            method: 'POST',
            Headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        await fetch('/user/unfollow', options);
    } else {
        click0 = true;
        followBtn.innerHTML = `Cancel follow this author`;

        const data = { followBtn };
        const options = {
            method: 'POST',
            Headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        await fetch('/user/follow', options);
    }
})