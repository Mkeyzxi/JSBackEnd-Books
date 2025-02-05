const {nanoid} = require('nanoid');
const books = [];

const addBook = (request, h) => {
	const {name, year, author, summary, publisher, pageCount, readPage, reading} =
		request.payload;

	if (!name) {
		return h
			.response({
				status: 'fail',
				message: 'Gagal menambahkan buku. Mohon isi nama buku',
			})
			.code(400);
	}

	if (readPage > pageCount) {
		return h
			.response({
				status: 'fail',
				message:
					'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
			})
			.code(400);
	}

	const id = nanoid(16);
	const finished = pageCount === readPage;
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;

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
		updatedAt,
	};

	books.push(newBook);

	return h
		.response({
			status: 'success',
			message: 'Buku berhasil ditambahkan',
			data: {
				bookId: id,
			},
		})
		.code(201);
};

const getAllBooks = (request, h) => {
	const {name, reading, finished} = request.query;
	let filteredBooks = books;

	if (name) {
		filteredBooks = filteredBooks.filter((book) =>
			book.name.toLowerCase().includes(name.toLowerCase()),
		);
	}

	if (reading !== undefined) {
		filteredBooks = filteredBooks.filter(
			(book) => book.reading === Boolean(Number(reading)),
		);
	}

	if (finished !== undefined) {
		filteredBooks = filteredBooks.filter(
			(book) => book.finished === Boolean(Number(finished)),
		);
	}

	return h
		.response({
			status: 'success',
			data: {
				books: filteredBooks.map((book) => ({
					id: book.id,
					name: book.name,
					publisher: book.publisher,
				})),
			},
		})
		.code(200);
};

const getBookById = (request, h) => {
	const {bookId} = request.params;
	const book = books.find((b) => b.id === bookId);

	if (!book) {
		return h
			.response({
				status: 'fail',
				message: 'Buku tidak ditemukan',
			})
			.code(404);
	}

	return h
		.response({
			status: 'success',
			data: {
				book,
			},
		})
		.code(200);
};

const updateBook = (request, h) => {
	const {bookId} = request.params;
	const {name, year, author, summary, publisher, pageCount, readPage, reading} =
		request.payload;

	if (!name) {
		return h
			.response({
				status: 'fail',
				message: 'Gagal memperbarui buku. Mohon isi nama buku',
			})
			.code(400);
	}

	if (readPage > pageCount) {
		return h
			.response({
				status: 'fail',
				message:
					'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
			})
			.code(400);
	}

	const bookIndex = books.findIndex((b) => b.id === bookId);

	if (bookIndex === -1) {
		return h
			.response({
				status: 'fail',
				message: 'Gagal memperbarui buku. Id tidak ditemukan',
			})
			.code(404);
	}

	const updatedAt = new Date().toISOString();

	const updatedBook = {
		...books[bookIndex],
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
		updatedAt,
		finished: pageCount === readPage,
	};

	books[bookIndex] = updatedBook;

	return h
		.response({
			status: 'success',
			message: 'Buku berhasil diperbarui',
		})
		.code(200);
};

const deleteBook = (request, h) => {
	const {bookId} = request.params;
	const bookIndex = books.findIndex((b) => b.id === bookId);

	if (bookIndex === -1) {
		return h
			.response({
				status: 'fail',
				message: 'Buku gagal dihapus. Id tidak ditemukan',
			})
			.code(404);
	}

	books.splice(bookIndex, 1);

	return h
		.response({
			status: 'success',
			message: 'Buku berhasil dihapus',
		})
		.code(200);
};

module.exports = {addBook, getAllBooks, getBookById, updateBook, deleteBook};
