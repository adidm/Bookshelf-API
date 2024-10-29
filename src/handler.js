const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  
  if (name == null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  
  books.push(newBooks);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
        books,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  
  if (name) {
    const filteredNameData = books.filter((d) => d.name.toLowerCase().includes(name.toLowerCase()));
    const responseNameData = filteredNameData.map((book) => {
      const result = {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };
      return result;
    });
    
    const response = h.response({
      status: 'success',
      data: {
        books: responseNameData,
      },
    });
    
    response.code(200);
    return response;
  }
  
  if (reading) {
    const filteredReadingData = books.filter((d) => Number(d.reading) === Number(reading));
    const responseReadingData = filteredReadingData.map((book) => {
      const result = {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };
      return result;
    });
    
    const response = h.response({
      status: 'success',
      data: {
        books: responseReadingData,
      },
    });
    
    response.code(200);
    return response;
  }
  
  if (finished) {
    const filteredFinishedData = books.filter((d) => Number(d.finished) === Number(finished));
    const responseFinishedData = filteredFinishedData.map((book) => {
      const result = {
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      };
      return result;
    });
    
    const response = h.response({
      status: 'success',
      data: {
        books: responseFinishedData,
      },
    });
    
    response.code(200);
    return response;
  }
  
  const booksData = books.map((book) => {
    const data = {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
    return data;
  });

  const response = h.response({
    status: 'success',
    data: {
      books: booksData,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  
  if (books[index] !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book: books[index],
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name == null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (books[index] === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  if (books[index] !== -1) {
    const updatedAt = new Date().toISOString();
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku',
  });
  response.code(500);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (books[index] === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(index, 1);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};