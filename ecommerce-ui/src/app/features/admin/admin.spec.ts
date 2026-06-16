import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Admin } from './admin';

describe('Admin Component', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admin] // standalone component import
    }).compileComponents();

    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create admin component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial products list', () => {
    expect(component.products.length).toBeGreaterThan(0);
  });

  it('should add a new product', () => {
    component.newProduct = { name: 'Test Product', price: 100 };
    component.addProduct();

    const found = component.products.find(p => p.name === 'Test Product');
    expect(found).toBeTruthy();
  });

  it('should delete a product', () => {
    const id = component.products[0].id;
    component.deleteProduct(id);

    const exists = component.products.find(p => p.id === id);
    expect(exists).toBeUndefined();
  });
});
