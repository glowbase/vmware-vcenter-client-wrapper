window.onload = () => {
    if (getStorage('token')) redirect('/');
};

document.getElementById('username').addEventListener('keyup', e => {
    if (e.key === 'Enter') login();
});

document.getElementById('password').addEventListener('keyup', e => {
    if (e.key === 'Enter') login();
});

async function login() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const error = document.getElementsByClassName('error')[0];
    const button = document.getElementsByTagName('BUTTON')[0].children;

    button[0].classList.add('hidden');
    button[1].classList.remove('hidden');

    if (!username.value || !password.value) {
        button[0].classList.remove('hidden');
        button[1].classList.add('hidden');

        return error.classList.remove('hidden');
    }
    
    error.classList.add('hidden');

    const creds = {
        username: username.value,
        password: password.value,
    };

    const err = await generateSessionToken(creds);

    if (err) {
        button[0].classList.remove('hidden');
        button[1].classList.add('hidden');

        error.children[1].innerText = err;
        return error.classList.remove('hidden');
    }

    redirect('/');
}