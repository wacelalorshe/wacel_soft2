// Main application logic
let currentUser = null;

function openTab(tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Remove active class from all tab links
    const tabLinks = document.getElementsByClassName('tab-link');
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove('active');
    }
    
    // Show the specific tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to the clicked tab link
    event.currentTarget.classList.add('active');
}

function loadUserData() {
    currentUser = auth.currentUser;
    if (currentUser) {
        loadSales();
        loadExpenses();
        loadInventory();
        updateDashboard();
    }
}

// Sales Management
function addSale() {
    const productName = document.getElementById('productName').value;
    const amount = parseFloat(document.getElementById('saleAmount').value);
    const quantity = parseInt(document.getElementById('saleQuantity').value) || 1;
    
    if (!productName || !amount) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    const saleData = {
        productName: productName,
        amount: amount,
        quantity: quantity,
        total: amount * quantity,
        date: new Date(),
        userId: currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    db.collection('sales').add(saleData)
        .then(() => {
            alert('تم إضافة البيع بنجاح');
            document.getElementById('productName').value = '';
            document.getElementById('saleAmount').value = '';
            document.getElementById('saleQuantity').value = '1';
            loadSales();
            updateDashboard();
        })
        .catch((error) => {
            alert('خطأ في إضافة البيع: ' + error.message);
        });
}

function loadSales() {
    const salesList = document.getElementById('salesList');
    salesList.innerHTML = '<p>جاري التحميل...</p>';
    
    db.collection('sales')
        .where('userId', '==', currentUser.uid)
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get()
        .then((querySnapshot) => {
            salesList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const sale = doc.data();
                const saleElement = document.createElement('div');
                saleElement.className = 'item-card';
                saleElement.innerHTML = `
                    <strong>${sale.productName}</strong>
                    <div>المبلغ: ${sale.amount} ريال</div>
                    <div>الكمية: ${sale.quantity}</div>
                    <div>الإجمالي: ${sale.total} ريال</div>
                    <small>${sale.date.toDate().toLocaleDateString('ar-SA')}</small>
                `;
                salesList.appendChild(saleElement);
            });
        });
}

// Expenses Management
function addExpense() {
    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    
    if (!description || !amount) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    const expenseData = {
        description: description,
        amount: amount,
        category: category,
        date: new Date(),
        userId: currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    db.collection('expenses').add(expenseData)
        .then(() => {
            alert('تم إضافة المصروف بنجاح');
            document.getElementById('expenseDescription').value = '';
            document.getElementById('expenseAmount').value = '';
            loadExpenses();
            updateDashboard();
        })
        .catch((error) => {
            alert('خطأ في إضافة المصروف: ' + error.message);
        });
}

function loadExpenses() {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '<p>جاري التحميل...</p>';
    
    db.collection('expenses')
        .where('userId', '==', currentUser.uid)
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get()
        .then((querySnapshot) => {
            expensesList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const expense = doc.data();
                const expenseElement = document.createElement('div');
                expenseElement.className = 'item-card';
                expenseElement.innerHTML = `
                    <strong>${expense.description}</strong>
                    <div>المبلغ: ${expense.amount} ريال</div>
                    <div>التصنيف: ${expense.category}</div>
                    <small>${expense.date.toDate().toLocaleDateString('ar-SA')}</small>
                `;
                expensesList.appendChild(expenseElement);
            });
        });
}

// Inventory Management
function addInventoryItem() {
    const name = document.getElementById('inventoryName').value;
    const price = parseFloat(document.getElementById('inventoryPrice').value);
    const salePrice = parseFloat(document.getElementById('inventorySalePrice').value);
    const quantity = parseInt(document.getElementById('inventoryQuantity').value);
    const minQuantity = parseInt(document.getElementById('inventoryMinQuantity').value);
    
    if (!name || !price || !salePrice || !quantity) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    const inventoryData = {
        name: name,
        price: price,
        salePrice: salePrice,
        quantity: quantity,
        minQuantity: minQuantity,
        userId: currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    db.collection('inventory').add(inventoryData)
        .then(() => {
            alert('تم إضافة المنتج بنجاح');
            document.getElementById('inventoryName').value = '';
            document.getElementById('inventoryPrice').value = '';
            document.getElementById('inventorySalePrice').value = '';
            document.getElementById('inventoryQuantity').value = '';
            loadInventory();
        })
        .catch((error) => {
            alert('خطأ في إضافة المنتج: ' + error.message);
        });
}

function loadInventory() {
    const inventoryList = document.getElementById('inventoryList');
    inventoryList.innerHTML = '<p>جاري التحميل...</p>';
    
    db.collection('inventory')
        .where('userId', '==', currentUser.uid)
        .get()
        .then((querySnapshot) => {
            inventoryList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                const itemElement = document.createElement('div');
                itemElement.className = 'item-card';
                itemElement.innerHTML = `
                    <strong>${item.name}</strong>
                    <div>سعر الشراء: ${item.price} ريال</div>
                    <div>سعر البيع: ${item.salePrice} ريال</div>
                    <div>الكمية: ${item.quantity}</div>
                    <div>الحد الأدنى: ${item.minQuantity}</div>
                `;
                inventoryList.appendChild(itemElement);
            });
        });
}

// Dashboard Updates
function updateDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate today's revenue
    db.collection('sales')
        .where('userId', '==', currentUser.uid)
        .where('date', '>=', today)
        .get()
        .then((querySnapshot) => {
            let todayRevenue = 0;
            querySnapshot.forEach((doc) => {
                todayRevenue += doc.data().total;
            });
            document.getElementById('todayRevenue').textContent = todayRevenue + ' ريال';
        });
    
    // Calculate today's expenses
    db.collection('expenses')
        .where('userId', '==', currentUser.uid)
        .where('date', '>=', today)
        .get()
        .then((querySnapshot) => {
            let todayExpenses = 0;
            querySnapshot.forEach((doc) => {
                todayExpenses += doc.data().amount;
            });
            document.getElementById('todayExpenses').textContent = todayExpenses + ' ريال';
            
            // Calculate net profit
            const revenueElement = document.getElementById('todayRevenue');
            const revenue = parseFloat(revenueElement.textContent) || 0;
            const netProfit = revenue - todayExpenses;
            document.getElementById('netProfit').textContent = netProfit + ' ريال';
        });
}
