using BookStore.Core.Entities;
using BookStore.Core.Exceptions;
using BookStore.Core.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace BookStore.Application.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _repository;
        private readonly IMemoryCache _cache;
        public BookService(IBookRepository repository, IMemoryCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public List<Book> GetAll()
        {
            return _repository.GetAll();
        }

        public (int totalCount, List<Book> items) GetPaged(
            int pageNumber, int pageSize, string? search, string? category)
        {
            var books = _repository.GetAll();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLowerInvariant();
                books = books
                    .Where(b =>
                        b.Title.ToLowerInvariant().Contains(search) ||
                        b.Isbn.ToLowerInvariant().Contains(search) ||
                        string.Join(", ", b.Authors).ToLowerInvariant().Contains(search))
                    .ToList();
            }

            if (!string.IsNullOrWhiteSpace(category) && category != "All")
            {
                books = books
                    .Where(b => b.Category.Equals(category, StringComparison.OrdinalIgnoreCase))
                    .ToList();
            }

            var totalCount = books.Count;

            var paged = books
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return (totalCount, paged);
        }

        public Book GetByIsbn(string isbn)
        {
            var book = _repository.GetByIsbn(isbn);
            if (book == null)
                throw new KeyNotFoundException($"Book with ISBN '{isbn}' not found.");
            return book;
        }

        public List<string> GetDistinctCategories()
        {
            var categories = _cache.GetOrCreate("categories", entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);
                var books = _repository.GetAll() ?? new List<Book>();
                return books
                    .Where(b => !string.IsNullOrWhiteSpace(b.Category))
                    .GroupBy(b => b.Category, StringComparer.OrdinalIgnoreCase)
                    .OrderByDescending(g => g.Count())
                    .Select(g => g.Key)
                    .ToList();
            });

            return categories ?? new List<string>();
        }

        public void Add(Book book)
        {
            ValidateBook(book);

            var existing = _repository.GetByIsbn(book.Isbn);
            if (existing != null)
                throw new InvalidOperationException($"Book with ISBN '{book.Isbn}' already exists.");

            _repository.Add(book);
        }

        public void Update(string isbn, Book book)
        {
            ValidateBook(book);

            var existing = _repository.GetByIsbn(isbn);
            if (existing == null)
                throw new KeyNotFoundException($"Book with ISBN '{isbn}' not found.");

            _repository.Update(isbn, book);
        }

        public void Delete(string isbn)
        {
            var existing = _repository.GetByIsbn(isbn);
            if (existing == null)
                throw new KeyNotFoundException($"Book with ISBN '{isbn}' not found.");

            _repository.Delete(isbn);
        }
        #region Private Methods
        private void ValidateBook(Book book)
        {
            if (book == null)
                throw new BusinessLogicException("Book cannot be null.");

            if (string.IsNullOrWhiteSpace(book.Isbn))
                throw new BusinessLogicException("ISBN is required.");

            if (string.IsNullOrWhiteSpace(book.Title))
                throw new BusinessLogicException("Title is required.");

            if (book.Authors == null || book.Authors.Count == 0 || book.Authors.Any(a => string.IsNullOrWhiteSpace(a)))
                throw new BusinessLogicException("At least one author is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(book.Category))
                throw new BusinessLogicException("Category is required.");

            if (book.Year < 1000 || book.Year > DateTime.UtcNow.Year + 1)
                throw new BusinessLogicException($"Year '{book.Year}' is invalid.");

            if (book.Price < 0)
                throw new BusinessLogicException("Price cannot be negative.");
        }
    }
    #endregion
}
