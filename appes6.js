// Book Constructor
class Book {
    constructor(title, author, isbn){
        this.author = author;
        this.isbn = isbn;
        this.title = title;
    }

    static validateBook(book){
        const books = Store.getBooks();
        const ui = new UI();
        if (book.title === ' ' || book.author === '' || book.isbn === ''){
            ui.showAlert("Please fill in all fields.", 'error');
            return false;
        }
        else if (books != []){
            for (let i = 0; i < books.length; i++){
                if (books[i].isbn === book.isbn){
                    ui.showAlert("ISBN is already used.", 'error');
                    return false;
                }
            }
        } 
        return true;

    }
}

// UI Constructor
class UI {
    addBookToList(book){
        const list = document.getElementById('book-list');
    
        const row = document.createElement('tr');
        row.innerHTML = 
        `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;
    
        list.appendChild(row);
    }
    
    showAlert(message, className){
        
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form);
        
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }
    
    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    clearFields(){
        document.getElementById('title').value = "";
        document.getElementById('author').value = "";
        document.getElementById('isbn').value = "";
    }
}

// Local Storage Class
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){ 
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(book => {
            const ui = new UI;
            ui.addBookToList(book);
        });
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();
        // console.log(isbn);
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index,1)
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Submit Book
document.getElementById('book-form').addEventListener('submit', 
    function(e){
        const title = document.getElementById('title').value,
              author = document.getElementById('author').value,
              isbn = document.getElementById('isbn').value;

        const book = new Book(title, author, isbn);
        const ui = new UI();

        if (Book.validateBook(book)){
            //add book to list
            ui.addBookToList(book);
            Store.addBook(book);
            ui.showAlert("Book Added!", 'success')
            ui.clearFields();
        }

        e.preventDefault();
    });

// Remove Book
document.getElementById('book-list').addEventListener('click', 
    function(e){
        // console.log(e);
        const target = e.target;
        const ui = new UI();
        if (target.className === 'delete'){
            Store.removeBook(target.parentElement.previousElementSibling.textContent);
            ui.deleteBook(target);
            ui.showAlert("Book Removed.", 'success');
        }

        e.preventDefault();
    });