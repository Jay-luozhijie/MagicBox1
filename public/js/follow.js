const followBtn = document.querySelector('.followBtn');
const followed = document.querySelector('#cancelFollow');

let click0 = false;
if (followed) {
    click0 = true;
}

if (followBtn) {
    followBtn.addEventListener('click', async event => {
        if (click0) {
            click0 = false;
            followBtn.innerHTML = `follow`;

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
            followBtn.innerHTML = `unfollow`;

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
}