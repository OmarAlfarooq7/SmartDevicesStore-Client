import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  // مصفوفة العناصر في السلة
  private items: any[] = [];

  // مستشعر لمراقبة عدد العناصر
  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor() {
    // عند تشغيل الخدمة يتم استعادة البيانات المحفوظة
    this.loadCart();
  }

  // إضافة منتج للسلة
  addToCart(product: any) {
    const existingItem = this.items.find(i => i.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }

    this.saveCart();
  }

  // جلب العناصر
  getItems() {
    return this.items;
  }

  // حذف منتج
  removeItem(productId: number) {
    this.items = this.items.filter(i => i.id !== productId);
    this.saveCart();
  }

  // حساب الإجمالي
  getTotalPrice() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // حفظ السلة في ذاكرة المتصفح
  private saveCart() {
    localStorage.setItem('smart_cart', JSON.stringify(this.items));
    this.cartCount.next(this.items.length); // تحديث العداد
  }

  // تحميل السلة من ذاكرة المتصفح
  private loadCart() {
    const savedCart = localStorage.getItem('smart_cart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
      this.cartCount.next(this.items.length);
    }
  }

  // تفريغ السلة
  clearCart() {
    this.items = [];
    localStorage.removeItem('smart_cart');
    this.cartCount.next(0);
  }
}