// Слайдер (карусель) для секции отзывов
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    let totalSlides = slides.length;
    
    function getSlidesPerView() {
        const width = window.innerWidth;
        if (width >= 1024) return 3;
        if (width >= 768) return 2;
        return 1;
    }
    
    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const numberOfDots = totalSlides;
        for (let i = 0; i < numberOfDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    function getSlideWidth() {
        const container = document.querySelector('.slider-container');
        if (!container) return 0;
        const containerWidth = container.clientWidth;
        const gap = 30;
        const visibleSlides = getSlidesPerView();
        return (containerWidth - (gap * (visibleSlides - 1))) / visibleSlides;
    }
    
    function updateSlider() {
        const slideWidth = getSlideWidth();
        const gap = 30;
        const offset = currentIndex * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
    }
    
    function nextSlide() {
        const maxIndex = totalSlides - getSlidesPerView();
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }
    
    function prevSlide() {
        const maxIndex = totalSlides - getSlidesPerView();
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = maxIndex > 0 ? maxIndex : 0;
        }
        updateSlider();
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newSlidesPerView = getSlidesPerView();
            if (newSlidesPerView !== slidesPerView) {
                slidesPerView = newSlidesPerView;
                currentIndex = 0;
            }
            updateSlider();
        }, 150);
    });
    
    function initSlider() {
        slidesPerView = getSlidesPerView();
        totalSlides = slides.length;
        if (currentIndex > totalSlides - slidesPerView && totalSlides - slidesPerView > 0) {
            currentIndex = totalSlides - slidesPerView;
        }
        if (currentIndex < 0) currentIndex = 0;
        createDots();
        updateSlider();
    }
    
    initSlider();
    
    window.addEventListener('load', function() {
        updateSlider();
    });
    
    // Плавный скролл для кнопки "Сделать заказ"
    const orderBtn = document.querySelector('.order-btn');
    if (orderBtn) {
        orderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
    
    // Плавный скролл для навигации (якоря)
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Отслеживание текущего каталога для возврата из корзины
document.addEventListener('DOMContentLoaded', function() {
    let currentPage = '';
    const href = window.location.href;
    
    if (href.includes('catalog-cards.html')) {
        currentPage = 'catalog-cards.html';
    } else if (href.includes('catalog-sweet.html')) {
        currentPage = 'catalog-sweet.html';
    } else if (href.includes('catalog-sinew.html')) {
        currentPage = 'catalog-sinew.html';
    } else if (href.includes('catalog-vases.html')) {
        currentPage = 'catalog-vases.html';
    } else if (href.includes('catalog.html')) {
        currentPage = 'catalog.html';
    }
    
    if (currentPage) {
        localStorage.setItem('lastCatalogPage', currentPage);
        console.log('Сохранен каталог:', currentPage);
    }
// Кнопка "Наверх"
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}    
});
// ========== ПОИСК ПО САЙТУ ==========
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchForm || !searchInput) return;
    
    // Собираем все товары со всех каталогов
    let allProducts = [];
    
    // Функция загрузки товаров из разных каталогов
    function loadAllProducts() {
        // Товары из catalog.html
        const catalogProducts = [
            { id: 1, name: "Розовое настроение", price: 2490, category: "Свежайшие букеты", url: "catalog.html" },
            { id: 2, name: "Солнечный день", price: 2190, category: "Свежайшие букеты", url: "catalog.html" },
            { id: 3, name: "Лавандовый сон", price: 3190, category: "Свежайшие букеты", url: "catalog.html" },
            { id: 4, name: "Алая страсть", price: 3990, category: "Свежайшие букеты", url: "catalog.html" },
            { id: 5, name: "Нежность пионов", price: 4490, category: "Свежайшие букеты", url: "catalog.html" },
            { id: 6, name: "Летний букет", price: 2890, category: "Свежайшие букеты", url: "catalog.html" },
            { id: 7, name: "Белоснежное облако", price: 3290, category: "Свежайшие букеты", url: "catalog.html" },
            { id: 8, name: "Ромашковое поле", price: 3590, category: "Свежайшие букеты", url: "catalog.html" },
            { id: 9, name: "Морской бриз", price: 2790, category: "Свежайшие букеты", url: "catalog.html" },
            // Букеты из синельной проволоки
            { id: 101, name: "Радужный букет", price: 1290, category: "Синельная проволока", url: "catalog-sinew.html" },
            { id: 102, name: "Розовые мечты", price: 990, category: "Синельная проволока", url: "catalog-sinew.html" },
            { id: 103, name: "Лавандовое настроение", price: 1190, category: "Синельная проволока", url: "catalog-sinew.html" },
            { id: 104, name: "Солнечный зайчик", price: 890, category: "Синельная проволока", url: "catalog-sinew.html" },
            { id: 105, name: "Нежные пионы", price: 1490, category: "Синельная проволока", url: "catalog-sinew.html" },
            { id: 106, name: "Мятная свежесть", price: 1090, category: "Синельная проволока", url: "catalog-sinew.html" },
            { id: 107, name: "Клубничный микс", price: 1390, category: "Синельная проволока", url: "catalog-sinew.html" },
            { id: 108, name: "Облачко счастья", price: 790, category: "Синельная проволока", url: "catalog-sinew.html" },
            { id: 109, name: "Северное сияние", price: 1590, category: "Синельная проволока", url: "catalog-sinew.html" },
            // Сладкие букеты
            { id: 201, name: "Шоколадная феерия", price: 1890, category: "Сладкие букеты", url: "catalog-sweet.html" },
            { id: 202, name: "Маршмеллоу радость", price: 1290, category: "Сладкие букеты", url: "catalog-sweet.html" },
            { id: 203, name: "Киндер-сюрприз", price: 1590, category: "Сладкие букеты", url: "catalog-sweet.html" },
            { id: 204, name: "Клубничный рай", price: 1390, category: "Сладкие букеты", url: "catalog-sweet.html" },
            { id: 205, name: "Ореховое наслаждение", price: 1490, category: "Сладкие букеты", url: "catalog-sweet.html" },
            { id: 206, name: "Чупа-чупс вечеринка", price: 990, category: "Сладкие букеты", url: "catalog-sweet.html" },
            { id: 207, name: "Медовое счастье", price: 1690, category: "Сладкие букеты", url: "catalog-sweet.html" },
            { id: 208, name: "Сникерс-микс", price: 1790, category: "Сладкие букеты", url: "catalog-sweet.html" },
            { id: 209, name: "Детская мечта", price: 1990, category: "Сладкие букеты", url: "catalog-sweet.html" },
            // Монобукеты
            { id: 501, name: "Алые розы", price: 3290, category: "Монобукеты", url: "mono.html" },
            { id: 502, name: "Белые розы", price: 2990, category: "Монобукеты", url: "mono.html" },
            { id: 503, name: "Розовые розы", price: 2790, category: "Монобукеты", url: "mono.html" },
            { id: 504, name: "Жёлтые тюльпаны", price: 1890, category: "Монобукеты", url: "mono.html" },
            { id: 505, name: "Белые лилии", price: 2490, category: "Монобукеты", url: "mono.html" },
            { id: 506, name: "Герберы", price: 1990, category: "Монобукеты", url: "mono.html" },
            { id: 507, name: "Хризантемы", price: 1690, category: "Монобукеты", url: "mono.html" },
            { id: 508, name: "Пионы", price: 3990, category: "Монобукеты", url: "mono.html" },
            { id: 509, name: "Эустома", price: 2190, category: "Монобукеты", url: "mono.html" },
            // Вазы
            { id: 301, name: "Классическая прозрачная", price: 890, category: "Вазы", url: "catalog-vases.html" },
            { id: 302, name: "Керамическая с узором", price: 1290, category: "Вазы", url: "catalog-vases.html" },
            { id: 303, name: "Кувшин с позолотой", price: 1590, category: "Вазы", url: "catalog-vases.html" },
            { id: 304, name: "Минимализм белый", price: 990, category: "Вазы", url: "catalog-vases.html" },
            { id: 305, name: "Геометричная", price: 1490, category: "Вазы", url: "catalog-vases.html" },
            { id: 306, name: "Бокал на ножке", price: 1190, category: "Вазы", url: "catalog-vases.html" }
        ];
        
        allProducts = catalogProducts;
    }
    
    // Поиск товаров
    function searchProducts(query) {
        if (!query.trim()) {
            searchResults.classList.remove('show');
            return [];
        }
        
        const lowerQuery = query.toLowerCase();
        const results = allProducts.filter(product => 
            product.name.toLowerCase().includes(lowerQuery)
        );
        
        displayResults(results);
        return results;
    }
    
    // Отображение результатов
    function displayResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">Ничего не найдено 😢</div>';
            searchResults.classList.add('show');
            return;
        }
        
        results.slice(0, 8).forEach(product => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
                <a href="${product.url}">
                    <div class="search-result-name">${product.name}</div>
                    <div class="search-result-price">${product.price.toLocaleString()} ₽ • ${product.category}</div>
                </a>
            `;
            searchResults.appendChild(item);
        });
        
        searchResults.classList.add('show');
    }
    
    // Обработчики событий
    searchBtn.addEventListener('click', function() {
        searchForm.classList.toggle('active');
        if (searchForm.classList.contains('active')) {
            searchInput.focus();
        } else {
            searchResults.classList.remove('show');
            searchInput.value = '';
        }
    });
    
    searchInput.addEventListener('input', function() {
        searchProducts(this.value);
    });
    
    // Закрытие результатов при клике вне
    document.addEventListener('click', function(e) {
        if (!searchForm.contains(e.target)) {
            searchResults.classList.remove('show');
            if (!searchForm.classList.contains('active')) {
                searchInput.value = '';
            }
        }
    });
    
    // Загружаем товары
    loadAllProducts();
});