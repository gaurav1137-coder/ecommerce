import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { ProductService } from '../../services/product';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class Admin implements OnInit {
  activeTab: 'dashboard' | 'products' | 'orders' = 'dashboard';

  // Stats
  totalUsers = 0;
  totalProducts = 0;
  totalOrders = 0;
  totalRevenue = 0;
  recentOrders: any[] = [];

  // Products Management
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  paginatedProducts: any[] = [];
  categories: any[] = [];
  
  // Product Search/Filter/Sort/Pagination
  prodSearch = '';
  prodCategory = '';
  prodSort = '';
  prodPage = 1;
  prodPageSize = 5;
  prodTotalPages = 1;

  // New/Edit Product Form
  showProductModal = false;
  isEditing = false;
  editingProductId: number | null = null;
  productForm = {
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    stock: 10,
    brand: '',
    categoryId: 1,
    imageUrl: '',
    isFeatured: false,
    isTrending: false
  };

  // Orders Management
  allOrders: any[] = [];

  private adminService = inject(AdminService);
  private productService = inject(ProductService);
  private toastr = inject(ToastrService);
  private http = inject(HttpClient);

  ngOnInit() {
    this.loadStats();
    this.loadProducts();
    this.loadOrders();
    this.loadCategories();
  }

  // Load Categories
  loadCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/Category`).subscribe({
      next: (data) => {
        this.categories = data;
        if (data.length > 0 && !this.productForm.categoryId) {
          const firstId = data[0].id || data[0].Id;
          this.productForm.categoryId = firstId;
        }
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  // Load Dashboard Stats
  loadStats() {
    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.totalUsers = res.totalUsers || 0;
        this.totalProducts = res.totalProducts || 0;
        this.totalOrders = res.totalOrders || 0;
        this.totalRevenue = res.totalRevenue || 0;
        this.recentOrders = res.recentOrders || [];
      },
      error: (err) => console.error('Failed to load stats', err)
    });
  }

  // Load Products
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.applyProductFilters();
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  // Load Orders
  loadOrders() {
    this.adminService.getOrders().subscribe({
      next: (data) => {
        this.allOrders = data.map(o => {
          const parsed = this.parseOrderStatus(o.status);
          return {
            ...o,
            parsedStatus: parsed.status,
            address: parsed.address,
            paymentMethod: parsed.paymentMethod,
            paymentStatus: parsed.paymentStatus
          };
        });
      },
      error: (err) => console.error('Failed to load admin orders', err)
    });
  }

  parseOrderStatus(statusStr: string) {
    if (!statusStr) return { status: 'Placed', address: 'Not available', paymentMethod: 'Razorpay', paymentStatus: 'Paid' };
    const parts = statusStr.split(';');
    const status = parts[0] || 'Placed';
    const addressPart = parts.find(p => p.startsWith('Address:'))?.replace('Address:', '') || 'Not available';
    const paymentMethodPart = parts.find(p => p.startsWith('PaymentMethod:'))?.replace('PaymentMethod:', '') || 'Razorpay';
    const paymentStatusPart = parts.find(p => p.startsWith('PaymentStatus:'))?.replace('PaymentStatus:', '') || 'Paid';
    return {
      status,
      address: addressPart,
      paymentMethod: paymentMethodPart,
      paymentStatus: paymentStatusPart
    };
  }

  // Product Filters & Pagination
  applyProductFilters() {
    let prods = [...this.allProducts];

    // Search
    if (this.prodSearch.trim()) {
      const search = this.prodSearch.toLowerCase();
      prods = prods.filter(p =>
        (p.name || p.Name || '').toLowerCase().includes(search) ||
        (p.brand || p.Brand || '').toLowerCase().includes(search)
      );
    }

    // Category
    if (this.prodCategory) {
      prods = prods.filter(p => (p.categoryId || p.CategoryId).toString() === this.prodCategory);
    }

    // Sort
    if (this.prodSort === 'priceAsc') {
      prods.sort((a, b) => (a.price || a.Price) - (b.price || b.Price));
    } else if (this.prodSort === 'priceDesc') {
      prods.sort((a, b) => (b.price || b.Price) - (a.price || a.Price));
    } else if (this.prodSort === 'nameAsc') {
      prods.sort((a, b) => (a.name || a.Name || '').localeCompare(b.name || b.Name || ''));
    }

    this.filteredProducts = prods;
    this.prodTotalPages = Math.ceil(prods.length / this.prodPageSize) || 1;
    if (this.prodPage > this.prodTotalPages) this.prodPage = this.prodTotalPages;

    const start = (this.prodPage - 1) * this.prodPageSize;
    this.paginatedProducts = prods.slice(start, start + this.prodPageSize);
  }

  prevPage() {
    if (this.prodPage > 1) {
      this.prodPage--;
      this.applyProductFilters();
    }
  }

  nextPage() {
    if (this.prodPage < this.prodTotalPages) {
      this.prodPage++;
      this.applyProductFilters();
    }
  }

  // Open Modal to Add Product
  openAddModal() {
    this.isEditing = false;
    this.editingProductId = null;
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      discountPrice: 0,
      stock: 10,
      brand: '',
      categoryId: this.categories.length > 0 ? (this.categories[0].id || this.categories[0].Id) : 1,
      imageUrl: '',
      isFeatured: false,
      isTrending: false
    };
    this.showProductModal = true;
  }

  // Open Modal to Edit Product
  openEditModal(product: any) {
    this.isEditing = true;
    this.editingProductId = product.id || product.Id;
    this.productForm = {
      name: product.name || product.Name || '',
      description: product.description || product.Description || '',
      price: product.price || product.Price || 0,
      discountPrice: product.discountPrice || product.DiscountPrice || 0,
      stock: product.stock || product.Stock || 0,
      brand: product.brand || product.Brand || '',
      categoryId: product.categoryId || product.CategoryId || 1,
      imageUrl: product.imageUrl || product.ImageUrl || '',
      isFeatured: product.isFeatured || product.IsFeatured || false,
      isTrending: product.isTrending || product.IsTrending || false
    };
    this.showProductModal = true;
  }

  // Submit Product Form (Add / Edit)
  submitProduct() {
    if (!this.productForm.name.trim() || this.productForm.price <= 0) {
      this.toastr.warning('Please fill in name and a valid price');
      return;
    }

    if (this.isEditing && this.editingProductId) {
      this.http.put<any>(`${environment.apiUrl}/Product/${this.editingProductId}`, this.productForm).subscribe({
        next: () => {
          this.toastr.success('Product updated successfully!');
          this.showProductModal = false;
          this.loadProducts();
          this.loadStats();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to update product');
        }
      });
    } else {
      this.http.post<any>(`${environment.apiUrl}/Product`, this.productForm).subscribe({
        next: () => {
          this.toastr.success('Product created successfully!');
          this.showProductModal = false;
          this.loadProducts();
          this.loadStats();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to create product');
        }
      });
    }
  }

  // Delete Product
  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete<any>(`${environment.apiUrl}/Product/${id}`).subscribe({
        next: () => {
          this.toastr.success('Product deleted successfully');
          this.loadProducts();
          this.loadStats();
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to delete product');
        }
      });
    }
  }

  // Update Order Status
  updateStatus(orderId: number, event: any) {
    const status = event.target.value;
    this.adminService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.toastr.success('Order status updated!');
        this.loadOrders();
        this.loadStats();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to update status');
      }
    });
  }

  switchTab(tab: 'dashboard' | 'products' | 'orders') {
    this.activeTab = tab;
  }
}
