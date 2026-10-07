let currentUser = null;
let movies = [];

// ===== Регистрация =====
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.getElementById('registerError');
    errorBox.classList.add('hidden');

    const username = document.getElementById('registerUsername').value.trim();
    const displayName = document.getElementById('registerDisplayName').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    if (password !== passwordConfirm) {
        return showError(errorBox, 'Пароли не совпадают');
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, displayName, password })
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Ошибка регистрации');

        currentUser = data;
        await fetchMovies(); // Загружаем коллекцию с сервера
        loginSuccess(username);
    } catch (err) {
        showError(errorBox, err.message);
    }
});

// ===== Вход =====
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.getElementById('loginError');
    errorBox.classList.add('hidden');

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Ошибка входа');

        currentUser = data;
        await fetchMovies();
        loginSuccess(username);
    } catch (err) {
        showError(errorBox, err.message);
    }
});

function showError(box, text) {
    box.textContent = '⚠️ ' + text;
    box.classList.remove('hidden');
}

function loginSuccess(username) {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    updateUserUI();
    updateAllFilters();

    const savedTheme = localStorage.getItem('moviehelper-theme-' + username) || 'dark';
    document.body.classList.toggle('light', savedTheme === 'light');
    document.getElementById('themeToggle').textContent = savedTheme === 'light' ? '☀️' : '🌙';
}

// ===== Выход =====
async function logout() {
    if (!confirm('Выйти из аккаунта?')) return;
    await fetch('/api/logout', { method: 'POST' });
    currentUser = null;
    movies = [];
    document.getElementById('app').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    document.getElementById('userDropdown').classList.add('hidden');
}

// ===== Получение коллекции =====
async function fetchMovies() {
    const response = await fetch('/api/movies');
    if (response.ok) {
        movies = await response.json();
        renderHome();
        renderCatalog();
        updateAllFilters();
        if (!document.getElementById('analytics').classList.contains('hidden')) {
            renderAnalytics();
        }
    }
}
// ===== Обновление интерфейса =====
function updateUserUI() {
    if (!currentUser) return;
    const letter = currentUser.displayName.charAt(0).toUpperCase();
    document.getElementById('userAvatar').textContent = letter;
    document.getElementById('userName').textContent = currentUser.displayName;
    document.getElementById('dropdownAvatar').textContent = letter;
    document.getElementById('dropdownName').textContent = currentUser.displayName;
    document.getElementById('dropdownLogin').textContent = '@' + currentUser.username;
    document.getElementById('heroUserName').textContent = currentUser.displayName;
}

// ===== Табы авторизации =====
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.getElementById('loginForm').classList.toggle('hidden', target !== 'login');
        document.getElementById('registerForm').classList.toggle('hidden', target !== 'register');
        document.getElementById('loginError').classList.add('hidden');
        document.getElementById('registerError').classList.add('hidden');
    });
});

// ===== Меню пользователя =====
document.getElementById('userBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('userDropdown').classList.toggle('hidden');
});
document.addEventListener('click', () => {
    document.getElementById('userDropdown').classList.add('hidden');
});

// ===== Проверка сессии при запуске =====
(async function init() {
    try {
        const response = await fetch('/api/me');
        if (response.ok) {
            currentUser = await response.json();
            await fetchMovies();
            loginSuccess(currentUser.username);
        } else {
            document.getElementById('authScreen').classList.remove('hidden');
            document.getElementById('app').classList.add('hidden');
        }
    } catch (err) {
        document.getElementById('authScreen').classList.remove('hidden');
    }
})();
// ============================================
//  ОСНОВНАЯ ЛОГИКА (как было)
// ============================================
const typeLabels = {
    movie: '🎬 Фильм',
    series: '📺 Сериал',
    documentary: '🎥 Документальный'
};
const statusLabels = {
    watched: 'Просмотрено',
    watching: 'В процессе',
    planned: 'В планах'
};
function formatRating(rating) {
    if (!rating || rating <= 0) return '—';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}
