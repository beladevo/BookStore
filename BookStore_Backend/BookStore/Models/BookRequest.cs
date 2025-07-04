using System.ComponentModel.DataAnnotations;

namespace BookStore.API.Models
{

    public class BookRequest
    {
        [Required]
        [StringLength(20)]
        public string Isbn { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MinLength(1)]
        public List<string> Authors { get; set; } = new();

        [Required]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty;

        [Range(1000, 3000)]
        public int Year { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
    }
}
