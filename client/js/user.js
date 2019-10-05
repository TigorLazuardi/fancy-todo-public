function showLogin() {
    $('#login-page').show()
    $('#content').hide()
    $('#fill-todos').empty()
    $('#fill-projects').empty()
}

function showContent() {
    $('#login-page').hide()
    $('#content').show()
    $('#user-control').text(localStorage.getItem('username'))
    createTodo()
}

function checkLogin() {
    if (localStorage.getItem('token')) {
        showContent()
    } else {
        showLogin()
    }
}

function showLoginForm() {
    $('#register').hide()
    $('#login').show()
    $('#tab-login').addClass('active')
    $('#tab-register').removeClass('active')

}

function showRegisterForm() {
    $('#login').hide()
    $('#register').show()
    $('#tab-register').addClass('active')
    $('#tab-login').removeClass('active')
}

function login() {
    Swal.fire({
        title: "Logging in",
        onOpen() {
            Swal.showLoading()
        }
    })
    ajax.post('/users/login', {
        identity: $('#identity').val(),
        password: $('#login-password').val()
    })
        .then(({ data }) => {
            localStorage.setItem('token', data.token)
            localStorage.setItem('email', data.email)
            localStorage.setItem('username', data.username)
            Swal.close()
            checkLogin()
        }).catch(({ response: { data: error } }) => Swal.fire({
            type: 'error',
            title: "Fail logging in",
            text: error
        }));
}

$('#login-form').on('submit', e => {
    e.preventDefault()
    login()
})

function destroyCredentials() {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('username')
    checkLogin()
}

function logout() {
    Swal.fire({
        title: "Logging out",
        onOpen() {
            Swal.showLoading()
        }
    })
    setTimeout(() => {
        destroyCredentials()
        Swal.close()
    }, 500);
}

function verifyUser() {
    if (localStorage.getItem('token')) {
        Swal.fire({
            title: "Verifying User",
            onOpen() {
                Swal.showLoading()
            }
        })
        setTimeout(() => {
            ajax.get('/users/verify')
                .then(() => {
                    Swal.fire({
                        type: 'success',
                        title: 'User Verified',
                        timer: 800,
                        showConfirmButton: false
                    })
                    showContent()
                }).catch(({ response: { data: error } }) => {
                    Swal.fire({
                        type: 'error',
                        title: 'Failed Verifying User',
                        text: error
                    })
                    showLogin()
                    destroyCredentials()
                });

        }, 500);
    } else {
        destroyCredentials()
    }
}

function register() {
    Swal.fire({
        title: "Registering User",
        onOpen() {
            Swal.showLoading()
        }
    })
    ajax.post('/users/register', {
        username: $('#register-username').val(),
        email: $('#register-email').val(),
        password: $('#register-password').val()
    })
        .then(({ data: { email, username, token } }) => {
            localStorage.setItem('token', token)
            localStorage.setItem('email', email)
            localStorage.setItem('username', username)
            showContent()
            Swal.close()
        }).catch(({ response: { data: error } }) => {
            Swal.fire({
                type: 'error',
                title: 'Register Failed',
                html: error.join('<br/>')
            })
        });
}

$('#register').on('submit', (e) => {
    e.preventDefault()
    register()
})