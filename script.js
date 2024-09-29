let form = document.getElementById('book-form');
let booklist = document.querySelector('#book-list');


class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


class UI {
    static addToBooklist(book) {
        let list = document.querySelector('#book-list');
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>`;
        list.appendChild(row);
    }

    static clearText() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static showAlert(message, className) {
        let div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static deleteFromBook(target) {
        if (target.hasAttribute('href')) {
            target.parentElement.parentElement.remove();
            const isbn = target.parentElement.previousElementSibling.textContent.trim();
            Store.removeBook(isbn);
            UI.showAlert('Book Removed', 'success');
        }
    }
}


class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        let books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(book => UI.addToBooklist(book));
    }

    static removeBook(isbn) {
        let books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}


document.addEventListener('DOMContentLoaded', Store.displayBooks);


form.addEventListener('submit', function (e) {
    const title = document.querySelector('#title').value,
        author = document.querySelector('#author').value,
        isbn = document.querySelector('#isbn').value;

    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('All fields are required!', 'error');
    } else {
        const book = new Book(title, author, isbn);
        UI.addToBooklist(book);
        UI.clearText();
        UI.showAlert('Book Added!', 'success');
        Store.addBook(book);
    }

    e.preventDefault();
});


booklist.addEventListener('click', function (e) {
    UI.deleteFromBook(e.target);
    e.preventDefault();
});
