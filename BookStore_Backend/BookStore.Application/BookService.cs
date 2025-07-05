using BookStore.Core.Entities;
using BookStore.Core.Exceptions;
using BookStore.Core.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using BookStore.Application.Validators;
using FluentValidation;

namespace BookStore.Application.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _repository;
        private readonly IMemoryCache _cache;
        private readonly ILogger<BookService> _logger;
        private readonly IValidator<Book> _bookValidator;

        public BookService(IBookRepository repository, IMemoryCache cache, ILogger<BookService> logger)
            : this(repository, cache, logger, new BookValidator())
        {
        }

        public BookService(IBookRepository repository, IMemoryCache cache, ILogger<BookService> logger, IValidator<Book> bookValidator)
        {
            _repository = repository;
            _cache = cache;
            _logger = logger;
            _bookValidator = bookValidator;
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
            return _cache.GetOrCreate("categories", entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);

                var books = _repository.GetAll();
                return books
                    .Where(b => !string.IsNullOrWhiteSpace(b.Category))
                    .GroupBy(b => b.Category, StringComparer.OrdinalIgnoreCase)
                    .OrderByDescending(g => g.Count())
                    .Select(g => g.Key)
                    .ToList();
            }) ?? new List<string>();
        }

        public BookStatsDto GetStats()
        {
            var stats = _cache.GetOrCreate("book_stats", entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);

                var books = _repository.GetAll();
                return new BookStatsDto
                {
                    TotalBooks = books.Count,
                    TotalCategories = books
                        .Select(b => b.Category)
                        .Where(c => !string.IsNullOrWhiteSpace(c))
                        .Distinct(StringComparer.OrdinalIgnoreCase)
                        .Count(),
                    TotalAuthors = books
                        .SelectMany(b => b.Authors ?? Enumerable.Empty<string>())
                        .Distinct(StringComparer.OrdinalIgnoreCase)
                        .Count()
                };
            });

            if (stats == null)
                throw new InvalidOperationException("Failed to create BookStatsDto.");

            return stats;
        }

        public void Add(Book book)
        {
            _logger.LogInformation("Adding book with ISBN: {Isbn}", book.Isbn);
            ValidateBook(book);
            var existing = _repository.GetByIsbn(book.Isbn);
            if (existing != null)
            {
                _logger.LogWarning("Attempted to add duplicate book with ISBN: {Isbn}", book.Isbn);
                throw new InvalidOperationException($"Book with ISBN '{book.Isbn}' already exists.");
            }
            _repository.Add(book);
            _logger.LogInformation("Successfully added book with ISBN: {Isbn}", book.Isbn);
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
            var result = _bookValidator.Validate(book);
            if (!result.IsValid)
            {
                var errorMsg = string.Join("; ", result.Errors.Select(e => e.ErrorMessage));
                _logger.LogError("Book validation failed: {ErrorMsg}", errorMsg);
                throw new BusinessLogicException(errorMsg);
            }
        }
        private void InvalidateCaches()
        {
            _cache.Remove("categories");
            _cache.Remove("book_stats");
        }
        private string EscapeText(string text)
        {
            return System.Security.SecurityElement.Escape(text);
        }
    }
    #endregion
}
