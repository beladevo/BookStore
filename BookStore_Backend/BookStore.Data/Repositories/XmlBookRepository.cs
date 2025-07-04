using BookStore.Core.Entities;
using BookStore.Core.Interfaces;
using System.Xml.Linq;

public class XmlBookRepository : IBookRepository
{
    private readonly string _filePath;
    private readonly object _lockObj = new();

    public XmlBookRepository(string filePath)
    {
        _filePath = filePath;
    }

    public List<Book> GetAll()
    {
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

    public Book? GetByIsbn(string isbn)
        => GetAll().FirstOrDefault(b => b.Isbn == isbn);

    public void Add(Book book)
    {
        lock (_lockObj)
        {
            var doc = XDocument.Load(_filePath);

            var newBook = new XElement("book",
                new XAttribute("category", book.Category),
                new XElement("isbn", book.Isbn),
                new XElement("title", book.Title),
                book.Authors.Select(a => new XElement("author", a)),
                new XElement("year", book.Year),
                new XElement("price", book.Price)
            );

            doc.Root!.Add(newBook);
            doc.Save(_filePath);
        }
    }

    public void Update(string isbn, Book book)
    {
        lock (_lockObj)
        {
            var doc = XDocument.Load(_filePath);
            var bookElement = doc.Root!.Elements("book")
                .FirstOrDefault(b => b.Element("isbn")!.Value == isbn);

            if (bookElement == null)
                throw new InvalidOperationException($"Book with ISBN {isbn} not found.");

            bookElement.SetAttributeValue("category", book.Category);
            bookElement.Element("title")!.Value = book.Title;
            bookElement.Elements("author").Remove();
            foreach (var author in book.Authors)
                bookElement.Add(new XElement("author", author));
            bookElement.Element("year")!.Value = book.Year.ToString();
            bookElement.Element("price")!.Value = book.Price.ToString();

            doc.Save(_filePath);
        }
    }

    public void Delete(string isbn)
    {
        throw new Exception();
        lock (_lockObj)
        {
            var doc = XDocument.Load(_filePath);
            var bookElement = doc.Root!.Elements("book")
                .FirstOrDefault(b => b.Element("isbn")!.Value == isbn);

            if (bookElement == null)
                throw new InvalidOperationException($"Book with ISBN {isbn} not found.");

            bookElement.Remove();
            doc.Save(_filePath);
        }
    }
}
