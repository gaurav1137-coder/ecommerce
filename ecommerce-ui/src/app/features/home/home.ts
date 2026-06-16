import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product';
interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  rating: number;
  image: string;
  category: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private productService = inject(ProductService);

  rotation = 0;

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          this.products = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            oldPrice: p.discountPrice && p.discountPrice < p.price ? p.price : Math.floor(p.price * 1.25),
            rating: 4.8,
            category: p.category?.name || 'General',
            image: p.images && p.images.length > 0 ? p.images[0].imageUrl : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000'
          }));
          this.filteredProducts = [...this.products];
        }
      },
      error: (err) => console.error('Failed to load products from API', err)
    });
  }

  categories = [
    'Men',
    'Women',
    'Electronics',
    'Accessories',
    'Footwear',
    'Kids'
  ];

  filteredProducts: Product[] = [];

  products: Product[] = [
    {
      id: 1,
      name: 'Nike Air Max',
      price: 4999,
      oldPrice: 6999,
      rating: 4.8,
      category: 'Men',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000'
    },
    {
      id: 2,
      name: 'Premium Jacket',
      price: 2999,
      oldPrice: 4999,
      rating: 4.7,
      category: 'Men',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000'
    },
    {
      id: 3,
      name: 'Women Dress',
      price: 3499,
      oldPrice: 5999,
      rating: 4.9,
      category: 'Women',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000'
    },
    {
      id: 4,
      name: 'Luxury Handbag',
      price: 4999,
      oldPrice: 7999,
      rating: 4.8,
      category: 'Women',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000'
    },
    {
      id: 5,
      name: 'iPhone Pro',
      price: 89999,
      oldPrice: 99999,
      rating: 4.9,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000'
    },
    {
      id: 6,
      name: 'Gaming Headset',
      price: 3999,
      oldPrice: 5999,
      rating: 4.8,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000'
    }
  ];

  constructor() {

    for (let i = 7; i <= 30; i++) {
      this.products.push({
        id: i,
        name: `Premium Product ${i}`,
        price: 1999 + i * 100,
        oldPrice: 2999 + i * 100,
        rating: 4.5,
        category: this.categories[i % this.categories.length],
        image:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000'
      });
    }

    this.filteredProducts = [...this.products];
  }

  rotateLeft() {
    this.rotation -= 60;
  }

  rotateRight() {
    this.rotation += 60;
  }

  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  filterProducts(searchText: string) {

    const search = searchText.toLowerCase();

    if (!search.trim()) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search)
    );
  }

  get menProducts() {
    return this.filteredProducts.filter(
      x => x.category === 'Men'
    );
  }

  get womenProducts() {
    return this.filteredProducts.filter(
      x => x.category === 'Women'
    );
  }

  get electronicsProducts() {
    return this.filteredProducts.filter(
      x => x.category === 'Electronics'
    );
  }

  get accessoriesProducts() {
    return this.filteredProducts.filter(
      x => x.category === 'Accessories'
    );
  }

  get footwearProducts() {
    return this.filteredProducts.filter(
      x => x.category === 'Footwear'
    );
  }

  get kidsProducts() {
    return this.filteredProducts.filter(
      x => x.category === 'Kids'
    );
  }
  scrollToProducts() {
  document.getElementById('products')?.scrollIntoView({
    behavior: 'smooth'
  });
}
}
