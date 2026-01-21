// ===== WISDOM DATABASE =====
const wisdomDatabase = {
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
        {text: "Turn your wounds into wisdom.", author: "Oprah Winfrey", category: "life"},
        {text: "Peace comes from within. Do not seek it without.", author: "Buddha", category: "eastern"},
        {text: "I think, therefore I am.", author: "René Descartes", category: "philosophy"},
        {text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde", category: "philosophy"},
        {text: "The unexamined life is not worth living.", author: "Socrates", category: "philosophy"},
        {text: "Where there is love there is life.", author: "Mahatma Gandhi", category: "spiritual"},
        {text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivational"}
    ],
    
    philosophy: [
        {text: "The only true wisdom is in knowing you know nothing.", author: "Socrates"},
        {text: "I think, therefore I am.", author: "René Descartes"},
        {text: "To live is the rarest thing in the world. Most people exist, that is all.", author: "Oscar Wilde"},
        {text: "The unexamined life is not worth living.", author: "Socrates"},
        {text: "Man is condemned to be free.", author: "Jean-Paul Sartre"}
    ],
    
    spiritual: [
        {text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu"},
        {text: "The purpose of our lives is to be happy.", author: "Dalai Lama"},
        {text: "Where there is love there is life.", author: "Mahatma Gandhi"},
        {text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha"},
        {text: "The quieter you become, the more you can hear.", author: "Ram Dass"}
    ],
    
    life: [
        {text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi"},
        {text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon"},
        {text: "Turn your wounds into wisdom.", author: "Oprah Winfrey"},
        {text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost"},
        {text: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate.", author: "Ralph Waldo Emerson"}
    ],
    
    motivational: [
        {text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein"},
        {text: "The only way to do great work is to love what you do.", author: "Steve Jobs"},
        {text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt"},
        {text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson"},
        {text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt"}
    ],
    
    eastern: [
        {text: "What we think, we become.", author: "Buddha"},
        {text: "The mind is everything. What you think you become.", author: "Buddha"},
        {text: "Peace comes from within. Do not seek it without.", author: "Buddha"},
        {text: "When you realize nothing is lacking, the whole world belongs to you.", author: "Lao Tzu"},
        {text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu"}
    ]
};

// ===== APP STATE =====
let currentCategory = 'all';
let currentWisdom = null;
let favorites = JSON.parse(localStorage.getItem('wisdomFavorites')) || [];
let wisdomCount = parseInt(localStorage.getItem('wisdomCount')) || 0;

// ===== DOM ELEMENTS =====
const elements = {
    wisdomText: document.getElementById('wisdomText'),
    authorText: document.getElementById('authorText'),
    wisdomCard: document.getElementById('wisdomCard'),
    cardCategory: document.querySelector('.card-category'),
    counter: document.getElementById('counter'),
    favoritesCount: document.getElementById('favoritesCount'),
    lastUpdate: document.getElementById('lastUpdate'),
    newWisdomBtn: document.getElementById('newWisdomBtn'),
    categoryBtn: document.getElementById('categoryBtn'),
    copyBtn: document.getElementById('copyBtn'),
    speakBtn: document.getElementById('speakBtn'),
    favoriteBtn: document.getElementById('favoriteBtn'),
    resetBtn: document.getElementById('resetBtn'),
    toast: document.getElementById('toast'),
    categoryModal: document.getElementById('categoryModal'),
    closeCategoryBtn: document.getElementById('closeCategoryBtn'),
    categoryButtons: document.querySelectorAll('.category-btn')
};

// ===== UTILITY FUNCTIONS =====
function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 2000);
}

function getRandomWisdom(category = currentCategory) {
    const wisdomArray = wisdomDatabase[category];
    return wisdomArray[Math.floor(Math.random() * wisdomArray.length)];
}

function updateDisplay() {
    // Update wisdom text and author
    elements.wisdomText.textContent = currentWisdom.text;
    elements.authorText.textContent = `— ${currentWisdom.author}`;
    
    // Update category badge
    elements.cardCategory.textContent = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1);
    
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
    
    // Update last update time
    const now = new Date();
    elements.lastUpdate.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Save to localStorage
    localStorage.setItem('wisdomCount', wisdomCount.toString());
    localStorage.setItem('wisdomFavorites', JSON.stringify(favorites));
}

function getNewWisdom() {
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

function resetApp() {
    if (confirm('Are you sure you want to reset all your wisdom data?')) {
        wisdomCount = 0;
        favorites = [];
        localStorage.clear();
        currentWisdom = getRandomWisdom();
        updateDisplay();
        showToast('App reset successfully! 🔄');
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

// ===== INITIALIZE APP =====
function init() {
    // Load initial wisdom
    currentWisdom = getRandomWisdom();
    
    // Set initial category button as active
    document.querySelector(`.category-btn[data-category="${currentCategory}"]`).classList.add('active');
    
    // Update display
    updateDisplay();
    
    // Show welcome message after a delay
    setTimeout(() => {
        showToast('Welcome to Wisdom Cards! ✨');
    }, 1000);
}

// ===== START THE APP =====
document.addEventListener('DOMContentLoaded', init);
