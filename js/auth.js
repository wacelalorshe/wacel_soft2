// Authentication functions
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('تم تسجيل الدخول بنجاح');
        })
        .catch((error) => {
            alert('خطأ في تسجيل الدخول: ' + error.message);
        });
}

function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('تم إنشاء الحساب بنجاح');
        })
        .catch((error) => {
            alert('خطأ في إنشاء الحساب: ' + error.message);
        });
}

function logout() {
    auth.signOut().then(() => {
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
});
