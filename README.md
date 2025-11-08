# نظام محاسبة المتاجر البسيط

تطبيق ويب بسيط لإدارة محاسبة المتاجر الصغيرة مع دعم للغة العربية.

## المميزات

- ✅ إدارة المبيعات
- ✅ إدارة المصروفات
- ✅ إدارة المخزون
- ✅ تقارير الأرباح والخسائر
- ✅ دعم多يستخدم
- ✅ واجهة باللغة العربية

## التقنيات المستخدمة

- HTML5, CSS3, JavaScript
- Firebase Firestore (قاعدة البيانات)
- Firebase Authentication (المصادقة)

## طريقة الإعداد

1. أنشئ مشروع جديد في [Firebase Console](https://console.firebase.google.com)
2. فعّل Authentication واختر Email/Password
3. أنشئ Firestore Database
4. استبدل إعدادات Firebase في `js/firebase-config.js`
5. انشر الموقع على GitHub Pages أو أي hosting service

## هيكل قاعدة البيانات

- `sales` - سجل المبيعات
- `expenses` - سجل المصروفات
- `inventory` - إدارة المخزون

## الترخيص

MIT License
