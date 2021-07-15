const collectBtn = document.querySelector(".collectBtn");
let collectIcon = document.querySelector("#collectIcon"),
    collectCount = document.querySelector("#collectCount");
const collected = document.querySelector('#collect');

let click = false;
if (collected) {
    click = true;
}

if (collectBtn) {
    collectBtn.addEventListener("click", async event => {
        if (!click) {
            click = true;
            collectIcon.innerHTML = `<svg
    xmlns="http://www.w3.org/2000/svg" width="16" height="16"
    fill="currentColor" class="bi bi-bookmark-dash-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd"
        d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zM6 6a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6z" />
</svg>`;
            collectCount.textContent++;

            const data = { collectBtn };
            const options = {
                method: 'POST',
                Headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            await fetch('/collect', options);

        } else {
            click = false;
            collectIcon.innerHTML = `<svg
        xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        fill="currentColor" class="bi bi-bookmark-plus" viewBox="0 0 16 16">
        <path
            d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
        <path
            d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z" />
    </svg>`;
            collectCount.textContent--;

            const data = { collectBtn };
            const options = {
                method: 'POST',
                Headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            await fetch('/uncollect', options);
        }
    });
}