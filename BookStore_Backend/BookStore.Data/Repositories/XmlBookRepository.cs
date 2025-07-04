using BookStore.Core.Entities;
using BookStore.Core.Interfaces;
using System.Xml;
using System.Xml.Linq;

namespace BookStore.Data.Repositories
{
    public class XmlBookRepository : IBookRepository
    {
        private readonly string _filePath;
        private readonly object _lockObj = new();

        public XmlBookRepository(string filePath)
        {
            _filePath = filePath;
            EnsureXmlFileExists();
        }

        public List<Book> GetAll()
        {
            try
            {
                EnsureXmlFileExists();
                var doc = XDocument.Load(_filePath);
                return doc.Root!
                    .Elements("book")
                    .Select(x => new Book
                    {
                        Isbn = x.Element("isbn")!.Value,
                        Title = x.Element("title")!.Value,
                        Authors = x.Elements("author").Select(a => a.Value).ToList(),
                        Category = x.Attribute("category")?.Value ?? "",
                        Year = int.Parse(x.Element("year")!.Value),
                        Price = decimal.Parse(x.Element("price")!.Value)
                    })
                    .ToList();
            }
            catch (XmlException ex)
            {
                throw new InvalidOperationException("XML file is corrupted or malformed.", ex);
            }
        }

        public Book? GetByIsbn(string isbn)
        {
            try
            {
                return GetAll().FirstOrDefault(b => b.Isbn == isbn);
            }
            catch (InvalidOperationException ex) when (ex.InnerException is XmlException)
            {
                throw;
            }
        }

        public void Add(Book book)
        {
            lock (_lockObj)
            {
                try
                {
                    EnsureXmlFileExists();
                    var doc = XDocument.Load(_filePath);

                    var newBook = new XElement("book",
                        new XAttribute("category", EscapeXml(book.Category)),
                        new XElement("isbn", EscapeXml(book.Isbn)),
                        new XElement("title", EscapeXml(book.Title)),
                        book.Authors.Select(a => new XElement("author", EscapeXml(a))),
                        new XElement("year", book.Year),
                        new XElement("price", book.Price)
                    );

                    doc.Root!.Add(newBook);
                    doc.Save(_filePath);
                }
                catch (XmlException ex)
                {
                    throw new InvalidOperationException("XML file is corrupted or malformed.", ex);
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException("An error occurred while adding the book.", ex);
                }
            }
        }

        public void Update(string isbn, Book book)
        {
            lock (_lockObj)
            {
                try
                {
                    EnsureXmlFileExists();
                    var doc = XDocument.Load(_filePath);
                    var bookElement = doc.Root!.Elements("book")
                        .FirstOrDefault(b => b.Element("isbn")!.Value == isbn);

                    if (bookElement == null)
                        throw new InvalidOperationException($"Book with ISBN {isbn} not found.");

                    bookElement.SetAttributeValue("category", EscapeXml(book.Category));
                    bookElement.Element("title")!.Value = EscapeXml(book.Title);
                    bookElement.Elements("author").Remove();
                    foreach (var author in book.Authors)
                        bookElement.Add(new XElement("author", EscapeXml(author)));
                    bookElement.Element("year")!.Value = book.Year.ToString();
                    bookElement.Element("price")!.Value = book.Price.ToString();

                    doc.Save(_filePath);
                }
                catch (XmlException ex)
                {
                    throw new InvalidOperationException("XML file is corrupted or malformed.", ex);
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException("An error occurred while updating the book.", ex);
                }
            }
        }

        public void Delete(string isbn)
        {
            lock (_lockObj)
            {
                try
                {
                    EnsureXmlFileExists();
                    var doc = XDocument.Load(_filePath);
                    var bookElement = doc.Root!.Elements("book")
                        .FirstOrDefault(b => b.Element("isbn")!.Value == isbn);

                    if (bookElement == null)
                        throw new InvalidOperationException($"Book with ISBN {isbn} not found.");

                    bookElement.Remove();
                    doc.Save(_filePath);
                }
                catch (XmlException ex)
                {
                    throw new InvalidOperationException("XML file is corrupted or malformed.", ex);
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException("An error occurred while trying delete the book.", ex);
                }
            }
        }

        private void EnsureXmlFileExists()
        {
            if (!File.Exists(_filePath))
            {
                var directory = Path.GetDirectoryName(_filePath);
                if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
                    Directory.CreateDirectory(directory);

                var doc = new XDocument(new XElement("books"));
                doc.Save(_filePath);
            }
        }

        private static string EscapeXml(string value)
        {
            return System.Security.SecurityElement.Escape(value);
        }
    }
}