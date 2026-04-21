import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';

// استيراد الخدمات والموديلات
import { CategoryService } from './services/category';
import { ShoppingCartService } from './services/shopping-cart'; 
import { Category } from './models/category.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  showSuccessMessage: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    public cart: ShoppingCartService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        if (this.categories && this.categories.length > 0) {
          this.selectedCategoryId = this.categories[0].id;
        }
        console.log('تم مزامنة المنتجات بنجاح');
        this.cdr.detectChanges();
      },
      error: (err) => console.error('فشل جلب البيانات:', err)
    });
  }

  selectCategory(id: number): void {
    this.selectedCategoryId = id;
    this.cdr.detectChanges();
  }

  // الإضافة للسلة مع التنبيه الجانبي
  addToCart(product: any) {
    this.cart.addToCart(product);
    this.showSuccessMessage = true;

    setTimeout(() => {
      this.showSuccessMessage = false;
      this.cdr.detectChanges();
    }, 2500);

    this.cdr.detectChanges();
  }

  // ميثود الحذف مع رسالة التأكيد
  async confirmDelete(productId: number, productName: string) {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف "${productName}" من سلة مشترياتك`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      // background: '#fff',
      // borderRadius: '15px'
    });

    if (result.isConfirmed) {
      this.cart.removeItem(productId);
      this.cdr.detectChanges();

      Swal.fire({
        title: 'تم الحذف بنجاح',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  }

  // إتمام الطلب
  checkout() {
    Swal.fire({
      title: 'تنبيه',
      text: 'لإتمام عملية الشراء وحفظ طلباتك البرمجية، يرجى تسجيل الدخول أولاً',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'تسجيل الدخول الآن',
      cancelButtonText: 'إكمال التسوق',
      confirmButtonColor: '#0d6efd',
    }).then((result) => {
      if (result.isConfirmed) {

        //اغلاق السلة
        const closeCanvas = document.querySelector('[data-bs-dismiss="offcanvas"]') as HTMLElement;
        if (closeCanvas) closeCanvas.click();

        // 2. فتح مودل المستخدم
        const modalElement = document.getElementById('userModal');
        if (modalElement) {
          const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
          bootstrapModal.show();
        }
      }
    });
  }

  toggleCart() {
    console.log('تم فتح السلة الذكية');
    this.showSuccessMessage = false;
  }
}
