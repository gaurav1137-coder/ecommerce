using System;
using System.Collections.Generic;
using System.Linq;
using EcommerceBackend.Models;

namespace EcommerceBackend.Data
{
    public static class DbSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            // 1. Seed Categories
            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new Category { Name = "Men", Description = "Premium styles for men" },
                    new Category { Name = "Women", Description = "Luxury elegance & fashion for women" },
                    new Category { Name = "Electronics", Description = "Latest state-of-the-art gadgets" },
                    new Category { Name = "Accessories", Description = "Minimalist and premium wearables" },
                    new Category { Name = "Footwear", Description = "Sporty and formal footwear" },
                    new Category { Name = "Kids", Description = "Comfortable and stylish clothes for kids" }
                };

                context.Categories.AddRange(categories);
                context.SaveChanges();
            }

            // 2. Seed Users
            if (!context.Users.Any())
            {
                var users = new List<User>
                {
                    new User
                    {
                        Name = "Admin User",
                        Email = "admin@nexora.com",
                        MobileNumber = "9876543210",
                        PasswordHash = "hashed_pw",
                        RoleId = 1 // Admin
                    },
                    new User
                    {
                        Name = "Customer User",
                        Email = "customer@nexora.com",
                        MobileNumber = "1234567890",
                        PasswordHash = "hashed_pw",
                        RoleId = 2 // Customer
                    }
                };

                context.Users.AddRange(users);
                context.SaveChanges();
            }

            // 3. Seed Products with Images and Sizes
            if (!context.Products.Any())
            {
                var menCat = context.Categories.First(c => c.Name == "Men");
                var womenCat = context.Categories.First(c => c.Name == "Women");
                var elecCat = context.Categories.First(c => c.Name == "Electronics");
                var accCat = context.Categories.First(c => c.Name == "Accessories");
                var footCat = context.Categories.First(c => c.Name == "Footwear");
                var kidsCat = context.Categories.First(c => c.Name == "Kids");

                var products = new List<Product>
                {
                    new Product
                    {
                        Name = "Nike Air Max",
                        Description = "High-performance lifestyle running shoes with responsive air cushioning.",
                        Price = 4999,
                        DiscountPrice = 3999,
                        Stock = 15,
                        Brand = "Nike",
                        IsFeatured = true,
                        IsTrending = true,
                        CategoryId = menCat.Id,
                        Images = new List<ProductImage>
                        {
                            new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000" },
                            new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1000" }
                        },
                        Sizes = new List<ProductSize>
                        {
                            new ProductSize { Size = "UK 8", Quantity = 5 },
                            new ProductSize { Size = "UK 9", Quantity = 5 },
                            new ProductSize { Size = "UK 10", Quantity = 5 }
                        }
                    },
                    new Product
                    {
                        Name = "Premium Leather Jacket",
                        Description = "Crafted from genuine full-grain leather, featuring robust metallic zippers and dynamic styling.",
                        Price = 2999,
                        DiscountPrice = 2499,
                        Stock = 10,
                        Brand = "Vogue",
                        IsFeatured = false,
                        IsTrending = true,
                        CategoryId = menCat.Id,
                        Images = new List<ProductImage>
                        {
                            new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000" }
                        },
                        Sizes = new List<ProductSize>
                        {
                            new ProductSize { Size = "S", Quantity = 2 },
                            new ProductSize { Size = "M", Quantity = 4 },
                            new ProductSize { Size = "L", Quantity = 4 }
                        }
                    },
                    new Product
                    {
                        Name = "Luxury Silk Dress",
                        Description = "A sweeping elegance designed with 100% organic mulberry silk.",
                        Price = 3499,
                        DiscountPrice = 0,
                        Stock = 8,
                        Brand = "Gucci",
                        IsFeatured = true,
                        IsTrending = true,
                        CategoryId = womenCat.Id,
                        Images = new List<ProductImage>
                        {
                            new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000" }
                        },
                        Sizes = new List<ProductSize>
                        {
                            new ProductSize { Size = "S", Quantity = 3 },
                            new ProductSize { Size = "M", Quantity = 3 },
                            new ProductSize { Size = "L", Quantity = 2 }
                        }
                    },
                    new Product
                    {
                        Name = "Classic Luxury Handbag",
                        Description = "Crafted leather satchel with detailed golden buckle and adjustable strap.",
                        Price = 4999,
                        DiscountPrice = 4499,
                        Stock = 12,
                        Brand = "Hermes",
                        IsFeatured = false,
                        IsTrending = true,
                        CategoryId = womenCat.Id,
                        Images = new List<ProductImage>
                        {
                            new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000" }
                        },
                        Sizes = new List<ProductSize>
                        {
                            new ProductSize { Size = "One Size", Quantity = 12 }
                        }
                    },
                    new Product
                    {
                        Name = "iPhone Pro Max",
                        Description = "Super Retina XDR display with ProMotion and advanced titanium enclosure.",
                        Price = 89999,
                        DiscountPrice = 84999,
                        Stock = 7,
                        Brand = "Apple",
                        IsFeatured = true,
                        IsTrending = true,
                        CategoryId = elecCat.Id,
                        Images = new List<ProductImage>
                        {
                            new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000" }
                        },
                        Sizes = new List<ProductSize>
                        {
                            new ProductSize { Size = "128 GB", Quantity = 3 },
                            new ProductSize { Size = "256 GB", Quantity = 4 }
                        }
                    },
                    new Product
                    {
                        Name = "Gaming Wireless Headset",
                        Description = "Immersive 7.1 surround sound with noise-canceling microphone and ultra-low latency.",
                        Price = 3999,
                        DiscountPrice = 2999,
                        Stock = 25,
                        Brand = "Razer",
                        IsFeatured = false,
                        IsTrending = true,
                        CategoryId = elecCat.Id,
                        Images = new List<ProductImage>
                        {
                            new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000" }
                        },
                        Sizes = new List<ProductSize>
                        {
                            new ProductSize { Size = "Standard", Quantity = 25 }
                        }
                    },
                    new Product
                    {
                        Name = "Apple Watch Ultra",
                        Description = "Adventure awaits. The most rugged and capable Apple Watch ever.",
                        Price = 19999,
                        DiscountPrice = 18999,
                        Stock = 14,
                        Brand = "Apple",
                        IsFeatured = true,
                        IsTrending = false,
                        CategoryId = accCat.Id,
                        Images = new List<ProductImage>
                        {
                            new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000" }
                        },
                        Sizes = new List<ProductSize>
                        {
                            new ProductSize { Size = "49mm", Quantity = 14 }
                        }
                    },
                    new Product
                    {
                        Name = "Sports Training Sneakers",
                        Description = "Perfect for active lifestyles, features breathable mesh and high-impact traction sole.",
                        Price = 5999,
                        DiscountPrice = 0,
                        Stock = 20,
                        Brand = "Puma",
                        IsFeatured = true,
                        IsTrending = true,
                        CategoryId = footCat.Id,
                        Images = new List<ProductImage>
                        {
                            new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000" }
                        },
                        Sizes = new List<ProductSize>
                        {
                            new ProductSize { Size = "UK 7", Quantity = 5 },
                            new ProductSize { Size = "UK 8", Quantity = 5 },
                            new ProductSize { Size = "UK 9", Quantity = 5 },
                            new ProductSize { Size = "UK 10", Quantity = 5 }
                        }
                    },
                    new Product
                    {
                        Name = "Kids Denim Jacket",
                        Description = "Comfortable and stylish denim jacket crafted from soft cotton fabric.",
                        Price = 1599,
                        DiscountPrice = 1299,
                        Stock = 30,
                        Brand = "Kids Boutique",
                        IsFeatured = false,
                        IsTrending = true,
                        CategoryId = kidsCat.Id,
                        Images = new List<ProductImage>
                        {
                            new ProductImage { ImageUrl = "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=1000" }
                        },
                        Sizes = new List<ProductSize>
                        {
                            new ProductSize { Size = "2-4 Yrs", Quantity = 10 },
                            new ProductSize { Size = "4-6 Yrs", Quantity = 10 },
                            new ProductSize { Size = "6-8 Yrs", Quantity = 10 }
                        }
                    }
                };

                context.Products.AddRange(products);
                context.SaveChanges();
            }
        }
    }
}
