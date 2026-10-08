let currentUser = null;
let movies = [];

// ===== Примеры фильмов и сериалов =====
const sampleMovies = [
    { type: 'movie', title: 'Начало', year: 2010, director: 'Кристофер Нолан', genre: 'Фантастика, Триллер, Боевик', actors: 'Леонардо ДиКаприо, Джозеф Гордон-Левитт, Эллен Пейдж', poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', description: 'Дом Кобб — талантливый вор, лучший из лучших в опасном искусстве извлечения.', duration: 148, collection: 'Нолан', tags: ['шедевр', 'фантастика'], status: 'watched', rating: 5, review: 'Потрясающий фильм!', favorite: true },
    { type: 'movie', title: 'Интерстеллар', year: 2014, director: 'Кристофер Нолан', genre: 'Фантастика, Драма', actors: 'Мэттью МакКонахи, Энн Хэтэуэй', poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', description: 'Группа исследователей отправляется в путешествие через червоточину.', duration: 169, collection: 'Нолан', tags: ['космос', 'эпичный'], status: 'watched', rating: 5, review: '', favorite: true },
    { type: 'movie', title: 'Тёмный рыцарь', year: 2008, director: 'Кристофер Нолан', genre: 'Боевик, Триллер, Драма', actors: 'Кристиан Бэйл, Хит Леджер', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', description: 'Бэтмен поднимает ставки в войне с криминалом.', duration: 152, collection: 'Тёмный рыцарь', tags: ['супергерои', 'DC'], status: 'watched', rating: 5, review: '', favorite: false },
    { type: 'movie', title: 'Матрица', year: 1999, director: 'Лана Вачовски', genre: 'Фантастика, Боевик', actors: 'Киану Ривз, Лоуренс Фишберн', poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', description: 'Хакер Нео узнаёт правду о реальности.', duration: 136, collection: 'Матрица', tags: ['классика', 'философия'], status: 'watched', rating: 5, review: '', favorite: true },
    { type: 'movie', title: 'Бойцовский клуб', year: 1999, director: 'Дэвид Финчер', genre: 'Триллер, Драма', actors: 'Брэд Питт, Эдвард Нортон', poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', description: 'Клерк знакомится с Тайлером Дёрденом.', duration: 139, collection: '', tags: ['психология', 'культовый'], status: 'watched', rating: 5, review: '', favorite: false },
    { type: 'movie', title: 'Форрест Гамп', year: 1994, director: 'Роберт Земекис', genre: 'Драма, Мелодрама', actors: 'Том Хэнкс, Робин Райт', poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', description: 'История жизни Форреста Гампа.', duration: 142, collection: '', tags: ['вдохновляющий', 'драма'], status: 'watched', rating: 5, review: '', favorite: true },
    { type: 'movie', title: 'Дюна', year: 2021, director: 'Дени Вильнёв', genre: 'Фантастика, Приключения', actors: 'Тимоти Шаламе, Ребекка Фергюсон', poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', description: 'Пол Атрейдес отправляется на Арракис.', duration: 155, collection: 'Дюна', tags: ['эпичный', 'фантастика'], status: 'watched', rating: 4, review: '', favorite: false },
    { type: 'movie', title: 'Дюна: Часть вторая', year: 2024, director: 'Дени Вильнёв', genre: 'Фантастика, Приключения', actors: 'Тимоти Шаламе, Зендея', poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nez7S.jpg', description: 'Пол объединяется с фременами.', duration: 166, collection: 'Дюна', tags: ['эпичный', 'фантастика'], status: 'planned', rating: 0, review: '', favorite: false },
    { type: 'movie', title: 'Джон Уик', year: 2014, director: 'Чад Стахелски', genre: 'Боевик, Триллер', actors: 'Киану Ривз', poster: 'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg', description: 'Бывший наёмник возвращается к активной жизни.', duration: 101, collection: 'Джон Уик', tags: ['боевик', 'экшн'], status: 'watched', rating: 4, review: '', favorite: false },
    { type: 'movie', title: 'Оппенгеймер', year: 2023, director: 'Кристофер Нолан', genre: 'Драма, Исторический', actors: 'Киллиан Мёрфи, Эмили Блант', poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', description: 'История Роберта Оппенгеймера.', duration: 180, collection: 'Нолан', tags: ['история', 'биография'], status: 'planned', rating: 0, review: '', favorite: true },
    { type: 'series', title: 'Во все тяжкие', year: 2008, director: 'Винс Гиллиган', genre: 'Драма, Триллер, Криминал', actors: 'Брайан Крэнстон, Аарон Пол', poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', description: 'Учитель химии начинает варить метамфетамин.', duration: 47, collection: '', tags: ['культовый', 'драма'], status: 'watched', rating: 5, review: '', favorite: true, seasons: 5, episodes: 13, watchedEpisodes: 62 },
    { type: 'series', title: 'Игра престолов', year: 2011, director: 'Дэвид Бениофф', genre: 'Фэнтези, Драма', actors: 'Эмилия Кларк, Питер Динклэйдж', poster: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', description: 'Борьба за Железный трон.', duration: 57, collection: '', tags: ['фэнтези', 'эпичный'], status: 'watched', rating: 4, review: '', favorite: false, seasons: 8, episodes: 10, watchedEpisodes: 73 },
    { type: 'series', title: 'Очень странные дела', year: 2016, director: 'Братья Даффер', genre: 'Фантастика, Ужасы', actors: 'Милли Бобби Браун', poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', description: 'Исчезновение мальчика раскрывает тайны.', duration: 51, collection: '', tags: ['ностальгия', '80-е'], status: 'watching', rating: 4, review: '', favorite: true, seasons: 4, episodes: 9, watchedEpisodes: 25 },
    { type: 'series', title: 'Чернобыль', year: 2019, director: 'Йохан Ренк', genre: 'Драма, Исторический', actors: 'Джаред Харрис', poster: 'https://image.tmdb.org/t/p/w500/hlLXt2tUzOv86Y857V8rN7h8w.jpg', description: 'Крупнейшая техногенная катастрофа.', duration: 60, collection: '', tags: ['история', 'драма'], status: 'watched', rating: 5, review: '', favorite: true, seasons: 1, episodes: 5, watchedEpisodes: 5 },
    { type: 'series', title: 'Рик и Морти', year: 2013, director: 'Дэн Хармон', genre: 'Мультсериал, Фантастика', actors: 'Джастин Ройланд', poster: 'https://image.tmdb.org/t/p/w500/cvhNj9eoRBe5SxjCbQTkh05UP5K.jpg', description: 'Путешествия по вселенным.', duration: 23, collection: '', tags: ['мультфильм', 'юмор'], status: 'watching', rating: 5, review: '', favorite: false, seasons: 7, episodes: 10, watchedEpisodes: 51 },
    { type: 'series', title: 'Дом Дракона', year: 2022, director: 'Райан Кондал', genre: 'Фэнтези, Драма', actors: 'Мэтт Смит, Эмма Д\'Арси', poster: 'https://image.tmdb.org/t/p/w500/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg', description: 'Гражданская война Таргариенов.', duration: 60, collection: '', tags: ['фэнтези', 'драконы'], status: 'watching', rating: 4, review: '', favorite: false, seasons: 2, episodes: 10, watchedEpisodes: 12 }
];

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
        await fetchMovies();
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
    // Сбрасываем табы авторизации
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginError').classList.add('hidden');
    document.getElementById('registerError').classList.add('hidden');
}

// ===== Получение коллекции =====
async function fetchMovies() {
    const response = await fetch('/api/movies');
    if (response.ok) {
        movies = await response.json();
        if (movies.length === 0) {
            await loadSampleMovies();
        }
        renderHome();
        renderCatalog();
        updateAllFilters();
        if (!document.getElementById('analytics').classList.contains('hidden')) {
            renderAnalytics();
        }
        if (!document.getElementById('collectionsPage').classList.contains('hidden')) {
            renderCollections();
            if (!document.getElementById('favoritesPage').classList.contains('hidden')) {
                renderFavorites();
            }
        }
    }
}

// ===== Загрузка примеров =====
async function loadSampleMovies() {
    try {
        for (const movie of sampleMovies) {
            await fetch('/api/movies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movie)
            });
        }
        const response = await fetch('/api/movies');
        if (response.ok) movies = await response.json();
    } catch (err) {
        console.error('Ошибка загрузки примеров:', err);
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
            // Гарантируем правильное начальное состояние
            document.getElementById('authScreen').classList.remove('hidden');
            document.getElementById('app').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('loginError').classList.add('hidden');
            document.getElementById('registerError').classList.add('hidden');
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
        }
    } catch (err) {
        document.getElementById('authScreen').classList.remove('hidden');
        document.getElementById('app').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
    }
})();

// ============================================
//  ОСНОВНАЯ ЛОГИКА
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

    const collections = [...new Set(movies.map(m => m.collection).filter(Boolean))].sort();
    const colFilter = document.getElementById('collectionFilter');
    if (colFilter) {
        const colCurrent = colFilter.value;
        colFilter.innerHTML = '<option value="">Все коллекции</option>' +
            collections.map(c => `<option value="${c}">${c}</option>`).join('');
        if (collections.includes(colCurrent)) colFilter.value = colCurrent;
    }

    const collectionList = document.getElementById('collectionList');
    if (collectionList) {
        collectionList.innerHTML = collections.map(c => `<option value="${c}">`).join('');
    }
}

function movieCardHTML(m) {
    const tagsHTML = (m.tags || []).slice(0, 2).map(t => `<span class="movie-tag">${t}</span>`).join('');
    const ratingHTML = m.rating > 0 ? formatRating(m.rating) : '—';
    const collectionHTML = m.collection ? `<div class="movie-collection">📦 ${m.collection}</div>` : '';
    const favoriteActive = m.favorite ? 'active' : '';
    const favoriteIcon = m.favorite ? '❤️' : '🤍';

    return `
        <div class="movie-card" onclick="openMovieDetail(${m.id})">
            <span class="type-badge">${typeLabels[m.type] || '🎬'}</span>
            <button class="favorite-btn ${favoriteActive}" onclick="event.stopPropagation(); toggleFavorite(${m.id})" title="Избранное">
                ${favoriteIcon}
            </button>
            ${m.poster 
                ? `<img src="${m.poster}" class="movie-poster" alt="${m.title}" onerror="this.style.display='none'; this.parentElement.querySelector('.poster-fallback').style.display='flex'">` 
                : ''}
            <div class="movie-poster poster-fallback" style="${m.poster ? 'display:none' : ''}"></div>
            <div class="movie-info">
                <div class="movie-title">${m.title}</div>
                <div class="movie-meta">
                    <span>${m.year} • ${(m.genre || '').split(',')[0].trim()}</span>
                    <span class="movie-rating">${ratingHTML}</span>
                </div>
                <div class="movie-director">🎬 ${m.director || '—'}</div>
                ${collectionHTML}
                ${tagsHTML ? `<div class="movie-tags">${tagsHTML}</div>` : ''}
                <span class="movie-status status-${m.status}" onclick="event.stopPropagation(); cycleStatus(${m.id})" title="Нажми чтобы изменить статус">
                    ${statusLabels[m.status]}
                </span>
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
    document.getElementById('homeFavorites').textContent = movies.filter(m => m.favorite).length;
    document.getElementById('homeFavorites').textContent = movies.filter(m => m.favorite).length;
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
        : '<p style="color:var(--text-secondary); padding:20px;">Все сериалы досмотрены 🎉</p>';
}

function renderCatalog() {
    const catalog = document.getElementById('catalog');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const type = document.getElementById('typeFilter').value;
    const genre = document.getElementById('genreFilter').value;
    const director = document.getElementById('directorFilter').value;
    const tag = document.getElementById('tagFilter').value;
    const collection = document.getElementById('collectionFilter').value;
    const status = document.getElementById('statusFilter').value;
    const sort = document.getElementById('sortFilter').value;

    let filtered = movies.filter(m => {
        const searchStr = [
            m.title, m.director, m.actors, m.description,
            ...(m.tags || []), m.genre, m.collection || ''
        ].join(' ').toLowerCase();
        const matchSearch = !search || searchStr.includes(search);
        const matchType = !type || m.type === type;
        const matchGenre = !genre || (m.genre || '').includes(genre);
        const matchDirector = !director || m.director === director;
        const matchTag = !tag || (m.tags || []).includes(tag);
        const matchCollection = !collection || m.collection === collection;
        const matchStatus = !status || m.status === status;
        return matchSearch && matchType && matchGenre && matchDirector && matchTag && matchCollection && matchStatus;
    });

    if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));
    else filtered.sort((a, b) => b.id - a.id);

    catalog.innerHTML = filtered.length
        ? filtered.map(movieCardHTML).join('')
        : '<p style="color:var(--text-secondary); grid-column: 1/-1; text-align:center; padding:40px;">Ничего не найдено 😢</p>';
}
function renderFavorites() {
    const catalog = document.getElementById('favoritesCatalog');
    const favorites = movies.filter(m => m.favorite);

    catalog.innerHTML = favorites.length
        ? favorites.map(movieCardHTML).join('')
        : '<p style="color:var(--text-secondary); grid-column:1/-1; text-align:center; padding:40px;">В избранном пока пусто ❤️</p>';
}
// ===== КОЛЛЕКЦИИ =====
function getCollections() {
    const collections = {};
    movies.forEach(m => {
        if (m.collection) {
            if (!collections[m.collection]) collections[m.collection] = [];
            collections[m.collection].push(m);
        }
    });
    return collections;
}

function renderCollections() {
    const grid = document.getElementById('collectionsGrid');
    const collections = getCollections();
    const collectionNames = Object.keys(collections).sort();

    if (collectionNames.length === 0) {
        grid.innerHTML = `
            <div class="collection-empty-state">
                <div class="empty-icon">📦</div>
                <p>У тебя пока нет коллекций</p>
                <p class="empty-hint">Создай первую коллекцию выше или добавь фильм с указанием коллекции</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = collectionNames.map(name => {
        const moviesInCollection = collections[name];
        const moviesHTML = moviesInCollection.map(m =>
            `<span class="collection-movie-chip" onclick="openMovieDetail(${m.id})">${m.title}</span>`
        ).join('');

        return `
            <div class="collection-card">
                <div class="collection-card-header">
                    <div class="collection-card-title">📦 ${name}</div>
                    <button class="btn-delete-collection" onclick="deleteCollection('${name.replace(/'/g, "\\'")}')" title="Удалить коллекцию">🗑</button>
                </div>
                <div class="collection-card-count">${moviesInCollection.length} ${getMovieWord(moviesInCollection.length)}</div>
                <div class="collection-card-movies">
                    ${moviesHTML}
                </div>
            </div>
        `;
    }).join('');
}

function getMovieWord(count) {
    if (count === 1) return 'фильм/сериал';
    if (count >= 2 && count <= 4) return 'фильма/сериала';
    return 'фильмов/сериалов';
}

// Открыть модалку создания коллекции
function openCreateCollectionModal() {
    document.getElementById('newCollectionName').value = '';
    document.getElementById('collectionModal').classList.remove('hidden');
    setTimeout(() => document.getElementById('newCollectionName').focus(), 100);
}

// Закрыть модалку
function closeCollectionModal() {
    document.getElementById('collectionModal').classList.add('hidden');
}

// Обработка формы создания коллекции
document.getElementById('createCollectionForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('newCollectionName').value.trim();
    if (!name) return;

    const collections = getCollections();
    if (collections[name]) {
        alert('Коллекция "' + name + '" уже существует!');
        return;
    }

    // Создаём виртуальную коллекцию (просто обновляем фильтры и рендер)
    closeCollectionModal();
    updateAllFilters();
    renderCollections();
});

async function deleteCollection(name) {
    if (!confirm(`Удалить коллекцию "${name}"?\nФильмы не будут удалены, просто у них очистится поле коллекции.`)) return;

    const moviesInCollection = movies.filter(m => m.collection === name);

    for (const m of moviesInCollection) {
        m.collection = '';
        await fetch(`/api/movies/${m.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(m)
        });
    }

    moviesInCollection.forEach(m => {
        const idx = movies.findIndex(x => x.id === m.id);
        if (idx !== -1) movies[idx].collection = '';
    });

    renderHome();
    renderCatalog();
    renderCollections();
    updateAllFilters();
    if (!document.getElementById('analytics').classList.contains('hidden')) {
        renderAnalytics();
    }
}

function goToCollections() {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-page="collections"]').classList.add('active');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('catalogPage').classList.add('hidden');
    document.getElementById('analytics').classList.add('hidden');
    document.getElementById('movieDetail').classList.add('hidden');
    document.getElementById('profilePage').classList.add('hidden');
    document.getElementById('collectionsPage').classList.remove('hidden');
    document.getElementById('favoritesPage').classList.add('hidden');
    renderCollections();
}

function goToCatalog(statusFilter = null) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-page="catalog"]').classList.add('active');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('catalogPage').classList.remove('hidden');
    document.getElementById('analytics').classList.add('hidden');
    document.getElementById('movieDetail').classList.add('hidden');
    document.getElementById('profilePage').classList.add('hidden');
    document.getElementById('collectionsPage').classList.add('hidden');
    document.getElementById('favoritesPage').classList.add('hidden');
    if (statusFilter) document.getElementById('statusFilter').value = statusFilter;
    renderCatalog();
}
function goToFavorites() {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-page="favorites"]').classList.add('active');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('catalogPage').classList.add('hidden');
    document.getElementById('collectionsPage').classList.add('hidden');
    document.getElementById('analytics').classList.add('hidden');
    document.getElementById('movieDetail').classList.add('hidden');
    document.getElementById('profilePage').classList.add('hidden');
    document.getElementById('favoritesPage').classList.remove('hidden');
    renderFavorites();
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
    const collectionHTML = m.collection
        ? `<div class="detail-section">
            <h3>📦 Коллекция</h3>
            <p>${m.collection}</p>
           </div>`
        : '';
    let seriesHTML = '';
    if ((m.type === 'series' || m.type === 'documentary') && m.episodes && m.seasons) {
        const total = m.episodes * m.seasons;
        const watched = m.watchedEpisodes || 0;
        const percent = (watched / total) * 100;
        seriesHTML = `
            <div class="detail-section">
                <h3>📊 Прогресс просмотра</h3>
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
    const favoriteBtnText = m.favorite ? '❤️ В избранном' : '🤍 В избранное';
    const favoriteBtnClass = m.favorite ? 'btn-favorite-detail active' : 'btn-favorite-detail';

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
                <span class="detail-status status-${m.status}" onclick="cycleStatus(${m.id})" title="Нажми чтобы изменить статус">
                    ${statusLabels[m.status]}
                </span>
                <div class="detail-rating">${ratingStars}</div>
                ${m.actors ? `<div class="detail-section"><h3>🎭 Актёры</h3><p>${m.actors}</p></div>` : ''}
                ${m.description ? `<div class="detail-section"><h3>📖 Описание</h3><p>${m.description}</p></div>` : ''}
                ${collectionHTML}
                ${tagsHTML}
                ${seriesHTML}
                ${reviewHTML}
                <div class="detail-actions">
                    <button class="btn-edit" onclick="editMovie(${m.id})">✏️ Редактировать</button>
                    <button class="${favoriteBtnClass}" onclick="toggleFavorite(${m.id})">${favoriteBtnText}</button>
                    <button class="btn-delete-detail" onclick="deleteMovieFromDetail(${m.id})">🗑 Удалить</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('home').classList.add('hidden');
    document.getElementById('catalogPage').classList.add('hidden');
    document.getElementById('analytics').classList.add('hidden');
    document.getElementById('profilePage').classList.add('hidden');
    document.getElementById('collectionsPage').classList.add('hidden');
    document.getElementById('movieDetail').classList.remove('hidden');
    document.getElementById('favoritesPage').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeMovieDetail() {
    document.getElementById('movieDetail').classList.add('hidden');
    document.getElementById('home').classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-page="home"]').classList.add('active');
    renderHome();
}

// ===== Переключение статуса =====
async function cycleStatus(id) {
    const m = movies.find(x => x.id === id);
    if (!m) return;
    const statusOrder = ['planned', 'watching', 'watched'];
    const currentIndex = statusOrder.indexOf(m.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    m.status = nextStatus;

    await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(m)
    });

    renderHome();
    renderCatalog();
    updateAllFilters();
    if (!document.getElementById('analytics').classList.contains('hidden')) renderAnalytics();
    if (!document.getElementById('collectionsPage').classList.contains('hidden')) renderCollections();
    if (!document.getElementById('movieDetail').classList.contains('hidden')) openMovieDetail(id);
}
async function toggleFavorite(id) {
    const m = movies.find(x => x.id === id);
    if (!m) return;
    m.favorite = !m.favorite;

    await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(m)
    });

    renderHome();
    renderCatalog();
    renderFavorites();
    updateAllFilters();
    if (!document.getElementById('analytics').classList.contains('hidden')) renderAnalytics();
    if (!document.getElementById('collectionsPage').classList.contains('hidden')) renderCollections();
    if (!document.getElementById('favoritesPage').classList.contains('hidden')) renderFavorites();
    if (!document.getElementById('movieDetail').classList.contains('hidden')) openMovieDetail(id);
}
// ===== Избранное =====
async function toggleFavorite(id) {
    const m = movies.find(x => x.id === id);
    if (!m) return;
    m.favorite = !m.favorite;

    await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(m)
    });

    renderHome();
    renderCatalog();
    updateAllFilters();
    if (!document.getElementById('analytics').classList.contains('hidden')) renderAnalytics();
    if (!document.getElementById('collectionsPage').classList.contains('hidden')) renderCollections();
    if (!document.getElementById('movieDetail').classList.contains('hidden')) openMovieDetail(id);
}

async function deleteMovieFromDetail(id) {
    if (!confirm('Удалить?')) return;
    await fetch(`/api/movies/${id}`, { method: 'DELETE' });
    movies = movies.filter(m => m.id !== id);
    renderHome();
    renderCatalog();
    renderCollections();
    updateAllFilters();
    closeMovieDetail();
}

async function deleteMovie(id) {
    if (!confirm('Удалить?')) return;
    await fetch(`/api/movies/${id}`, { method: 'DELETE' });
    movies = movies.filter(m => m.id !== id);
    renderHome();
    renderCatalog();
    renderCollections();
    updateAllFilters();
    if (!document.getElementById('analytics').classList.contains('hidden')) renderAnalytics();
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
    document.getElementById('movieCollection').value = '';

    const wrapper = document.getElementById('manualFormWrapper');
    const btn = document.getElementById('toggleFormBtn');
    wrapper.classList.add('collapsed');
    btn.classList.add('collapsed');

    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    editingId = null;
    currentTags = [];
    currentRating = 0;
}

// ===== Кнопка сворачивания =====
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

// ===== TMDB Поиск =====
// ===== TMDB Поиск =====
let searchTimeout = null;

async function searchTMDB(queryStr = null) {
    const query = queryStr || document.getElementById('tmdbSearchInput').value.trim();
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

        // Бэкенд возвращает готовый список словарей, берем его напрямую
        const results = data.results || data;
        if (!Array.isArray(results) || results.length === 0) {
            resultsBox.innerHTML = '<div class="tmdb-empty">Ничего не найдено</div>';
            return;
        }

        resultsBox.innerHTML = results.map(item => {
            // Используем унифицированные ключи от нашего Flask-бэкенда
            const title = item.title || 'Без названия';
            const year = item.year || '—';
            const posterUrl = item.poster || '';
            const sourceInfo = item.source === 'merged' ? 'TMDB и кинопоиск' : (item.source || 'api');

            return `
                <div class="tmdb-result-item" onclick='selectTMDBResult(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
                    <div class="tmdb-result-poster">
                        ${posterUrl ? `<img src="${posterUrl}" alt="${title}">` : '🎬'}
                    </div>
                    <div class="tmdb-result-info">
                        <div class="tmdb-result-title">${title}</div>
                        <div class="tmdb-result-meta">
                            ${year}
                            <span class="tmdb-result-type">${sourceInfo}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        resultsBox.innerHTML = `<div class="tmdb-empty">${err.message}</div>`;
    } finally {
        btn.disabled = false;
        btn.textContent = 'Найти';
    }
}

function selectTMDBResult(item) {
    // Подставляем унифицированные данные из бэкенда в форму
    document.getElementById('movieTitle').value = item.title || '';
    document.getElementById('movieYear').value = item.year || '';
    document.getElementById('movieDirector').value = item.director || '';
    document.getElementById('movieGenre').value = item.genre || '';
    document.getElementById('movieActors').value = item.actors || '';
    document.getElementById('moviePoster').value = item.poster || '';
    document.getElementById('movieDescription').value = item.description || '';
    document.getElementById('movieDuration').value = item.duration || ''; // <-- Добавленная строка
    document.getElementById('movieCollection').value = '';

    const resultsBox = document.getElementById('tmdbResults');
    resultsBox.innerHTML = '<div class="tmdb-loading">✅ Данные заполнены! Проверь поля ниже</div>';
    setTimeout(() => { resultsBox.innerHTML = ''; }, 2000);
}

// Обработчик кнопки ручного поиска
document.getElementById('tmdbSearchBtn').addEventListener('click', () => searchTMDB());

// ===== Автоматический поиск при вводе (Debounce) =====
document.getElementById('tmdbSearchInput').addEventListener('input', (e) => {
    const query = e.target.value.trim();

    // Сбрасываем таймер, если пользователь продолжает писать
    clearTimeout(searchTimeout);

    if (query.length < 3) {
        document.getElementById('tmdbResults').innerHTML = '';
        return;
    }

    // Ждем 600 мс после последнего нажатия клавиши и делаем асинхронный фоновый запрос
    searchTimeout = setTimeout(() => {
        searchTMDB(query);
    }, 600);
});

document.getElementById('tmdbSearchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        clearTimeout(searchTimeout);
        searchTMDB(e.target.value.trim());
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
    document.getElementById('movieCollection').value = m.collection || '';
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
document.getElementById('saveBtn').addEventListener('click', async () => {
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
        collection: document.getElementById('movieCollection').value.trim(),
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

    try {
        if (editingId) {
            const response = await fetch(`/api/movies/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const updatedMovie = await response.json();
                const index = movies.findIndex(m => m.id === editingId);
                if (index !== -1) movies[index] = updatedMovie;
            }
        } else {
            const response = await fetch('/api/movies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const newMovie = await response.json();
                movies.unshift(newMovie);
            }
        }

        renderHome();
        renderCatalog();
        renderCollections();
        updateAllFilters();
        if (!document.getElementById('analytics').classList.contains('hidden')) renderAnalytics();

        closeModal();
    } catch (err) {
        alert('Ошибка сохранения: ' + err.message);
    }
});

// ===== Навигация =====
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const page = btn.dataset.page;

        // 1. Сначала ГАРАНТИРОВАННО скрываем ВСЕ страницы
        document.getElementById('home').classList.add('hidden');
        document.getElementById('catalogPage').classList.add('hidden');
        document.getElementById('collectionsPage').classList.add('hidden');
        document.getElementById('favoritesPage').classList.add('hidden'); // <-- ЭТОГО НЕ ХВАТАЛО
        document.getElementById('analytics').classList.add('hidden');
        document.getElementById('movieDetail').classList.add('hidden');
        document.getElementById('profilePage').classList.add('hidden');

        // 2. Обрабатываем специальные действия
        if (page === 'add') {
            openModal();
            btn.classList.remove('active');
            const currentPage = document.querySelector('.nav-btn.active')?.dataset.page || 'home';
            document.querySelector(`[data-page="${currentPage}"]`).classList.add('active');
            return;
        }
        if (page === 'collections') {
            goToCollections();
            return;
        }
        if (page === 'favorites') {
            goToFavorites();
            return;
        }

        // 3. Показываем только нужную страницу и обновляем данные
        if (page === 'home') {
            document.getElementById('home').classList.remove('hidden');
            renderHome();
        } else if (page === 'catalog') {
            document.getElementById('catalogPage').classList.remove('hidden');
            renderCatalog();
        } else if (page === 'analytics') {
            document.getElementById('analytics').classList.remove('hidden');
            renderAnalytics();
        }
    });
});

