// Keys for localStorage
const STORAGE_KEY = "BOOKSHELF_APPS";
const books = [];
let bookID = 0;

// DOM elements
const bookForm = document.getElementById("bookForm");
const bookFormTitle = document.getElementById("bookFormTitle");
const bookFormAuthor = document.getElementById("bookFormAuthor");
const bookFormYear = document.getElementById("bookFormYear");
const bookFormIsComplete = document.getElementById("bookFormIsComplete");

const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
const searchBook = document.getElementById("searchBook");
const searchBookTitle = document.getElementById("searchBookTitle");

// Check if localStorage is supported
function isStorageExist() {
  return typeof Storage !== "undefined";
}

// Save book data to localStorage
function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

// Load book data from localStorage
function loadData() {
  if (isStorageExist()) {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data !== null) {
      const parsedData = JSON.parse(data);
      for (const book of parsedData) {
        books.push(book);
      }
    }
  }
}

// Create book object
function createBookObject(title, author, year, isComplete) {
  return {
    id: ++bookID,
    title,
    author,
    year: Number(year), // Convert year to number type
    isComplete
  };
}

// Add new book
function addBook() {
  const title = bookFormTitle.value;
  const author = bookFormAuthor.value;
  const year = Number(bookFormYear.value); // Convert to number using Number()
  const isComplete = bookFormIsComplete.checked;

  const newBook = createBookObject(title, author, year, isComplete);
  books.push(newBook);
  saveData();
  renderBooks();
}

// Render all books
function renderBooks() {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of books) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  }
}

// Create HTML structure for book item
function createBookElement(book) {
  const bookItem = document.createElement("div");
  bookItem.classList.add("book_item");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");

  const titleElement = document.createElement("h3");
  titleElement.textContent = book.title;
  titleElement.setAttribute("data-testid", "bookItemTitle");

  const authorElement = document.createElement("p");
  authorElement.textContent = `Penulis: ${book.author}`;
  authorElement.setAttribute("data-testid", "bookItemAuthor");

  const yearElement = document.createElement("p");
  yearElement.textContent = `Tahun: ${book.year}`;
  yearElement.setAttribute("data-testid", "bookItemYear");

  const actionContainer = document.createElement("div");

  const isCompleteButton = document.createElement("button");
  isCompleteButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
  isCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  isCompleteButton.addEventListener("click", () => toggleBookStatus(book.id));

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus Buku";
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.addEventListener("click", () => deleteBook(book.id));

  actionContainer.appendChild(isCompleteButton);
  actionContainer.appendChild(deleteButton);

  bookItem.appendChild(titleElement);
  bookItem.appendChild(authorElement);
  bookItem.appendChild(yearElement);
  bookItem.appendChild(actionContainer);

  return bookItem;
}

// Toggle book status between "complete" and "incomplete"
function toggleBookStatus(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveData();
    renderBooks();
  }
}

// Delete a book
function deleteBook(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    saveData();
    renderBooks();
  }
}

// Search books by title
function searchBooks() {
  const searchQuery = searchBookTitle.value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery)
  );
  
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of filteredBooks) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  }
}

// Event Listeners
bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addBook();
  bookForm.reset();
});

searchBook.addEventListener("submit", (e) => {
  e.preventDefault();
  searchBooks();
});

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  renderBooks();
});
