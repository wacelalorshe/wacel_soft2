// نظام تخزين البيانات
class StoreAccountingSystem {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.sales = JSON.parse(localStorage.getItem('sales')) || [];
        this.purchases = JSON.parse(localStorage.getItem('purchases')) || [];
        this.activities = JSON.parse(localStorage.getItem('activities')) || [];
        this.init();
    }

    init() {
        this.loadDashboard();
        this.loadProducts();
        this.setupEventListeners();
        this.checkLowStock();
    }

    // إدارة المنتجات
    addProduct(product) {
        product.id = Date.now();
        product.createdAt = new Date().toISOString();
        this.products.push(product);
        this.saveToLocalStorage();
        this.logActivity('تم إضافة منتج جديد: ' + product.name);
        this.loadProducts();
        this.loadDashboard();
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct };
            this.saveToLocalStorage();
            this.logActivity('تم تحديث المنتج: ' + updatedProduct.name);
            this.loadProducts();
            this.loadDashboard();
        }
    }

    deleteProduct(id) {
        const product = this.products.find(p => p.id === id);
        this.products = this.products.filter(p => p.id !== id);
        this.saveToLocalStorage();
        this.logActivity('تم حذف المنتج: ' + product.name);
        this.loadProducts();
        this.loadDashboard();
    }

    // إدارة المبيعات
    addSale(sale) {
        sale.id = Date.now();
        sale.date = new Date().toISOString();
        
        // تحديث المخزون
        sale.items.forEach(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (product) {
                product.stock -= item.quantity;
            }
        });

        this.sales.push(sale);
        this.saveToLocalStorage();
        this.logActivity('تم تسجيل عملية بيع جديدة');
        this.loadDashboard();
        this.loadSales();
    }

    // التقارير والإحصائيات
    getDashboardStats() {
        const totalSales = this.sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalProducts = this.products.length;
        
        const today = new Date().toDateString();
        const todaySales = this.sales.filter(sale => 
            new Date(sale.date).toDateString() === today
        ).length;

        const lowStockProducts = this.products.filter(p => p.stock < 10).length;

        return {
            totalSales,
            totalProducts,
            todaySales,
            lowStockProducts
        };
    }

    getSalesReport() {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push(date.toDateString());
        }

        return last7Days.map(day => {
            const daySales = this.sales.filter(sale => 
                new Date(sale.date).toDateString() === day
            );
            const total = daySales.reduce((sum, sale) => sum + sale.total, 0);
            return { date: day, total };
        });
    }

    // مساعدات
    saveToLocalStorage() {
        localStorage.setItem('products', JSON.stringify(this.products));
        localStorage.setItem('sales', JSON.stringify(this.sales));
        localStorage.setItem('purchases', JSON.stringify(this.purchases));
        localStorage.setItem('activities', JSON.stringify(this.activities));
    }

    logActivity(message) {
        this.activities.unshift({
            id: Date.now(),
            message,
            timestamp: new Date().toISOString(),
            type: 'info'
        });
        
        // الاحتفاظ بآخر 50 نشاط فقط
        if (this.activities.length > 50) {
            this.activities = this.activities.slice(0, 50);
        }
        
        this.saveToLocalStorage();
    }

    checkLowStock() {
        const lowStockProducts = this.products.filter(p => p.stock < 5);
        if (lowStockProducts.length > 0) {
            this.logActivity('تنبيه: هناك ' + lowStockProducts.length + ' منتج منخفض المخزون');
        }
    }

    // تحميل الواجهات
    loadDashboard() {
        const stats = this.getDashboardStats();
        
        document.getElementById('total-sales').textContent = stats.totalSales.toFixed(2) + ' ريال';
        document.getElementById('total-products').textContent = stats.totalProducts;
        document.getElementById('today-sales').textContent = stats.todaySales;
        document.getElementById('low-stock').textContent = stats.lowStockProducts;

        // تحميل النشاطات
        const activitiesList = document.getElementById('activities-list');
        activitiesList.innerHTML = this.activities.slice(0, 10).map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div>
                    <p>${activity.message}</p>
                    <small>${new Date(activity.timestamp).toLocaleString('ar-SA')}</small>
                </div>
            </div>
        `).join('');
    }

    loadProducts() {
        const productsGrid = document.getElementById('products-grid');
        productsGrid.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-header">
                    <div class="product-name">${product.name}</div>
                    <div class="product-category">${product.category}</div>
                </div>
                <div class="product-price">${product.price.toFixed(2)} ريال</div>
                <div class="product-stock">المخزون: ${product.stock} وحدة</div>
                <div class="product-cost">التكلفة: ${product.cost.toFixed(2)} ريال</div>
                <div class="product-actions">
                    <button class="btn btn-success" onclick="addToSale(${product.id})">
                        <i class="fas fa-cart-plus"></i> بيع
                    </button>
                    <button class="btn btn-primary" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadSales() {
        // سيتم تطويرها لاحقاً
    }

    setupEventListeners() {
        // تبديل التبويبات
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.target.closest('.nav-link').dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tabName) {
        // إخفاء جميع المحتويات
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // إلغاء تنشيط جميع الروابط
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // إظهار المحتوى المحدد
        document.getElementById(tabName).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }
}

// تهيئة النظام
const accountingSystem = new StoreAccountingSystem();

// دوال الواجهة
function showProductForm() {
    document.getElementById('productModal').style.display = 'block';
}

function closeProductForm() {
    document.getElementById('productModal').style.display = 'none';
    document.getElementById('productForm').reset();
}

function saveProduct(event) {
    event.preventDefault();
    
    const product = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        cost: parseFloat(document.getElementById('productCost').value),
        stock: parseInt(document.getElementById('productStock').value),
        category: document.getElementById('productCategory').value
    };

    accountingSystem.addProduct(product);
    closeProductForm();
    
    // إظهار رسالة نجاح
    alert('تم حفظ المنتج بنجاح!');
}

function editProduct(id) {
    const product = accountingSystem.products.find(p => p.id === id);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCost').value = product.cost;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productCategory').value = product.category;
        showProductForm();
    }
}

function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        accountingSystem.deleteProduct(id);
    }
}

function addToSale(productId) {
    accountingSystem.switchTab('sales');
    // سيتم تطويرها لاحقاً
}

function startNewSale() {
    // سيتم تطويرها لاحقاً
    alert('سيتم تطوير واجهة البيع في التحديثات القادمة');
}

// إغلاق النموذج عند النقر خارج المحتوى
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeProductForm();
    }
}

// تحميل الرسوم البيانية عند فتح تبويب التقارير
document.querySelector('[data-tab="reports"]').addEventListener('click', function() {
    setTimeout(loadCharts, 100);
});

function loadCharts() {
    // سيتم تطويرها لاحقاً
    console.log('تحميل الرسوم البيانية...');
}
