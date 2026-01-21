// ===== APP STATE =====
let currentCategory = 'all';
let currentWisdom = null;
let favorites = JSON.parse(localStorage.getItem('wisdomFavorites')) || [];
let wisdomCount = parseInt(localStorage.getItem('wisdomCount')) || 0;
let wisdomDatabase = {
    all: [],
    philosophy: [],
    spiritual: [],
    life: [],
    motivational: [],
    eastern: []
};

// ===== DOM ELEMENTS =====
const elements = {
    wisdomText: document.getElementById('wisdomText'),
    authorText: document.getElementById('authorText'),
    wisdomCard: document.getElementById('wisdomCard'),
    cardCategory: document.querySelector('.card-category'),
    counter: document.getElementById('counter'),
    favoritesCount: document.getElementById('favoritesCount'),
    dbStatus: document.getElementById('dbStatus'),
    newWisdomBtn: document.getElementById('newWisdomBtn'),
    categoryBtn: document.getElementById('categoryBtn'),
    copyBtn: document.getElementById('copyBtn'),
    speakBtn: document.getElementById('speakBtn'),
    favoriteBtn: document.getElementById('favoriteBtn'),
    shareBtn: document.getElementById('shareBtn'),
    refreshDataBtn: document.getElementById('refreshDataBtn'),
    shareAppBtn: document.getElementById('shareAppBtn'),
    resetBtn: document.getElementById('resetBtn'),
    toast: document.getElementById('toast'),
    categoryModal: document.getElementById('categoryModal'),
    closeCategoryBtn: document.getElementById('closeCategoryBtn'),
    categoryButtons: document.querySelectorAll('.category-btn')
};

// ===== DATABASE FUNCTIONS =====
async function loadWisdomData() {
    try {
        showToast('Loading wisdom database... ⏳');
        
        // Try to load from GitHub
        const response = await fetch('wisdom-data.json');
        const data = await response.json();
        
        // Clear existing data
        wisdomDatabase.all = [];
        wisdomDatabase.philosophy = [];
        wisdomDatabase.spiritual = [];
        wisdomDatabase.life = [];
        wisdomDatabase.motivational = [];
        wisdomDatabase.eastern = [];
        
        // Process each wisdom entry
        data.wisdom_entries.forEach(entry => {
            const wisdom = {
                text: entry.text,
                author: entry.author,
                category: entry.category
            };
            
            wisdomDatabase.all.push(wisdom);
            
            if (entry.category === 'philosophy') wisdomDatabase.philosophy.push(wisdom);
            else if (entry.category === 'spiritual') wisdomDatabase.spiritual.push(wisdom);
            else if (entry.category === 'life') wisdomDatabase.life.push(wisdom);
            else if (entry.category === 'motivational') wisdomDatabase.motivational.push(wisdom);
            else if (entry.category === 'eastern') wisdomDatabase.eastern.push(wisdom);
        });
        
        // Save to localStorage
        localStorage.setItem('wisdomData', JSON.stringify(wisdomDatabase));
        localStorage.setItem('wisdomVersion', data.version);
        localStorage.setItem('lastUpdate', new Date().toISOString());
        
        elements.dbStatus.textContent = 'Online';
        elements.dbStatus.style.color = '#2ecc71';
        
        showToast(`Loaded ${wisdomDatabase.all.length} wisdom entries ✨`);
        
        // If no current wisdom, get one
        if (!currentWisdom && wisdomDatabase.all.length > 0) {
            getNewWisdom();
        }
        
        return true;
        
    } catch (error) {
        console.error('Failed to load from GitHub:', error);
        
        // Try to load from localStorage
        const storedData = localStorage.getItem('wisdomData');
        if (storedData) {
            const data = JSON.parse(storedData);
            wisdomDatabase = data;
            elements.dbStatus.textContent = 'Cached';
            elements.dbStatus.style.color = '#f39c12';
            showToast('Using cached database 📦');
            return true;
        }
        
        // Load fallback data
        loadFallbackData();
        elements.dbStatus.textContent = 'Offline';
        elements.dbStatus.style.color = '#e74c3c';
        showToast('Using offline database 📴');
        return false;
    }
}

