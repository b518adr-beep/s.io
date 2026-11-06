// JavaScript Main Logic with LocalStorage and CRUD Operations

// Default Articles Data
let articlesData = JSON.parse(localStorage.getItem('abu_sahir_articles')) || [
    {
        id: 1,
        title: "استراتيجيات التخطيط في العصر الرقمي",
        category: "التخطيط الاستراتيجي",
        date: "2026-03-15",
        author: "أبو ساهر الشافعي",
        content: "التخطيط الاستراتيجي لم يعد مجرد خطة خماسية جامدة، بل أصبح عملية مرنة تتأثر بالبيانات وتعتمد على سرعة اتخاذ القرار والتكيف مع المتغيرات المستمرة."
    },
    {
        id: 2,
        title: "خصائص القائد المؤثر في إدارة الأزمات",
        category: "القيادة والإدارة",
        date: "2026-02-28",
        author: "أبو ساهر الشافعي",
        content: "القدرة على اتخاذ القرارات الحسمية تحت الضغط، والتواصل الشفاف مع فريق العمل، هي الركائز الأساسية لعبور الأزمات بنجاح وإنجاز."
    }
];

// Tasks Data
let tasksData = JSON.parse(localStorage.getItem('abu_sahir_tasks')) || [
    { id: 1, text: "مراجعة تقرير التخطيط السنوي", completed: false },
    { id: 2, text: "إعداد جدول اللقاءات الاستشارية", completed: true }
];

// App State
let isAdminLoggedIn = false;
let adminPass = localStorage.getItem('abu_sahir_admin_pass') || '123456';
let currentUserName = localStorage.getItem('abu_sahir_user_name') || 'أبو ساهر الشافعي';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    initTheme();
    updateUserUI();
    renderArticles();
    renderTasks();
    loadQuickNotes();
});

