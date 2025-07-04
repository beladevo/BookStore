using BookStore.Application.Services;
using BookStore.Core.Entities;
using BookStore.Core.Interfaces;
using FluentAssertions;
using FluentValidation;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace BookStore.Tests.Services
{
    public class BookServiceTests
    {
        private readonly Mock<IBookRepository> _repoMock;
        private readonly IMemoryCache _cache;
        private readonly Mock<ILogger<BookService>> _loggerMock;
        private readonly Mock<IValidator<Book>> _validatorMock;
        private readonly BookService _service;

        public BookServiceTests()
        {
            _repoMock = new Mock<IBookRepository>();
            _loggerMock = new Mock<ILogger<BookService>>();
            _validatorMock = new Mock<IValidator<Book>>();

            _cache = new MemoryCache(new MemoryCacheOptions());
            _service = new BookService(_repoMock.Object, _cache, _loggerMock.Object, _validatorMock.Object);
        }

        [Fact]
        public void GetAll_ShouldReturnAllBooks()
        {
            // Arrange
            var books = new List<Book>
            {
                new Book { Isbn = "123", Title = "Book 1", Authors = new List<string>{"A"}, Category="Cat", Year=2000, Price=10 },
                new Book { Isbn = "456", Title = "Book 2", Authors = new List<string>{"B"}, Category="Cat", Year=2001, Price=20 }
            };

            _repoMock.Setup(r => r.GetAll()).Returns(books);

            // Act
            var result = _service.GetAll();

            // Assert
            result.Should().HaveCount(2);
            result[0].Isbn.Should().Be("123");
        }

        [Fact]
        public void GetByIsbn_ShouldReturnBook_WhenExists()
        {
            var book = new Book { Isbn = "123", Title = "Test", Authors = new List<string> { "A" }, Category = "Cat", Year = 2000, Price = 10 };
            _repoMock.Setup(r => r.GetByIsbn("123")).Returns(book);

            var result = _service.GetByIsbn("123");

            result.Should().BeSameAs(book);
        }

        [Fact]
        public void GetByIsbn_ShouldThrow_WhenNotFound()
        {
            _repoMock.Setup(r => r.GetByIsbn("999")).Returns((Book?)null);

            Action act = () => _service.GetByIsbn("999");

            act.Should().Throw<KeyNotFoundException>();
        }

        [Fact]
        public void Add_ShouldAddBook_WhenValid()
        {
            var book = new Book { Isbn = "789", Title = "New Book", Authors = new List<string> { "A" }, Category = "Cat", Year = 2020, Price = 10 };

            _repoMock.Setup(r => r.GetByIsbn("789")).Returns((Book?)null);

            _service.Add(book);

            _repoMock.Verify(r => r.Add(book), Times.Once);
        }

        [Fact]
        public void Add_ShouldThrow_WhenDuplicate()
        {
            var book = new Book { Isbn = "123", Title = "Existing", Authors = new List<string> { "A" }, Category = "Cat", Year = 2020, Price = 10 };

            _repoMock.Setup(r => r.GetByIsbn("123")).Returns(book);

            Action act = () => _service.Add(book);

            act.Should().Throw<InvalidOperationException>();
        }

        [Fact]
        public void Update_ShouldUpdateBook_WhenExists()
        {
            var book = new Book { Isbn = "123", Title = "Updated", Authors = new List<string> { "A" }, Category = "Cat", Year = 2020, Price = 10 };

            _repoMock.Setup(r => r.GetByIsbn("123")).Returns(book);

            _service.Update("123", book);

            _repoMock.Verify(r => r.Update("123", book), Times.Once);
        }

        [Fact]
        public void Update_ShouldThrow_WhenNotFound()
        {
            var book = new Book { Isbn = "999", Title = "Missing", Authors = new List<string> { "A" }, Category = "Cat", Year = 2020, Price = 10 };

            _repoMock.Setup(r => r.GetByIsbn("999")).Returns((Book?)null);

            Action act = () => _service.Update("999", book);

            act.Should().Throw<KeyNotFoundException>();
        }

        [Fact]
        public void Delete_ShouldDeleteBook_WhenExists()
        {
            var book = new Book { Isbn = "123", Title = "ToDelete", Authors = new List<string> { "A" }, Category = "Cat", Year = 2020, Price = 10 };

            _repoMock.Setup(r => r.GetByIsbn("123")).Returns(book);

            _service.Delete("123");

            _repoMock.Verify(r => r.Delete("123"), Times.Once);
        }

        [Fact]
        public void Delete_ShouldThrow_WhenNotFound()
        {
            _repoMock.Setup(r => r.GetByIsbn("999")).Returns((Book?)null);

            Action act = () => _service.Delete("999");

            act.Should().Throw<KeyNotFoundException>();
        }

        [Fact]
        public void GetDistinctCategories_ShouldReturnCachedCategories()
        {
            var books = new List<Book>
            {
                new Book { Isbn = "1", Title = "Book1", Authors = new List<string>{"A"}, Category="Fiction", Year=2000, Price=10 },
                new Book { Isbn = "2", Title = "Book2", Authors = new List<string>{"A"}, Category="Non-Fiction", Year=2001, Price=20 },
                new Book { Isbn = "3", Title = "Book3", Authors = new List<string>{"A"}, Category="Fiction", Year=2002, Price=30 },
            };

            _repoMock.Setup(r => r.GetAll()).Returns(books);

            var categories = _service.GetDistinctCategories();

            categories.Should().BeEquivalentTo(new[] { "Fiction", "Non-Fiction" });
        }
    }
}
