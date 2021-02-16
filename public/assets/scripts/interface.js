const toggles = document.getElementsByClassName('toggle-nav');
const nav = document.getElementsByClassName('left-nav')[0];

Array.prototype.slice.call(toggles).forEach(toggle => {
    toggle.addEventListener('click', () => {
        nav.classList.toggle('hide-nav');
    });
});

window.addEventListener('resize', () => {
    checkMobile();
});

checkMobile();

function checkMobile() {
    if (isMobile()) {
        nav.classList.toggle('hide-nav');
        document.body.classList.toggle('mobile');
    }
}