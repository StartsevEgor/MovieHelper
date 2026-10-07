// ===== Состояние =====
let movies = [];

async function fetchMovies() {
    const response = await fetch('/api/movies');
    movies = await response.json();
    renderHome();
    renderCatalog();
    updateDirectorFilter();
    if (!document.getElementById('analytics').classList.contains('hidden')) {
        renderAnalytics();
    }
}

// Загружаем данные при старте
document.addEventListener('DOMContentLoaded', fetchMovies);


// ===== Обновление фильтра режиссёров =====
function updateDirectorFilter() {
    const directorFilter = document.getElementById('directorFilter');
    const currentValue = directorFilter.value;
    const directors = [...new Set(movies.map(m => m.director).filter(Boolean))].sort();
    directorFilter.innerHTML = '<option value="">Все режиссёры</option>' +
        directors.map(d => `<option value="${d}">${d}</option>`).join('');
    if (directors.includes(currentValue)) directorFilter.value = currentValue;
}

// ===== Отрисовка карточки =====
function movieCardHTML(m) {
    const statusLabels = {
        watched: 'Просмотрено',
        watching: 'В процессе',
        planned: 'В планах'
    };
    return `
        <div class="movie-card" onclick="openMovieDetail(${m.id})">
            ${m.poster 
                ? `<img src="${m.poster}" class="movie-poster" alt="${m.title}" onerror="this.style.display='none'; this.parentElement.querySelector('.poster-fallback').style.display='flex'">` 
                : ''}
            <div class="movie-poster poster-fallback" style="${m.poster ? 'display:none' : ''}">🎬</div>
            <div class="movie-info">
                <div class="movie-title">${m.title}</div>
                <div class="movie-meta">
                    <span>${m.year} • ${m.genre}</span>
                    <span class="movie-rating">${m.rating > 0 ? '⭐ ' + m.rating : '—'}</span>
                </div>
                <div class="movie-director">🎬 ${m.director || 'Режиссёр не указан'}</div>
                <span class="movie-status status-${m.status}">${statusLabels[m.status]}</span>
            </div>
            <div class="movie-actions">
                <button class="btn-delete" onclick="event.stopPropagation(); deleteMovie(${m.id})">Удалить</button>
            </div>
        </div>
    `;
}

// ===== Главная =====
function renderHome() {
    // Счётчики
    document.getElementById('homeTotal').textContent = movies.length;
    document.getElementById('homeWatched').textContent = movies.filter(m => m.status === 'watched').length;
    document.getElementById('homePlanned').textContent = movies.filter(m => m.status === 'planned').length;
    document.getElementById('homeWatching').textContent = movies.filter(m => m.status === 'watching').length;
    document.getElementById('plannedCount').textContent = movies.filter(m => m.status === 'planned').length;

    const rated = movies.filter(m => m.rating > 0);
    const avg = rated.length ? (rated.reduce((s, m) => s + m.rating, 0) / rated.length).toFixed(1) : '—';
    document.getElementById('homeRating').textContent = avg;

    // Продолжить просмотр
    const continueWatching = movies.filter(m => m.status === 'watching');
    document.getElementById('continueWatching').innerHTML = continueWatching.length
        ? continueWatching.map(movieCardHTML).join('')
        : '<p class="empty-state">Нет фильмов «в процессе». Добавьте что-то новое!</p>';

    // Недавно добавленные (последние 8)
    const recent = [...movies].sort((a, b) => b.id - a.id).slice(0, 8);
    document.getElementById('recentMovies').innerHTML = recent.length
        ? recent.map(movieCardHTML).join('')
        : '<p class="empty-state">Пока пусто</p>';
}

// ===== Каталог =====
function renderCatalog() {
    const catalog = document.getElementById('catalog');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const genre = document.getElementById('genreFilter').value;
    const director = document.getElementById('directorFilter').value;
    const status = document.getElementById('statusFilter').value;
    const sort = document.getElementById('sortFilter').value;

    let filtered = movies.filter(m => {
        const matchSearch =
            m.title.toLowerCase().includes(search) ||
            (m.director || '').toLowerCase().includes(search);
        const matchGenre = !genre || m.genre === genre;
        const matchDirector = !director || m.director === director;
        const matchStatus = !status || m.status === status;
        return matchSearch && matchGenre && matchDirector && matchStatus;
    });

    if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));
    else filtered.sort((a, b) => b.id - a.id);

    if (filtered.length === 0) {
        catalog.innerHTML = '<p style="color:var(--text-secondary); grid-column: 1/-1; text-align:center; padding:40px;">Ничего не найдено 😢</p>';
        return;
    }

    catalog.innerHTML = filtered.map(movieCardHTML).join('');
}

