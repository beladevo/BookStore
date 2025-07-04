using BookStore.Core.Entities;
using BookStore.Data.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Xunit;

namespace BookStore.Tests.Repositories
{
    public class XmlBookRepositoryTests : IDisposable
    {
        private readonly string _testFilePath;
        private readonly XmlBookRepository _repository;

        public XmlBookRepositoryTests()
        {
            _testFilePath = Path.GetTempFileName();
            File.WriteAllText(_testFilePath, "<?xml version=\"1.0\" encoding=\"utf-8\"?><books></books>");
            _repository = new XmlBookRepository(_testFilePath);
        }

        [Fact]
        public void Add_And_GetAll_Works()
        {
            var book = new Book
            {
                Isbn = "123",
                Title = "Test Book",
                Authors = new List<string> { "Author" },
                Category = "Test",
                Year = 2020,
                Price = 10.5m
            };
            _repository.Add(book);
            var all = _repository.GetAll();
            Assert.Single(all);
            Assert.Equal("123", all[0].Isbn);
        }

        [Fact]
        public void Update_Works()
        {
            var book = new Book { Isbn = "123", Title = "A", Authors = new List<string> { "A" }, Category = "C", Year = 2020, Price = 1 };
            _repository.Add(book);
            book.Title = "B";
            _repository.Update("123", book);
            var updated = _repository.GetAll().First();
            Assert.Equal("B", updated.Title);
        }

        [Fact]
        public void Delete_Works()
        {
            var book = new Book { Isbn = "123", Title = "A", Authors = new List<string> { "A" }, Category = "C", Year = 2020, Price = 1 };
            _repository.Add(book);
            _repository.Delete("123");
            Assert.Empty(_repository.GetAll());
        }

        [Fact]
        public void GetAll_Throws_OnCorruptXml()
        {
            File.WriteAllText(_testFilePath, "<books><bad></books>");
            Assert.Throws<InvalidOperationException>(() => _repository.GetAll());
        }

        public void Dispose()
        {
            if (File.Exists(_testFilePath))
                File.Delete(_testFilePath);
        }
    }
}
