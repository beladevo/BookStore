using BookStore.API.Models;
using BookStore.Core.Entities;
using BookStore.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IBookService _bookService;

    public BooksController(IBookService service)
    {
        _bookService = service;
    }

    [HttpGet]
    public IActionResult GetPaged(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? category = null)
    {

        if (pageSize < 1 || pageSize > 20)
            return BadRequest(new { message = $"Page size must be between 1 and 20. Provided: {pageSize}" });

        var (totalCount, items) = _bookService.GetPaged(pageNumber, pageSize, search, category);
        return Ok(new
        {
            totalCount,
            items
        });
    }

    [HttpGet("{isbn}")]
    public ActionResult<BookResponse> GetByIsbn(string isbn)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(isbn))
                return BadRequest(new { message = "ISBN is required." });

            var book = _bookService.GetByIsbn(isbn);
            return Ok(MapToResponse(book));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("stats")]
    public ActionResult<BookStatsDto> GetStats()
    {
        try
        {
            var stats = _bookService.GetStats();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "An unexpected error occurred while retrieving book statistics.",
                detail = ex.Message
            });
        }
    }


    [HttpPost]
    public IActionResult Add([FromBody] BookRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var book = MapToEntity(request);

        try
        {
            _bookService.Add(book);
            return CreatedAtAction(nameof(GetByIsbn), new { isbn = book.Isbn }, MapToResponse(book));
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{isbn}")]
    public IActionResult Update(string isbn, [FromBody] BookRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var book = MapToEntity(request);

        try
        {
            _bookService.Update(isbn, book);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{isbn}")]
    public IActionResult Delete(string isbn)
    {
        try
        {
            _bookService.Delete(isbn);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("categories")]
    public ActionResult<List<string>> GetCategories()
    {
        var categories = _bookService.GetDistinctCategories();
        return Ok(categories);
    }

    [HttpGet("report")]
    public IActionResult GetReport()
    {
        var books = _bookService.GetAll();
        var html = GenerateHtml(books);
        return Content(html, "text/html");
    }

    private string GenerateHtml(List<Book> books)
    {
        var generatedAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss 'UTC'");

        var html = $@"
                    <html>
                    <head>
                        <title>Book Report</title>
                        <style>
                            body {{ font-family: Arial; }}
                            table {{ border-collapse: collapse; width: 100%; }}
                            th, td {{ border: 1px solid #ddd; padding: 8px; }}
                            th {{ background-color: #f2f2f2; text-align: left; }}
                            .timestamp {{ margin-bottom: 20px; font-size: 0.9em; color: #555; }}
                        </style>
                    </head>
                    <body>
                        <h2>Bookstore Report</h2>
                        <div class='timestamp'>Generated at {generatedAt}</div>
                        <table>
                            <tr>
                                <th>ISBN</th>
                                <th>Title</th>
                                <th>Authors</th>
                                <th>Category</th>
                                <th>Year</th>
                                <th>Price</th>
                            </tr>";

        foreach (var book in books)
        {
            html += $@"
                        <tr>
                            <td>{book.Isbn}</td>
                            <td>{book.Title}</td>
                            <td>{string.Join(", ", book.Authors)}</td>
                            <td>{book.Category}</td>
                            <td>{book.Year}</td>
                            <td>{book.Price}</td>
                        </tr>";
        }

        html += "</table></body></html>";

        return html;
    }

    private static Book MapToEntity(BookRequest request)
    {
        return new Book
        {
            Isbn = request.Isbn,
            Title = request.Title,
            Authors = request.Authors,
            Category = request.Category,
            Year = request.Year,
            Price = request.Price
        };
    }

    private static BookResponse MapToResponse(Book book)
    {
        return new BookResponse
        {
            Isbn = book.Isbn,
            Title = book.Title,
            Authors = book.Authors,
            Category = book.Category,
            Year = book.Year,
            Price = book.Price
        };
    }

}
