// ---------- ДАННЫЕ ----------
const directionsData = [
    { name: "Хип-хоп", level: "Начинающий", duration: "60мин", icon: "🔥", image: "images/хип-хоп.jpg" },
    { name: "Народные", level: "Средний", duration: "75мин", icon: "🍃", image: "images/народные.webp" },
    { name: "Бальные танцы", level: "Начинающий", duration: "90мин", icon: "💃", image: "images/бал1.jpg" },
    { name: "Танго", level: "Продвинутый", duration: "90мин", icon: "🌹", image: "images/танго.jpg" },
    { name: "Балет", level: "Продвинутый", duration: "75мин", icon: "🎧", image: "images/балет.webp" }
];function init() {
    loadBookings();
    renderDirections();
    renderTeachers();
    renderSchedule();
    fillDanceSelect();
    setMinDate();
    setupBooking();
    initFilters();

    document.getElementById("showMyBookingsBtn").addEventListener("click", showMyBookings);
}

const teachersData = [
    { name: "Алексей Волков", style: "Хип-хоп", exp: "5 лет", icon: "🕺" },
    { name: "Марина Лесная", style: "Народные, Балет", exp: "6 лет", icon: "💫" },
    { name: "Ирина Смирнова", style: "Бальные, Танго", exp: "8 лет", icon: "💃" }
];

const scheduleData = [
    { day: "Понедельник", time: "18:00", dance: "Хип-хоп", teacher: "Алексей Волков", spots: 15 },
    { day: "Вторник", time: "17:00", dance: "Народные", teacher: "Марина Лесная", spots: 12 },
    { day: "Среда", time: "19:00", dance: "Бальные танцы", teacher: "Ирина Смирнова", spots: 10 },
    { day: "Пятница", time: "18:30", dance: "Танго", teacher: "Ирина Смирнова", spots: 10 },
    { day: "Суббота", time: "14:00", dance: "Балет", teacher: "Марина Лесная", spots: 8 }
];

// ---------- ПЕРЕМЕННЫЕ ----------
let currentLevelFilter = "all";

// ---------- ОТРИСОВКА НАПРАВЛЕНИЙ С ФИЛЬТРАЦИЕЙ (С КАРТИНКАМИ) ----------
function renderDirections() {
    let filtered = directionsData;
    if (currentLevelFilter !== "all") {
        filtered = directionsData.filter(d => d.level === currentLevelFilter);
    }

    const container = document.getElementById("directionsList");
    container.innerHTML = filtered.map(d => `
        <div class="card">
            <img src="${d.image}" alt="${d.name}" class="dance-img" onerror="this.src='https://placehold.co/400x200?text=${encodeURIComponent(d.name)}'">
            <div class="card-icon">${d.icon}</div>
            <h3>${d.name}</h3>
            <div class="badge">${d.level}</div>
            <p>${d.duration}</p>
        </div>
    `).join("");
}

// ---------- ПРЕПОДАВАТЕЛИ ----------
function renderTeachers() {
    const container = document.getElementById("teachersList");
    container.innerHTML = teachersData.map(t => `
        <div class="card">
            <div class="card-icon">${t.icon}</div>
            <h3>${t.name}</h3>
            <p>${t.style}</p>
            <div class="badge">${t.exp}</div>
        </div>
    `).join("");
}

// ---------- РАСПИСАНИЕ ----------
function renderSchedule() {
    const tbody = document.getElementById("scheduleBody");
    tbody.innerHTML = scheduleData.map(s => `
        <tr>
            <td>${s.day}</td>
            <td>${s.time}</td>
            <td>${s.dance}</td>
            <td>${s.teacher}</td>
            <td>${s.spots}</td>
        </tr>
    `).join("");
}

// ---------- ПОИСК ЗАПИСЕЙ ПО ТЕЛЕФОНУ ----------
let allBookings = [];

function loadBookings() {
    const saved = localStorage.getItem("danceBookings");
    if (saved) allBookings = JSON.parse(saved);
}

function saveBookings() {
    localStorage.setItem("danceBookings", JSON.stringify(allBookings));
}

function showMyBookings() {
    const phone = document.getElementById("viewPhone").value.trim();
    const container = document.getElementById("myBookingsList");

    if (!phone) {
        container.innerHTML = "<p>Введите номер телефона</p>";
        return;
    }

    const my = allBookings.filter(b => b.phone === phone);
    if (my.length === 0) {
        container.innerHTML = "<p>Записей не найдено</p>";
        return;
    }

    container.innerHTML = my.map(b => `
        <div class="booking-item">
            <span><strong>${b.dance}</strong> — ${b.date}</span>
            <button class="cancel-btn" data-id="${b.id}" data-phone="${phone}">Отменить</button>
        </div>
    `).join("");

    // Отмена записи
    document.querySelectorAll(".cancel-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);
            allBookings = allBookings.filter(b => b.id !== id);
            saveBookings();
            showMyBookings();
        });
    });
}

// ---------- ЗАПИСЬ НА ЗАНЯТИЕ ----------
function setupBooking() {
    const btn = document.getElementById("submitBooking");
    btn.addEventListener("click", () => {
        const name = document.getElementById("userName").value.trim();
        const phone = document.getElementById("userPhone").value.trim();
        const dance = document.getElementById("bookingDance").value;
        const date = document.getElementById("bookingDate").value;
        const msgDiv = document.getElementById("formMessage");

        if (!name || !phone) {
            msgDiv.innerHTML = '<div class="message error">Заполните имя и телефон</div>';
            return;
        }

        const newBooking = {
            id: Date.now(),
            name, phone, dance, date
        };
        allBookings.push(newBooking);
        saveBookings();

        msgDiv.innerHTML = '<div class="message success">✅ Вы записаны!</div>';
        document.getElementById("userName").value = "";
        document.getElementById("userPhone").value = "";
    });
}

// ---------- ЗАПОЛНЕНИЕ СПИСКА НАПРАВЛЕНИЙ В ФОРМЕ ----------
function fillDanceSelect() {
    const select = document.getElementById("bookingDance");
    select.innerHTML = directionsData.map(d => `<option value="${d.name}">${d.name}</option>`).join("");
}

// ---------- ДАТА ----------
function setMinDate() {
    const dateInput = document.getElementById("bookingDate");
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
}

// ---------- ФИЛЬТРЫ ----------
function initFilters() {
    const filterBtns = document.querySelectorAll("[data-level]");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentLevelFilter = btn.dataset.level;
            renderDirections();
        });
    });
}

function init() {
    loadBookings();
    renderDirections();
    renderTeachers();
    renderSchedule();
    fillDanceSelect();
    setMinDate();
    setupBooking();
    initFilters();

    document.getElementById("showMyBookingsBtn").addEventListener("click", showMyBookings);
}

document.addEventListener("DOMContentLoaded", init);