function loadFallbackData() {
    // Fallback data in case everything fails
    const fallbackData = {
        all: [
            {text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "philosophy"},
            {text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", category: "spiritual"},
            {text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi", category: "life"},
            {text: "What we think, we become.", author: "Buddha", category: "eastern"},
            {text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "spiritual"},
            {text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon", category: "life"},
            {text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "motivational"},
            {text: "The mind is everything. What you think you become.", author: "Buddha", category: "eastern"},
            {text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivational"},
            {text: "Turn your wounds into wisdom.", author: "Oprah Winfrey", category: "life"}
        ],
        philosophy: [
            {text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "philosophy"},
            {text: "I think, therefore I am.", author: "René Descartes", category: "philosophy"}
        ],
        spiritual: [
            {text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", category: "spiritual"},
            {text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "spiritual"}
        ],
        life: [
            {text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi", category: "life"},
            {text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon", category: "life"},
            {text: "Turn your wounds into wisdom.", author: "Oprah Winfrey", category: "life"}
        ],
        motivational: [
            {text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "motivational"},
            {text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivational"}
        ],
        eastern: [
            {text: "What we think, we become.", author: "Buddha", category: "eastern"},
            {text: "The mind is everything. What you think you become.", author: "Buddha", category: "eastern"}
        ]
    };
    
    wisdomDatabase = fallbackData;
}

// ===== UTILITY FUNCTIONS =====
function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

function getRandomWisdom(category = currentCategory) {
    const wisdomArray = wisdomDatabase[category];
    if (!wisdomArray || wisdomArray.length === 0) {
        // Fallback to all if category is empty
        return wisdomDatabase.all[0] || {text: "No wisdom available.", author: "System"};
    }
    return wisdomArray[Math.floor(Math.random() * wisdomArray.length)];
}

function updateDisplay() {
    if (!currentWisdom) return;
    
    // Update wisdom text and author
    elements.wisdomText.textContent = currentWisdom.text;
    elements.authorText.textContent = `— ${currentWisdom.author}`;
    
    // Update category badge
    const categoryName = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
    elements.cardCategory.textContent = categoryName;
    
    // Update favorite button state
    const isFavorite = favorites.some(fav => 
        fav.text === currentWisdom.text && fav.author === currentWisdom.author
    );
    elements.favoriteBtn.classList.toggle('active', isFavorite);
    elements.favoriteBtn.innerHTML = isFavorite ? 
        '<i class="fas fa-heart"></i>' : 
        '<i class="far fa-heart"></i>';
    
    // Update counters
    elements.counter.textContent = wisdomCount;
    elements.favoritesCount.textContent = favorites.length;
    
    // Save to localStorage
    localStorage.setItem('wisdomCount', wisdomCount.toString());
    localStorage.setItem('wisdomFavorites', JSON.stringify(favorites));
}

function getNewWisdom() {
    if (wisdomDatabase.all.length === 0) {
        showToast('Loading wisdom... ⏳');
        return;
    }
    
    currentWisdom = getRandomWisdom();
    wisdomCount++;
    updateDisplay();
    
    // Add animation effect
    elements.wisdomCard.style.transform = 'scale(0.95)';
    setTimeout(() => {
        elements.wisdomCard.style.transform = 'scale(1)';
    }, 150);
}

function copyToClipboard() {
    const textToCopy = `${currentWisdom.text}\n\n— ${currentWisdom.author}`;
    navigator.clipboard.writeText(textToCopy)
        .then(() => showToast('Copied to clipboard! 📋'))
        .catch(err => {
            console.error('Failed to copy: ', err);
            showToast('Failed to copy');
        });
}

function speakWisdom() {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = `${currentWisdom.text}. By ${currentWisdom.author}`;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
        showToast('Speaking wisdom... 🔊');
    } else {
        showToast('Speech synthesis not supported');
    }
}

function toggleFavorite() {
    const isCurrentlyFavorite = elements.favoriteBtn.classList.contains('active');
    
    if (isCurrentlyFavorite) {
        // Remove from favorites
        favorites = favorites.filter(fav => 
            !(fav.text === currentWisdom.text && fav.author === currentWisdom.author)
        );
        showToast('Removed from favorites 💔');
    } else {
        // Add to favorites
        favorites.push({...currentWisdom});
        showToast('Added to favorites 💖');
    }
    
    updateDisplay();
}

function shareWisdom() {
    const shareData = {
        title: 'Wisdom Cards',
        text: `${currentWisdom.text}\n\n— ${currentWisdom.author}`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showToast('Shared successfully! 📲'))
            .catch(error => console.log('Sharing cancelled:', error));
    } else {
        // Fallback: copy to clipboard
        copyToClipboard();
    }
}

function shareApp() {
    const shareData = {
        title: 'Wisdom Cards - Daily Inspiration',
        text: 'Get daily doses of wisdom and inspiration! Install this beautiful PWA app.',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        showToast('Share URL: ' + window.location.href);
    }
}

function changeCategory(category) {
    currentCategory = category;
    
    // Update active button in modal
    elements.categoryButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    // Close modal
    elements.categoryModal.style.display = 'none';
    
    // Get new wisdom from selected category
    getNewWisdom();
    showToast(`Category: ${category.charAt(0).toUpperCase() + category.slice(1)}`);
}

function refreshData() {
    showToast('Refreshing wisdom database... 🔄');
    loadWisdomData().then(success => {
        if (success) {
            getNewWisdom();
        }
    });
}

function resetApp() {
    if (confirm('Are you sure you want to reset all your wisdom data? This will clear favorites and counters.')) {
        wisdomCount = 0;
        favorites = [];
        localStorage.clear();
        loadWisdomData().then(() => {
            currentWisdom = getRandomWisdom();
            updateDisplay();
            showToast('App reset successfully! 🔄');
        });
    }
}

// ===== EVENT LISTENERS =====
elements.newWisdomBtn.addEventListener('click', getNewWisdom);

elements.categoryBtn.addEventListener('click', () => {
    elements.categoryModal.style.display = 'flex';
});

elements.closeCategoryBtn.addEventListener('click', () => {
    elements.categoryModal.style.display = 'none';
});

elements.copyBtn.addEventListener('click', copyToClipboard);

elements.speakBtn.addEventListener('click', speakWisdom);

elements.favoriteBtn.addEventListener('click', toggleFavorite);

elements.shareBtn.addEventListener('click', shareWisdom);

elements.refreshDataBtn.addEventListener('click', refreshData);

elements.shareAppBtn.addEventListener('click', shareApp);

elements.resetBtn.addEventListener('click', resetApp);

// Category selection in modal
elements.categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        changeCategory(btn.dataset.category);
    });
});

// Close modal when clicking outside
elements.categoryModal.addEventListener('click', (e) => {
    if (e.target === elements.categoryModal) {
        elements.categoryModal.style.display = 'none';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
        e.preventDefault();
        getNewWisdom();
    }
    if (e.key === 'Escape') {
        elements.categoryModal.style.display = 'none';
    }
});

// ===== INITIALIZE APP =====
async function init() {
    // Load wisdom data
    await loadWisdomData();
    
    // Set initial category button as active
    document.querySelector(`.category-btn[data-category="${currentCategory}"]`)?.classList.add('active');
    
    // Get first wisdom
    if (wisdomDatabase.all.length > 0) {
        getNewWisdom();
    }
    
    // Update display
    updateDisplay();
    
    // Show welcome message
    setTimeout(() => {
        showToast('Welcome to Wisdom Cards! ✨ Tap "New Wisdom" to begin.');
    }, 1000);
}

// ===== START THE APP =====
document.addEventListener('DOMContentLoaded', init);
