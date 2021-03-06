function showCreateTodo() {
    $('#create-todo').modal('show')
    $('#create-todo').on('shown.bs.modal', function () {
        $('#create-todo-title').trigger('focus')
    })
}

function showEditTodo(id, title, description, dueDate) {
    const date = new Date(dueDate).toISOString().substr(0, 10)

    $('#todo-id').text(id)
    $('#edit-todo-title').val(title)
    $('#edit-todo-description').val(description)
    $('#edit-todo-dueDate').val(date)
    $('#edit-todo').modal('show')
    $('#edit-todo').on('shown.bs.modal', function () {
        $('#edit-todo-title').trigger('focus')
    })
}

$('#edit-todo-form').on('submit', (e) => {
    e.preventDefault()
    let id = $('#todo-id').text()
    ajax.put(`todos/${id}`, {
        title: $('#edit-todo-title').val(),
        description: $('#edit-todo-description').val(),
        dueDate: $('#edit-todo-dueDate').val()
    })
        .then(({ data: { title } }) => {
            toastr.success(title, 'Success Edit Todo')
            closeEmptyEditTodo()
            refreshTodos()
        }).catch(({ response: { date: error } }) => {
            Swal.fire({
                type: 'error',
                title: 'Fail update todo',
                html: error.join('<br/>')
            })
        });
})

function closeEmptyEditTodo() {
    $('#edit-todo').modal('hide')
    $('#todo-id').text('')
    $('#edit-todo-title').val('')
    $('#edit-todo-description').val('')
    $('#edit-todo-dueDate').val('')
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

function updateStatus(id, cond) {
    ajax.patch(`/todos/${id}`, { status: cond })
        .then(({ data: { title } }) => {
            if (cond) {
                toastr.success(`${title} has been marked completed.`)
            } else {
                toastr.info(`${title} completed status removed.`)
            }
            refreshTodos()
        }).catch(({ response: { status, data: error } }) => {
            toastr.error(error, `Error Code: ${status}`)
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