// ===== Аналитика =====
let genreChartInstance = null;
let typeChartInstance = null;

function renderAnalytics() {
    document.getElementById('totalCount').textContent = movies.length;
    document.getElementById('watchedCount').textContent = movies.filter(m => m.status === 'watched').length;
    document.getElementById('favoritesCount').textContent = movies.filter(m => m.favorite).length;
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
['searchInput', 'typeFilter', 'genreFilter', 'directorFilter', 'tagFilter', 'collectionFilter', 'statusFilter', 'sortFilter']
    .forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', renderCatalog);
    });

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
// ===== Крестик очистки поиска =====

// Универсальная функция: показывает/скрывает крестик
function setupClearButton(inputId, btnId, onClear) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (!input || !btn) return;

    // Показываем крестик только когда есть текст
    input.addEventListener('input', () => {
        btn.classList.toggle('visible', input.value.length > 0);
    });

    // При клике на крестик — очищаем
    btn.addEventListener('click', () => {
        input.value = '';
        btn.classList.remove('visible');
        input.focus();
        if (onClear) onClear();
    });
}

// Поиск в каталоге
setupClearButton('searchInput', 'searchClearBtn', () => {
    renderCatalog();
});

// Поиск на главной
setupClearButton('homeSearch', 'homeSearchClearBtn', () => {
    // Если перешли в каталог — сбросить и там
    document.getElementById('searchInput').value = '';
    document.getElementById('searchClearBtn').classList.remove('visible');
    renderCatalog();
});

