// تعريف هيكل المنتج أولاً لكي نستخدمه بالأسفل
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    imageUrl: string;
    categoryId: number;
}

// تحديث الصنف ليشمل قائمة المنتجات
export interface Category {
    id: number;
    name: string;
    products: Product[]; // هذا السطر هو الذي سيحل الخطأ فوراً
}