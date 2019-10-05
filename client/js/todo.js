function showCreateTodo() {
    $('#create-todo').modal('show')
    $('#create-todo').on('shown.bs.modal', function () {
        $('#create-todo-title').trigger('focus')
    })
}

function closeEmptyCreateTodo() {
    $('#create-todo').modal('hide')
    $('#create-todo-title').val('')
    $('#create-todo-description').val('')
    $('#create-todo-dueDate').val('')
}

function getQuotes() {
    ajax.get('/api/quotes')
        .then(({ data: { quote, author } }) => {
            $('.quotes').text(`${quote} - ${author}`)
        })
}

function createTodo() {
    Swal.fire({
        title: "Creating Todo",
        onOpen: () => Swal.showLoading()
    })

    ajax.post('/todos/', {
        title: $('#create-todo-title').val(),
        description: $('#create-todo-description').val(),
        dueDate: $('#create-todo-dueDate').val()
    })
        .then(({ data: { title } }) => {
            toastr.success(title, 'Success Create Todo')
            closeEmptyCreateTodo()
            refreshTodos()
        }).catch(({ response: { data: error } }) => {
            Swal.fire({
                type: "error",
                title: 'Fail Create Todo',
                html: error.join('<br/>'),
                showConfirmButton: true
            })
        });
}



function refreshTodos() {
    Swal.fire({
        title: "Fetching Todos",
        onOpen() {
            Swal.showLoading()
        }
    })

    ajax.get('/todos')
        .then(({ data }) => {
            $('#fill-todos').empty()
            if (!data.length) { $('#fill-todos').append(emptyTodo()) }
            else {
                data.forEach(el => $('#fill-todos').append(constructTodo(el)))
            }
            Swal.close()
        }).catch(({ response: { data: error } }) => {
            Swal.fire({
                type: 'error',
                title: 'Fail Fetching Todos',
                text: error,
                showConfirmButton: true
            })
        });
}



$('#create-todo-form').on('submit', (e) => {
    e.preventDefault()
    createTodo()
})
