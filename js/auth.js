// Authentication functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!validateEmail(email)) {
        alert('يرجى إدخال بريد إلكتروني صحيح');
        return;
    }
    
    showLoading();
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            hideLoading();
            console.log('تم تسجيل الدخول بنجاح');
        })
        .catch((error) => {
            hideLoading();
            alert('خطأ في تسجيل الدخول: ' + error.message);
        });
}

function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!validateEmail(email)) {
        alert('يرجى إدخال بريد إلكتروني صحيح (مثال: name@example.com)');
        return;
    }
    
    if (password.length < 6) {
        alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }
    
    showLoading();
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            hideLoading();
            alert('تم إنشاء الحساب بنجاح!');
            console.log('تم إنشاء الحساب بنجاح');
        })
        .catch((error) => {
            hideLoading();
            alert('خطأ في إنشاء الحساب: ' + error.message);
        });
}

function logout() {
    showLoading();
    auth.signOut().then(() => {
        hideLoading();
        console.log('تم تسجيل الخروج');
    });
}

// Auth state listener
auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        document.getElementById('userInfo').style.display = 'flex';
        document.getElementById('userEmail').textContent = user.email;
        
        // Load user data
        loadUserData();
    } else {
        document.getElementById('authSection').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('userInfo').style.display = 'none';
    }
    hideLoading();
});
