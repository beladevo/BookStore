using BookStore.API.Controllers;
using BookStore.Core.Entities;
using BookStore.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using Xunit;

namespace BookStore.Tests.Controllers
{
    public class BooksControllerTests
    {
        [Fact]
        public void GetByIsbn_ReturnsNotFound_WhenBookDoesNotExist()
        {
            var service = new Mock<IBookService>();
            service.Setup(s => s.GetByIsbn(It.IsAny<string>())).Throws(new KeyNotFoundException("not found"));
            var controller = new BooksController(service.Object);
            var result = controller.GetByIsbn("not-exist");
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public void GetByIsbn_ReturnsBook_WhenExists()
        {
            var service = new Mock<IBookService>();
            service.Setup(s => s.GetByIsbn("123")).Returns(new Book { Isbn = "123", Title = "T", Authors = new List<string> { "A" }, Category = "C", Year = 2020, Price = 1 });
            var controller = new BooksController(service.Object);
            var result = controller.GetByIsbn("123");
            Assert.IsType<OkObjectResult>(result.Result);
        }
    }
}
