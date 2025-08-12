// انتظر حتى يتم تحميل محتوى الصفحة بالكامل لبدء تنفيذ الكود
document.addEventListener('DOMContentLoaded', function() {

    // دالة لجلب وتحليل البيانات من ملف خارجي باستخدام async/await
    async function getTestsData() {
        try {
            // 1. جلب محتوى الملف النصي
            const response = await fetch('tests.txt'); // تأكد من أن اسم الملف صحيح
            
            // التأكد من نجاح الطلب
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.text();

            // 2. تحليل البيانات (الأكواد والروابط)
            const lines = data.trim().split('\n');
            const links = {};
            for (let i = 0; i < lines.length; i += 2) {
                const code = lines[i].trim();
                const url = lines[i + 1] ? lines[i + 1].trim() : null;
                if (code && url) {
                    links[code] = url;
                }
            }
            return links;
        } catch (error) {
            console.error('حدث خطأ في جلب ملف الاختبارات:', error);
            // في حال فشل جلب الملف، يمكن عرض رسالة للمستخدم
            const container = document.getElementById('grades-container');
            if(container) {
                container.innerHTML = '<p style="color:red;">حدث خطأ في تحميل بيانات الاختبارات. الرجاء المحاولة مرة أخرى لاحقاً.</p>';
            }
            return {}; // إرجاع كائن فارغ لتجنب أخطاء أخرى في الكود
        }
    }

    // دالة لتهيئة التطبيق بعد جلب البيانات
    async function initializeApp() {
        const testLinks = await getTestsData();
        
        // إذا لم يتم تحميل أي روابط، لا تكمل
        if (Object.keys(testLinks).length === 0) {
            console.log("لم يتم تحميل أي روابط اختبارات.");
            return;
        }

        const grades = [
            { name: "الصف الرابع الابتدائي" },
            { name: "الصف الخامس الابتدائي" },
            { name: "الصف السادس الابتدائي" },
            { name: "الصف الأول الإعدادي" },
            { name: "الصف الثاني الإعدادي" },
            { name: "الصف الثالث الإعدادي" }
        ];

        const gradesContainer = document.getElementById('grades-container');
        gradesContainer.innerHTML = ''; // إفراغ الحاوية من أي رسائل تحميل

        grades.forEach(grade => {
            const card = document.createElement('a');
            card.href = '#';
            card.className = 'grade-card';
            card.textContent = grade.name;
            card.dataset.gradeName = grade.name;
            gradesContainer.appendChild(card);
            // إضافة مستمع الحدث لكل بطاقة وتمرير كائن الروابط له
            card.addEventListener('click', (event) => handleGradeClick(event, testLinks));
        });
    }

    // دالة التعامل مع نقرات المستخدم على بطاقات الصفوف
    function handleGradeClick(event, testLinks) {
        event.preventDefault(); // منع السلوك الافتراضي للرابط

        const gradeName = event.currentTarget.dataset.gradeName;
        const code = prompt(`للدخول لاختبار "${gradeName}"\n\nالرجاء إدخال الكود:`);

        // إذا ألغى المستخدم الإدخال أو أدخل قيمة فارغة
        if (code === null || code.trim() === "") {
            return; 
        }

        const url = testLinks[code.trim()];

        if (url) {
            alert("تم التحقق بنجاح. سيتم فتح الاختبار في نافذة جديدة الآن.");
            window.open(url, '_blank'); // فتح الرابط في تبويب جديد
        } else {
            alert("الكود الذي أدخلته غير صحيح أو أن الاختبار غير متاح بعد. ارجع إلى مذاكرتك.");
        }
    }

    // بدء تشغيل التطبيق
    initializeApp();
});