// Tab Switcher
function switchTab(tabId) {
    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById(`section-${tabId}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('bg-gold-500', 'text-slate-950', 'shadow-md');
        btn.classList.add('text-slate-300');
    });

    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-gold-500', 'text-slate-950', 'shadow-md');
        activeBtn.classList.remove('text-slate-300');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('hidden');
}

// Theme Controls
function initTheme() {
    const savedTheme = localStorage.getItem('abu_sahir_theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        document.getElementById('themeToggleIcon').className = 'fa-solid fa-moon text-lg text-slate-800';
    } else {
        document.body.classList.remove('light');
        document.getElementById('themeToggleIcon').className = 'fa-solid fa-sun text-lg text-gold-500';
    }
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light');
    const icon = document.getElementById('themeToggleIcon');
    if (isLight) {
        localStorage.setItem('abu_sahir_theme', 'light');
        icon.className = 'fa-solid fa-moon text-lg text-slate-800';
    } else {
        localStorage.setItem('abu_sahir_theme', 'dark');
        icon.className = 'fa-solid fa-sun text-lg text-gold-500';
    }
}

// Admin Password Gate
function handleAdminAuth(e) {
    e.preventDefault();
    const inputPass = document.getElementById('adminPassGateInput').value;
    const errDiv = document.getElementById('adminAuthError');

    if (inputPass === adminPass) {
        isAdminLoggedIn = true;
        errDiv.classList.add('hidden');
        document.getElementById('dashSecurityGate').classList.add('hidden');
        document.getElementById('dashProtectedContent').classList.remove('hidden');
        document.getElementById('adminPassGateInput').value = '';
    } else {
        errDiv.classList.remove('hidden');
    }
}

function lockAdminDashboard() {
    isAdminLoggedIn = false;
    document.getElementById('dashSecurityGate').classList.remove('hidden');
    document.getElementById('dashProtectedContent').classList.add('hidden');
}

// CRUD Articles (Create, Read, Update, Delete)
function renderArticles() {
    const container = document.getElementById('articlesGrid');
    if (!container) return;
    container.innerHTML = '';

    articlesData.forEach(art => {
        const card = document.createElement('div');
        card.className = "glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-gold-500/40 transition-all duration-300";
        
        card.innerHTML = `
            <div>
                <div class="flex items-center justify-between text-xs text-gold-500 mb-3">
                    <span class="bg-gold-500/10 border border-gold-500/30 px-2.5 py-1 rounded-md font-bold">${art.category}</span>
                    <span class="text-slate-400">${art.date}</span>
                </div>
                <h3 class="text-lg font-bold font-tajawal text-slate-100 mb-2 leading-snug">${art.title}</h3>
                <p class="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-4">${art.content}</p>
            </div>
            <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span class="text-slate-500 font-semibold"><i class="fa-solid fa-user-pen ml-1"></i>${art.author}</span>
                <div class="flex gap-2">
                    <button onclick="editArticle(${art.id})" class="text-gold-500 hover:text-gold-400"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button onclick="deleteArticle(${art.id})" class="text-red-400 hover:text-red-300"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function openNewPostModal() {
    document.getElementById('articleEditId').value = '';
    document.getElementById('articleTitleInput').value = '';
    document.getElementById('articleContentInput').value = '';
    document.getElementById('modalArticleTitle').textContent = "إضافة مقال جديد";
    document.getElementById('newPostModal').classList.remove('hidden');
}

function closeNewPostModal() {
    document.getElementById('newPostModal').classList.add('hidden');
}

function editArticle(id) {
    const art = articlesData.find(a => a.id === id);
    if (art) {
        document.getElementById('articleEditId').value = art.id;
        document.getElementById('articleTitleInput').value = art.title;
        document.getElementById('articleCategoryInput').value = art.category;
        document.getElementById('articleContentInput').value = art.content;
        document.getElementById('modalArticleTitle').textContent = "تعديل المقال الحالي";
        document.getElementById('newPostModal').classList.remove('hidden');
    }
}

function handleSaveArticle(e) {
    e.preventDefault();
    const editId = document.getElementById('articleEditId').value;
    const title = document.getElementById('articleTitleInput').value.trim();
    const category = document.getElementById('articleCategoryInput').value;
    const content = document.getElementById('articleContentInput').value.trim();

    if (editId) {
        articlesData = articlesData.map(a => a.id == editId ? { ...a, title, category, content } : a);
    } else {
        articlesData.unshift({
            id: Date.now(),
            title,
            category,
            date: new Date().toISOString().split('T')[0],
            author: currentUserName,
            content
        });
    }

    localStorage.setItem('abu_sahir_articles', JSON.stringify(articlesData));
    renderArticles();
    closeNewPostModal();
}

function deleteArticle(id) {
    articlesData = articlesData.filter(a => a.id !== id);
    localStorage.setItem('abu_sahir_articles', JSON.stringify(articlesData));
    renderArticles();
}

// Tasks & Notes Logic
function renderTasks() {
    const container = document.getElementById('tasksList');
    if (!container) return;
    container.innerHTML = '';
    document.getElementById('taskCounter').textContent = `${tasksData.length} مهام`;

    tasksData.forEach(task => {
        const item = document.createElement('div');
        item.className = `flex items-center justify-between p-3 rounded-xl border transition-all ${
            task.completed ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through' : 'bg-slate-950 border-slate-800 text-slate-200'
        }`;
        item.innerHTML = `
            <div class="flex items-center gap-3 cursor-pointer" onclick="toggleTask(${task.id})">
                <i class="fa-regular ${task.completed ? 'fa-circle-check text-emerald-500' : 'fa-circle text-slate-600'} text-lg"></i>
                <span class="text-sm font-medium">${task.text}</span>
            </div>
            <button onclick="deleteTask(${task.id})" class="text-slate-500 hover:text-red-400 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
        `;
        container.appendChild(item);
    });
}

function handleAddTask(e) {
    e.preventDefault();
    const text = document.getElementById('newTaskInput').value.trim();
    if (text) {
        tasksData.unshift({ id: Date.now(), text, completed: false });
        localStorage.setItem('abu_sahir_tasks', JSON.stringify(tasksData));
        document.getElementById('newTaskInput').value = '';
        renderTasks();
    }
}

function toggleTask(id) {
    tasksData = tasksData.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    localStorage.setItem('abu_sahir_tasks', JSON.stringify(tasksData));
    renderTasks();
}

function deleteTask(id) {
    tasksData = tasksData.filter(t => t.id !== id);
    localStorage.setItem('abu_sahir_tasks', JSON.stringify(tasksData));
    renderTasks();
}

function loadQuickNotes() {
    document.getElementById('quickNotesArea').value = localStorage.getItem('abu_sahir_quick_notes') || '';
}

function saveQuickNotes() {
    localStorage.setItem('abu_sahir_quick_notes', document.getElementById('quickNotesArea').value);
}

function clearQuickNotes() {
    document.getElementById('quickNotesArea').value = '';
    localStorage.removeItem('abu_sahir_quick_notes');
}

function toggleAuthModal() {
    document.getElementById('authModal').classList.toggle('hidden');
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('authNameInput').value.trim();
    if (name) {
        currentUserName = name;
        localStorage.setItem('abu_sahir_user_name', name);
        updateUserUI();
        toggleAuthModal();
    }
}

function updateUserUI() {
    document.getElementById('userBadgeName').textContent = currentUserName;
    document.getElementById('authBtnText').textContent = currentUserName ? currentUserName : "تسجيل الدخول";
}