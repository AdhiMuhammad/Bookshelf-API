import { nanoid } from 'nanoid'
import books from './books.js'

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  // nama belum di input
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400)
  }

  // gagal mengedit karena readpage (halaman yang sedang dibaca) lebih dari total halaman buku
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  // init book
  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt
  }

  // menambahkan buku
  books.push(newBook)

  // cek apa buku sudah ditambahkan
  const isSuccess = books.filter((book) => book.id === id).length === 1
  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    }).code(201)
  }

  // buku gagal ditambahkan
  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  }).code(500)
}

const getBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query

  let filteredBooks = books

  // fitur tambahan
  // 1. menampilkan semua buku yang memiliki elemen nama yang sama
  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase()) !== false)
  }

  // 2. menampilkan semua buku yang sedang dibaca
  if (reading) {
    filteredBooks = filteredBooks.filter((book) =>
      Number(book.reading) === Number(reading))
  }

  // 3. menampillkan semua buku yang sudah dibaca
  if (finished) {
    filteredBooks = filteredBooks.filter((book) =>
      Number(book.finished) === Number(finished))
  }

  // menampilkan semua buku
  return h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  })
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params
  const book = books.find((book) => book.id === id)

  if (book) {
    return h.response({
      status: 'success',
      data: { book }
    })
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404)
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  // gagal mengedit karena nama tidak ada
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400)
  }

  // gagal mengedit karena readpage (halaman yang sedang dibaca) lebih dari total halaman buku
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  // mencari buku berdasaran id
  const index = books.findIndex((book) => book.id === id)

  // proses update buku
  if (index !== -1) {
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
      updatedAt: new Date().toISOString()
    }

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
  }

  // gagal update karena id tidak ada
  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  }).code(404)
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  // mencari buku
  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
    // perintah menghapus buku
    books.splice(index, 1)

    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
  }

  // buku gagal dihapus karena id tidak ada
  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  }).code(404)
}

export {
  addBookHandler,
  getBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