function updateAllFilters() {
    const directors = [...new Set(movies.map(m => m.director).filter(Boolean))].sort();
    const dirFilter = document.getElementById('directorFilter');
    const dirCurrent = dirFilter.value;
    dirFilter.innerHTML = '<option value="">Все режиссёры</option>' +
        directors.map(d => `<option value="${d}">${d}</option>`).join('');
    if (directors.includes(dirCurrent)) dirFilter.value = dirCurrent;
    const genres = [...new Set(movies.flatMap(m => (m.genre || '').split(',').map(g => g.trim())).filter(Boolean))].sort();
    const genFilter = document.getElementById('genreFilter');
    const genCurrent = genFilter.value;
    genFilter.innerHTML = '<option value="">Все жанры</option>' +
        genres.map(g => `<option value="${g}">${g}</option>`).join('');
    if (genres.includes(genCurrent)) genFilter.value = genCurrent;
    const tags = [...new Set(movies.flatMap(m => m.tags || []))].sort();
    const tagFilter = document.getElementById('tagFilter');
    const tagCurrent = tagFilter.value;
    tagFilter.innerHTML = '<option value="">Все теги</option>' +
        tags.map(t => `<option value="${t}">${t}</option>`).join('');
    if (tags.includes(tagCurrent)) tagFilter.value = tagCurrent;
}
function movieCardHTML(m) {
    const tagsHTML = (m.tags || []).slice(0, 2).map(t => `<span class="movie-tag">${t}</span>`).join('');
    const ratingHTML = m.rating > 0 ? formatRating(m.rating) : '—';
    return `
        <div class="movie-card" onclick="openMovieDetail(${m.id})">
            <span class="type-badge">${typeLabels[m.type] || '🎬'}</span>
            ${m.poster 
                ? `<img src="${m.poster}" class="movie-poster" alt="${m.title}" onerror="this.style.display='none'; this.parentElement.querySelector('.poster-fallback').style.display='flex'">` 
                : ''}
            <div class="movie-poster poster-fallback" style="${m.poster ? 'display:none' : ''}">🎬</div>
            <div class="movie-info">
                <div class="movie-title">${m.title}</div>
                <div class="movie-meta">
                    <span>${m.year} • ${(m.genre || '').split(',')[0].trim()}</span>
                    <span class="movie-rating">${ratingHTML}</span>
                </div>
                <div class="movie-director">🎬 ${m.director || '—'}</div>
                ${tagsHTML ? `<div class="movie-tags">${tagsHTML}</div>` : ''}
                <span class="movie-status status-${m.status}">${statusLabels[m.status]}</span>
            </div>
            <div class="movie-actions">
                <button class="btn-delete" onclick="event.stopPropagation(); deleteMovie(${m.id})">Удалить</button>
            </div>
        </div>
    `;
}
function renderHome() {
    document.getElementById('homeTotal').textContent = movies.length;
    document.getElementById('homeWatched').textContent = movies.filter(m => m.status === 'watched').length;
    document.getElementById('homePlanned').textContent = movies.filter(m => m.status === 'planned').length;
    document.getElementById('homeWatching').textContent = movies.filter(m => m.status === 'watching').length;
    document.getElementById('plannedCount').textContent = movies.filter(m => m.status === 'planned').length;
    const rated = movies.filter(m => m.rating > 0);
    const avg = rated.length ? (rated.reduce((s, m) => s + m.rating, 0) / rated.length).toFixed(1) : '—';
    document.getElementById('homeRating').textContent = avg;
    const continueWatching = movies.filter(m => m.status === 'watching');
    document.getElementById('continueWatching').innerHTML = continueWatching.length
        ? continueWatching.map(movieCardHTML).join('')
        : '<p style="color:var(--text-secondary); padding:20px;">Нет фильмов «в процессе»</p>';
    const unfinished = movies.filter(m =>
        (m.type === 'series' || m.type === 'documentary') &&
        m.status === 'watching' &&
        m.episodes && m.watchedEpisodes < m.episodes * m.seasons
    );
    document.getElementById('unfinishedList').innerHTML = unfinished.length
        ? unfinished.map(m => {
            const total = m.episodes * m.seasons;
            const percent = (m.watchedEpisodes / total) * 100;
            return `
                <div class="unfinished-item" onclick="openMovieDetail(${m.id})">
                    <span style="font-size:24px;">📺</span>
                    <div class="unfinished-title">${m.title}</div>
                    <div class="unfinished-progress">${m.watchedEpisodes}/${total} серий</div>
                    <div class="unfinished-progress-bar">
                        <div class="unfinished-progress-fill" style="width:${percent}%"></div>
                    </div>
                </div>
            `;
        }).join('')
        : '<p style="color:var(--text-secondary); padding:20px;">Все сериалы досмотрены </p>';
}
function renderCatalog() {
    const catalog = document.getElementById('catalog');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const type = document.getElementById('typeFilter').value;
    const genre = document.getElementById('genreFilter').value;
    const director = document.getElementById('directorFilter').value;
    const tag = document.getElementById('tagFilter').value;
    const status = document.getElementById('statusFilter').value;
    const sort = document.getElementById('sortFilter').value;
    let filtered = movies.filter(m => {
        const searchStr = [
            m.title, m.director, m.actors, m.description,
            ...(m.tags || []), m.genre
        ].join(' ').toLowerCase();
        const matchSearch = !search || searchStr.includes(search);
        const matchType = !type || m.type === type;
        const matchGenre = !genre || (m.genre || '').includes(genre);
        const matchDirector = !director || m.director === director;
        const matchTag = !tag || (m.tags || []).includes(tag);
        const matchStatus = !status || m.status === status;
        return matchSearch && matchType && matchGenre && matchDirector && matchTag && matchStatus;
    });
    if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));
    else filtered.sort((a, b) => b.id - a.id);
    catalog.innerHTML = filtered.length
        ? filtered.map(movieCardHTML).join('')
        : '<p style="color:var(--text-secondary); grid-column: 1/-1; text-align:center; padding:40px;">Ничего не найдено 😢</p>';
}
function goToCatalog(statusFilter = null) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-page="catalog"]').classList.add('active');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('catalogPage').classList.remove('hidden');
    document.getElementById('analytics').classList.add('hidden');
    document.getElementById('movieDetail').classList.add('hidden');
    document.getElementById('profilePage').classList.add('hidden');
    if (statusFilter) document.getElementById('statusFilter').value = statusFilter;
    renderCatalog();
}
function openMovieDetail(id) {
    const m = movies.find(m => m.id === id);
    if (!m) return;
    const ratingStars = m.rating > 0
        ? '<span style="letter-spacing:2px;">' + formatRating(m.rating) + '</span>'
        : '<span style="color:var(--text-secondary);font-size:16px;">Оценка не выставлена</span>';
    const tagsHTML = (m.tags || []).length
        ? `<div class="detail-section">
            <h3>🏷️ Теги</h3>
            <div class="detail-tags">${m.tags.map(t => `<span class="detail-tag">${t}</span>`).join('')}</div>
           </div>`
        : '';
    let seriesHTML = '';
    if ((m.type === 'series' || m.type === 'documentary') && m.episodes && m.seasons) {
        const total = m.episodes * m.seasons;
        const watched = m.watchedEpisodes || 0;
        const percent = (watched / total) * 100;
        seriesHTML = `
            <div class="detail-section">
                <h3> Прогресс просмотра</h3>
                <p>${watched} из ${total} серий (${m.seasons} сезон(ов) × ${m.episodes})</p>
                <div class="progress-bar-detail">
                    <div class="progress-fill-detail" style="width:${percent}%"></div>
                </div>
            </div>
        `;
    }
    const reviewHTML = m.review
        ? `<div class="detail-section">
            <h3>💬 Рецензия</h3>
            <p>${m.review}</p>
           </div>`
        : '';
    document.getElementById('movieDetail').innerHTML = `
        <button class="back-btn" onclick="closeMovieDetail()">← Назад</button>
        <div class="detail-grid">
            <div>
                ${m.poster 
                    ? `<img src="${m.poster}" class="detail-poster" alt="${m.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">` 
                    : ''}
                <div class="detail-poster" style="${m.poster ? 'display:none' : ''}"></div>
            </div>
            <div class="detail-content">
                <span style="font-size:14px; color:var(--text-secondary);">${typeLabels[m.type]}</span>
                <h1>${m.title}</h1>
                <div class="detail-meta">
                    <span>📅 ${m.year}</span>
                    <span>🎭 ${m.genre}</span>
                    <span>🎬 ${m.director || '—'}</span>
                    ${m.duration ? `<span>⏱ ${m.duration} мин</span>` : ''}
                </div>
                <span class="detail-status status-${m.status}">${statusLabels[m.status]}</span>
                <div class="detail-rating">${ratingStars}</div>
                ${m.actors ? `<div class="detail-section"><h3>🎭 Актёры</h3><p>${m.actors}</p></div>` : ''}
                ${m.description ? `<div class="detail-section"><h3>📖 Описание</h3><p>${m.description}</p></div>` : ''}
                ${tagsHTML}
                ${seriesHTML}
                ${reviewHTML}
                <div class="detail-actions">
                    <button class="btn-edit" onclick="editMovie(${m.id})">✏️ Редактировать</button>
                    <button class="btn-delete-detail" onclick="deleteMovieFromDetail(${m.id})">🗑 Удалить</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('home').classList.add('hidden');
    document.getElementById('catalogPage').classList.add('hidden');
    document.getElementById('analytics').classList.add('hidden');
    document.getElementById('profilePage').classList.add('hidden');
    document.getElementById('movieDetail').classList.remove('hidden');
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
    if (!confirm('Удалить?')) return;
    await fetch(`/api/movies/${id}`, { method: 'DELETE' });
    fetchMovies();
    closeMovieDetail();
}

async function deleteMovie(id) {
    if (!confirm('Удалить?')) return;
    await fetch(`/api/movies/${id}`, { method: 'DELETE' });
    fetchMovies();
}
// ===== Модальное окно =====
let currentTags = [];
let currentRating = 0;
let editingId = null;
function openModal() {
    currentTags = [];
    currentRating = 0;
    editingId = null;
    document.getElementById('addForm').reset();
    document.getElementById('modalTitle').textContent = 'Добавить';
    document.getElementById('tagsContainer').innerHTML = '';
    updateStarDisplay(0);
    document.getElementById('seriesFields').classList.add('hidden');
    document.getElementById('tmdbResults').innerHTML = '';
    document.getElementById('tmdbSearchInput').value = '';
    // Разворачиваем форму при открытии модалки
    const wrapper = document.getElementById('manualFormWrapper');
    const btn = document.getElementById('toggleFormBtn');
    wrapper.classList.remove('collapsed');
    btn.classList.remove('collapsed');
    document.getElementById('modal').classList.remove('hidden');
}
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    editingId = null;
    currentTags = [];
    currentRating = 0;
}
// ===== Кнопка сворачивания/разворачивания формы =====
document.getElementById('toggleFormBtn').addEventListener('click', () => {
    const wrapper = document.getElementById('manualFormWrapper');
    const btn = document.getElementById('toggleFormBtn');
    wrapper.classList.toggle('collapsed');
    btn.classList.toggle('collapsed');
});
document.getElementById('movieType').addEventListener('change', (e) => {
    const isSeries = e.target.value === 'series' || e.target.value === 'documentary';
    document.getElementById('seriesFields').classList.toggle('hidden', !isSeries);
});
// ===== TMDB =====
async function searchTMDB() {
    const query = document.getElementById('tmdbSearchInput').value.trim();
    if (!query) return;
    const resultsBox = document.getElementById('tmdbResults');
    const btn = document.getElementById('tmdbSearchBtn');

    btn.disabled = true;
    btn.textContent = '...';
    resultsBox.innerHTML = '<div class="tmdb-loading">🔍 Ищем...</div>';

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Ничего не найдено');
        const data = await response.json();

        // Автозаполнение полей формы из ответа сервера
        document.getElementById('movieTitle').value = data.title || '';
        document.getElementById('movieYear').value = data.year || '';
        document.getElementById('movieDirector').value = data.director || '';
        document.getElementById('movieGenre').value = data.genre || '';
        document.getElementById('movieActors').value = data.actors || '';
        document.getElementById('movieDescription').value = data.description || '';
        document.getElementById('moviePoster').value = data.poster || '';

        resultsBox.innerHTML = '<div class="tmdb-loading">✅ Данные заполнены!</div>';
        setTimeout(() => { resultsBox.innerHTML = ''; }, 2000);

    } catch (err) {
        resultsBox.innerHTML = `<div class="tmdb-empty">${err.message}</div>`;
    } finally {
        btn.disabled = false;
        btn.textContent = 'Найти';
    }
}
async function selectTMDBResult(encodedJson) {
    const item = JSON.parse(encodedJson);
    const mediaType = item._mediaType;
    const id = item.id;
    const resultsBox = document.getElementById('tmdbResults');
    resultsBox.innerHTML = '<div class="tmdb-loading">📥 Загружаем детали...</div>';
    try {
        const [detailsRes, creditsRes] = await Promise.all([
            fetch(`${TMDB_BASE}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=ru-RU`),
            fetch(`${TMDB_BASE}/${mediaType}/${id}/credits?api_key=${TMDB_API_KEY}&language=ru-RU`)
        ]);
        const details = await detailsRes.json();
        const credits = await creditsRes.json();
        document.getElementById('movieType').value = mediaType === 'movie' ? 'movie' : 'series';
        document.getElementById('movieTitle').value = details.title || details.name || '';
        document.getElementById('movieYear').value = (details.release_date || details.first_air_date || '').slice(0, 4);
        let director = '';
        if (mediaType === 'movie') {
            const dir = (credits.crew || []).find(c => c.job === 'Director');
            director = dir ? dir.name : '';
        } else {
            director = (details.created_by || []).map(c => c.name).join(', ');
        }
        document.getElementById('movieDirector').value = director || 'Не указан';
        document.getElementById('movieGenre').value = (details.genres || []).map(g => g.name).join(', ');
        document.getElementById('movieActors').value = (credits.cast || []).slice(0, 5).map(a => a.name).join(', ');
        document.getElementById('moviePoster').value = details.poster_path ? TMDB_IMG + details.poster_path : '';
        document.getElementById('movieDescription').value = details.overview || '';
        if (mediaType === 'movie' && details.runtime) {
            document.getElementById('movieDuration').value = details.runtime;
        } else if (mediaType === 'tv' && details.episode_run_time?.length) {
            document.getElementById('movieDuration').value = details.episode_run_time[0];
        }
        if (mediaType === 'tv') {
            document.getElementById('seriesFields').classList.remove('hidden');
            document.getElementById('movieSeasons').value = details.number_of_seasons || 1;
            document.getElementById('movieEpisodes').value = details.number_of_episodes
                ? Math.round(details.number_of_episodes / (details.number_of_seasons || 1))
                : 10;
            document.getElementById('movieWatchedEpisodes').value = 0;
        }
        resultsBox.innerHTML = '<div class="tmdb-loading">✅ Данные заполнены! Проверь поля ниже</div>';
        setTimeout(() => { resultsBox.innerHTML = ''; }, 2000);
    } catch (err) {
        console.error(err);
        resultsBox.innerHTML = '<div class="tmdb-empty">Ошибка загрузки</div>';
    }
}
document.getElementById('tmdbSearchBtn').addEventListener('click', searchTMDB);
document.getElementById('tmdbSearchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchTMDB();
    }
});
// ===== Теги =====
function renderTags() {
    document.getElementById('tagsContainer').innerHTML = currentTags
        .map((t, i) => `<span class="tag-chip">${t} <button type="button" onclick="removeTag(${i})">×</button></span>`)
        .join('');
}
function removeTag(index) {
    currentTags.splice(index, 1);
    renderTags();
}
document.getElementById('tagInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const value = e.target.value.trim();
        if (value && !currentTags.includes(value)) {
            currentTags.push(value);
            renderTags();
        }
        e.target.value = '';
    }
});
// ===== Звёзды =====
function updateStarDisplay(rating) {
    document.querySelectorAll('#starRating span').forEach(star => {
        const val = parseInt(star.dataset.star);
        star.classList.toggle('active', val <= rating);
    });
}
document.querySelectorAll('#starRating span').forEach(star => {
    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.star);
        updateStarDisplay(currentRating);
    });
    star.addEventListener('mouseenter', () => updateStarDisplay(parseInt(star.dataset.star)));
});
document.getElementById('starRating').addEventListener('mouseleave', () => updateStarDisplay(currentRating));
// ===== Редактирование =====
function editMovie(id) {
    const m = movies.find(x => x.id === id);
    if (!m) return;
    editingId = id;
    currentTags = [...(m.tags || [])];
    currentRating = m.rating || 0;
    document.getElementById('modalTitle').textContent = 'Редактировать';
    document.getElementById('movieType').value = m.type || 'movie';
    document.getElementById('movieTitle').value = m.title;
    document.getElementById('movieYear').value = m.year;
    document.getElementById('movieDirector').value = m.director || '';
    document.getElementById('movieGenre').value = m.genre || '';
    document.getElementById('movieActors').value = m.actors || '';
    document.getElementById('moviePoster').value = m.poster || '';
    document.getElementById('movieDescription').value = m.description || '';
    document.getElementById('movieDuration').value = m.duration || '';
    document.getElementById('movieStatus').value = m.status;
    document.getElementById('movieReview').value = m.review || '';
    if (m.type === 'series' || m.type === 'documentary') {
        document.getElementById('seriesFields').classList.remove('hidden');
        document.getElementById('movieSeasons').value = m.seasons || 1;
        document.getElementById('movieEpisodes').value = m.episodes || 1;
        document.getElementById('movieWatchedEpisodes').value = m.watchedEpisodes || 0;
    } else {
        document.getElementById('seriesFields').classList.add('hidden');
    }
    renderTags();
    updateStarDisplay(currentRating);
    document.getElementById('modal').classList.remove('hidden');
}
// ===== Отправка формы =====
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('movieType').value;
    const isSeries = type === 'series' || type === 'documentary';

    const data = {
        type,
        title: document.getElementById('movieTitle').value,
        year: parseInt(document.getElementById('movieYear').value),
        director: document.getElementById('movieDirector').value,
        genre: document.getElementById('movieGenre').value,
        actors: document.getElementById('movieActors').value,
        poster: document.getElementById('moviePoster').value,
        description: document.getElementById('movieDescription').value,
        duration: parseInt(document.getElementById('movieDuration').value) || 0,
        tags: [...currentTags],
        status: document.getElementById('movieStatus').value,
        rating: currentRating,
        review: document.getElementById('movieReview').value
    };

    if (isSeries) {
        data.seasons = parseInt(document.getElementById('movieSeasons').value) || 1;
        data.episodes = parseInt(document.getElementById('movieEpisodes').value) || 1;
        data.watchedEpisodes = parseInt(document.getElementById('movieWatchedEpisodes').value) || 0;
    }

    if (editingId) {
        await fetch(`/api/movies/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } else {
        await fetch('/api/movies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    fetchMovies();
    closeModal();
    e.target.reset();
});
// ===== Навигация =====
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const page = btn.dataset.page;
        if (page === 'add') {
            openModal();
            btn.classList.remove('active');
            const currentPage = document.querySelector('.nav-btn.active')?.dataset.page || 'home';
            document.querySelector(`[data-page="${currentPage}"]`).classList.add('active');
            return;
        }
        document.getElementById('home').classList.toggle('hidden', page !== 'home');
        document.getElementById('catalogPage').classList.toggle('hidden', page !== 'catalog');
        document.getElementById('analytics').classList.toggle('hidden', page !== 'analytics');
        document.getElementById('movieDetail').classList.add('hidden');
        document.getElementById('profilePage').classList.add('hidden');
        if (page === 'analytics') renderAnalytics();
        if (page === 'home') renderHome();
    });
});
// ===== Аналитика =====
let genreChartInstance = null;
let typeChartInstance = null;
function renderAnalytics() {
    document.getElementById('totalCount').textContent = movies.length;
    document.getElementById('watchedCount').textContent = movies.filter(m => m.status === 'watched').length;
    const totalMinutes = movies.filter(m => m.status === 'watched').reduce((sum, m) => sum + (m.duration || 0), 0);
    document.getElementById('hoursMonth').textContent = Math.round(totalMinutes / 60 / 12 * 10) / 10;
    const totalWatchedEpisodes = movies
        .filter(m => m.type === 'series' || m.type === 'documentary')
        .reduce((sum, m) => sum + (m.watchedEpisodes || 0), 0);
    document.getElementById('episodesWeek').textContent = Math.round(totalWatchedEpisodes / 12 * 10) / 10;
    const rated = movies.filter(m => m.rating > 0);
    const avg = rated.length ? (rated.reduce((s, m) => s + m.rating, 0) / rated.length).toFixed(1) : '0';
    document.getElementById('avgRating').textContent = avg;
    const genreCount = {};
    movies.forEach(m => {
        (m.genre || '').split(',').forEach(g => {
            const clean = g.trim();
            if (clean) genreCount[clean] = (genreCount[clean] || 0) + 1;
        });
    });
    drawPieChart('genrePieChart', genreCount, (inst) => genreChartInstance = inst, genreChartInstance);
    const typeCount = {};
    movies.forEach(m => {
        const label = typeLabels[m.type] || 'Другое';
        typeCount[label] = (typeCount[label] || 0) + 1;
    });
    drawPieChart('typePieChart', typeCount, (inst) => typeChartInstance = inst, typeChartInstance);
    const directorCount = {};
    movies.forEach(m => { if (m.director) directorCount[m.director] = (directorCount[m.director] || 0) + 1; });
    renderBarChart('directorChart', directorCount);
    renderUnfinishedReport();
}
function drawPieChart(canvasId, dataObj, setInstance, existingInstance) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (existingInstance) existingInstance.destroy();
    const labels = Object.keys(dataObj);
    const values = Object.values(dataObj);
    const colors = ['#ff6b6b', '#ffa94d', '#ffd93d', '#6bcf7f', '#4dabf7', '#b197fc', '#f783ac', '#63e6be', '#ff922b', '#20c997'];
    const instance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{ data: values, backgroundColor: colors.slice(0, labels.length), borderWidth: 0 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text').trim(),
                        padding: 12,
                        font: { size: 12 }
                    }
                }
            }
        }
    });
    setInstance(instance);
}
function renderBarChart(elementId, dataObject) {
    const container = document.getElementById(elementId);
    const entries = Object.entries(dataObject).sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
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
function renderUnfinishedReport() {
    const container = document.getElementById('unfinishedReport');
    const unfinished = movies.filter(m => {
        if (m.type !== 'series' && m.type !== 'documentary') return false;
        if (m.status === 'watched') return false;
        if (!m.episodes || !m.seasons) return false;
        const total = m.episodes * m.seasons;
        return (m.watchedEpisodes || 0) < total;
    }).map(m => {
        const total = m.episodes * m.seasons;
        const watched = m.watchedEpisodes || 0;
        return { ...m, total, watched, left: total - watched, percent: (watched / total) * 100 };
    }).sort((a, b) => a.percent - b.percent);
    if (!unfinished.length) {
        container.innerHTML = '<p style="color:var(--text-secondary); padding:20px;">Все сериалы досмотрены 🎉</p>';
        return;
    }
    container.innerHTML = unfinished.map(m => {
        const severity = m.percent < 30 ? 'danger' : 'warning';
        const emoji = m.percent < 30 ? '🔴' : '🟡';
        return `
            <div class="report-item ${severity}" onclick="openMovieDetail(${m.id})" style="cursor:pointer;">
                <span style="font-size:24px;">${emoji}</span>
                <div class="report-title">${m.title}</div>
                <div class="report-info">Осталось ${m.left} из ${m.total} серий · ${Math.round(m.percent)}% просмотрено</div>
            </div>
        `;
    }).join('');
}
// ===== Фильтры =====
['searchInput', 'typeFilter', 'genreFilter', 'directorFilter', 'tagFilter', 'statusFilter', 'sortFilter']
    .forEach(id => document.getElementById(id).addEventListener('input', renderCatalog));
document.getElementById('homeSearch').addEventListener('input', (e) => {
    if (e.target.value.length > 0) {
        document.getElementById('searchInput').value = e.target.value;
        goToCatalog();
    }
});
// ===== Тема =====
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    if (currentUser) {
        localStorage.setItem('moviehelper-theme-' + currentUser.username, isLight ? 'light' : 'dark');
    }
    if (!document.getElementById('analytics').classList.contains('hidden')) {
        renderAnalytics();
    }
});
// ===== Профиль =====
function showProfile() {
    document.getElementById('userDropdown').classList.add('hidden');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('catalogPage').classList.add('hidden');
    document.getElementById('analytics').classList.add('hidden');
    document.getElementById('movieDetail').classList.add('hidden');
    document.getElementById('profilePage').classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('profileAvatar').textContent = currentUser.displayName.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent = currentUser.displayName;
    document.getElementById('profileLogin').textContent = currentUser.username;
    document.getElementById('profileSince').textContent = new Date(currentUser.createdAt).toLocaleDateString('ru-RU');
    document.getElementById('profileTotal').textContent = movies.length;
    document.getElementById('profileWatched').textContent = movies.filter(m => m.status === 'watched').length;
    const rated = movies.filter(m => m.rating > 0);
    const avg = rated.length ? (rated.reduce((s, m) => s + m.rating, 0) / rated.length).toFixed(1) : '—';
    document.getElementById('profileRating').textContent = avg;
}
function closeProfile() {
    document.getElementById('profilePage').classList.add('hidden');
    document.getElementById('home').classList.remove('hidden');
    document.querySelector('[data-page="home"]').classList.add('active');
    renderHome();
}
function editProfile() {
    document.getElementById('editDisplayName').value = currentUser.displayName;
    document.getElementById('profileModal').classList.remove('hidden');
}
function closeProfileModal() {
    document.getElementById('profileModal').classList.add('hidden');
}
document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newName = document.getElementById('editDisplayName').value.trim();
    if (newName.length < 2) return;

    await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: newName })
    });

    currentUser.displayName = newName;
    updateUserUI();
    showProfile();
    closeProfileModal();
});
// ===== Инициализация при загрузке =====
(function init() {
    const savedUser = localStorage.getItem(LS_CURRENT);
    const users = getUsers();
    if (savedUser && users[savedUser]) {
        loginUser(savedUser);
    } else {
        // Показываем экран авторизации
        document.getElementById('authScreen').classList.remove('hidden');
        document.getElementById('app').classList.add('hidden');
    }
})();