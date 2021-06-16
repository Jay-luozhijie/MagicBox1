const followBtn = document.querySelector(".followBtn");
const followed = document.querySelector('#followed');

let clicked = false;
if (followed) {
    clicked = true;
}

followBtn.addEventListener("click", () => {
    if (!clicked) {
        clicked = true;
        followBtn.textContent = 'Unfollowed';
    } else {
        clicked = false;
        followBtn.textContent = 'Followed';
    }
});