// ===== Переход в каталог с фильтром =====
function goToCatalog(statusFilter = null) {
    // Переключаем вкладку
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-page="catalog"]').classList.add('active');

    // Показываем каталог
    document.getElementById('home').classList.add('hidden');
    document.getElementById('catalogPage').classList.remove('hidden');
    document.getElementById('analytics').classList.add('hidden');
    document.getElementById('movieDetail').classList.add('hidden');

    if (statusFilter) {
        document.getElementById('statusFilter').value = statusFilter;
    }
    renderCatalog();
}

// ===== Детальная страница =====
function openMovieDetail(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    const statusLabels = {
        watched: 'Просмотрено',
        watching: 'В процессе',
        planned: 'В планах'
    };

    const detail = document.getElementById('movieDetail');

    detail.innerHTML = `
        <button class="back-btn" onclick="closeMovieDetail()">← Назад</button>
        
        <div class="detail-grid">
            <div>
                ${movie.poster 
                    ? `<img src="${movie.poster}" class="detail-poster" alt="${movie.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">` 
                    : ''}
                <div class="detail-poster" style="${movie.poster ? 'display:none' : ''}">🎬</div>
            </div>
            
            <div class="detail-content">
                <h1>${movie.title}</h1>
                
                <div class="detail-meta">
                    <span>📅 ${movie.year}</span>
                    <span>🎭 ${movie.genre}</span>
                    <span>🎬 ${movie.director || 'Режиссёр не указан'}</span>
                </div>

                <span class="detail-status status-${movie.status}">${statusLabels[movie.status]}</span>

                ${movie.rating > 0 
                    ? `<div class="detail-rating">⭐ ${movie.rating} / 10</div>` 
                    : `<div class="detail-rating" style="color:var(--text-secondary);font-size:16px;">Оценка не выставлена</div>`}

                ${movie.actors ? `
                    <div class="detail-section">
                        <h3>🎭 Актёры</h3>
                        <p>${movie.actors}</p>
                    </div>
                ` : ''}

                ${movie.description ? `
                    <div class="detail-section">
                        <h3>📖 Описание</h3>
                        <p>${movie.description}</p>
                    </div>
                ` : '<div class="detail-section"><h3>📖 Описание</h3><p style="color:var(--text-secondary);">Описание отсутствует</p></div>'}

                <div class="detail-actions">
                    <button class="btn-edit" onclick="editMovie(${movie.id})">✏️ Редактировать</button>
                    <button class="btn-delete-detail" onclick="deleteMovieFromDetail(${movie.id})">🗑 Удалить фильм</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('home').classList.add('hidden');
    document.getElementById('catalogPage').classList.add('hidden');
    document.getElementById('analytics').classList.add('hidden');
    detail.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeMovieDetail() {
    document.getElementById('movieDetail').classList.add('hidden');
    document.getElementById('home').classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-page="home"]').classList.add('active');
    renderHome();
}

async function deleteMovieFromDetail(id) {
    if (!confirm('Удалить этот фильм?')) return;
    await fetch(`/api/movies/${id}`, { method: 'DELETE' });
    closeMovieDetail();
    fetchMovies();
}

async function deleteMovie(id) {
    if (!confirm('Удалить этот фильм?')) return;
    await fetch(`/api/movies/${id}`, { method: 'DELETE' });
    fetchMovies();
}

// ===== Модальное окно =====
function openModal() {
    document.getElementById('modal').classList.remove('hidden');
}
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('addForm').reset();
    document.getElementById('modalTitle').textContent = 'Добавить фильм';
    editingId = null;
}

// ===== Навигация =====
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const page = btn.dataset.page;

        if (page === 'add') {
            openModal();
            btn.classList.remove('active');
            document.querySelector('[data-page="home"]').classList.add('active');
            return;
        }

        document.getElementById('home').classList.toggle('hidden', page !== 'home');
        document.getElementById('catalogPage').classList.toggle('hidden', page !== 'catalog');
        document.getElementById('analytics').classList.toggle('hidden', page !== 'analytics');
        document.getElementById('movieDetail').classList.add('hidden');

        if (page === 'analytics') renderAnalytics();
        if (page === 'home') renderHome();
    });
});

// ===== Аналитика =====
function renderAnalytics() {
    document.getElementById('totalCount').textContent = movies.length;
    document.getElementById('watchedCount').textContent = movies.filter(m => m.status === 'watched').length;
    document.getElementById('plannedCountA').textContent = movies.filter(m => m.status === 'planned').length;

    const rated = movies.filter(m => m.rating > 0);
    const avg = rated.length ? (rated.reduce((s, m) => s + m.rating, 0) / rated.length).toFixed(1) : 0;
    document.getElementById('avgRating').textContent = avg;

    const genreCount = {};
    movies.forEach(m => genreCount[m.genre] = (genreCount[m.genre] || 0) + 1);
    renderBarChart('genreChart', genreCount);

    const directorCount = {};
    movies.forEach(m => { if (m.director) directorCount[m.director] = (directorCount[m.director] || 0) + 1; });
    renderBarChart('directorChart', directorCount);
}

function renderBarChart(elementId, dataObject) {
    const container = document.getElementById(elementId);
    const entries = Object.entries(dataObject).sort((a, b) => b[1] - a[1]);

    if (entries.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary);">Нет данных</p>';
        return;
    }

    const maxCount = Math.max(...entries.map(e => e[1]), 1);

    container.innerHTML = entries.map(([name, count]) => `
        <div class="genre-bar">
            <span class="genre-name">${name}</span>
            <div class="genre-bar-fill" style="width: ${(count / maxCount) * 70}%"></div>
            <span class="genre-count">${count}</span>
        </div>
    `).join('');
}

// ===== Редактирование =====
let editingId = null;

function editMovie(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    editingId = id;
    document.getElementById('modalTitle').textContent = 'Редактировать фильм';
    document.getElementById('movieTitle').value = movie.title;
    document.getElementById('movieYear').value = movie.year;
    document.getElementById('movieDirector').value = movie.director || '';
    document.getElementById('movieGenre').value = movie.genre;
    document.getElementById('movieActors').value = movie.actors || '';
    document.getElementById('moviePoster').value = movie.poster || '';
    document.getElementById('movieDescription').value = movie.description || '';
    document.getElementById('movieStatus').value = movie.status;
    document.getElementById('movieRating').value = movie.rating || '';

    document.getElementById('modal').classList.remove('hidden');
}

// ===== Добавление / Сохранение =====
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const movieData = {
        title: document.getElementById('movieTitle').value,
        year: parseInt(document.getElementById('movieYear').value),
        director: document.getElementById('movieDirector').value,
        genre: document.getElementById('movieGenre').value,
        actors: document.getElementById('movieActors').value,
        poster: document.getElementById('moviePoster').value,
        description: document.getElementById('movieDescription').value,
        status: document.getElementById('movieStatus').value,
        rating: parseInt(document.getElementById('movieRating').value) || 0
    };

    if (editingId) {
        // Запрос на обновление (PUT)
        await fetch(`/api/movies/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movieData)
        });
    } else {
        // Запрос на создание (POST)
        await fetch('/api/movies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movieData)
        });
    }

    closeModal();
    e.target.reset();
    fetchMovies(); // Перезапрашиваем актуальные данные с сервера
});

// ===== Фильтры =====
['searchInput', 'genreFilter', 'directorFilter', 'statusFilter', 'sortFilter'].forEach(id => {
    document.getElementById(id).addEventListener('input', renderCatalog);
});

// ===== Быстрый поиск на главной =====
document.getElementById('homeSearch').addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 0) {
        document.getElementById('searchInput').value = query;
        goToCatalog();
    }
});

// ===== Тема =====
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('moviehelper-theme') || 'dark';
if (savedTheme === 'light') {
    document.body.classList.add('light');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('moviehelper-theme', isLight ? 'light' : 'dark');
});

// ===== Инициализация =====
updateDirectorFilter();
renderHome();
renderCatalog();