// Поиск TMDB
setupClearButton('tmdbSearchInput', 'tmdbSearchClearBtn', () => {
    document.getElementById('tmdbResults').innerHTML = '';
});
// ===== Профиль =====
function showProfile() {
    document.getElementById('userDropdown').classList.add('hidden');
    document.getElementById('home').classList.add('hidden');
    document.getElementById('catalogPage').classList.add('hidden');
    document.getElementById('analytics').classList.add('hidden');
    document.getElementById('movieDetail').classList.add('hidden');
    document.getElementById('collectionsPage').classList.add('hidden');
    document.getElementById('profilePage').classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    document.getElementById('profileAvatar').textContent = currentUser.displayName.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent = currentUser.displayName;
    document.getElementById('profileLogin').textContent = currentUser.username;
    document.getElementById('profileSince').textContent = new Date(currentUser.createdAt).toLocaleDateString('ru-RU');
    document.getElementById('profileTotal').textContent = movies.length;
    document.getElementById('profileWatched').textContent = movies.filter(m => m.status === 'watched').length;
    document.getElementById('profileFavorites').textContent = movies.filter(m => m.favorite).length;
    const rated = movies.filter(m => m.rating > 0);
    const avg = rated.length ? (rated.reduce((s, m) => s + m.rating, 0) / rated.length).toFixed(1) : '—';
    document.getElementById('profileRating').textContent = avg;
    document.getElementById('favoritesPage').classList.add('hidden');
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
// Закрытие модалки коллекции по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!document.getElementById('collectionModal').classList.contains('hidden')) {
            closeCollectionModal();
        }
    }
});