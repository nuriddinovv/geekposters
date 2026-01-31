// Language Switcher Functionality
document.addEventListener('DOMContentLoaded', function() {
    const languageToggle = document.getElementById('languageToggle');
    const languageMenu = document.getElementById('languageMenu');
    const languageOptions = document.querySelectorAll('.language-option');
    
    // Toggle language menu
    languageToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        languageMenu.classList.toggle('active');
    });
    
    // Handle language selection
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            languageMenu.classList.remove('active');
            updateLanguageButtonState(lang);
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-switcher')) {
            languageMenu.classList.remove('active');
        }
    });
    
    // Set initial language button state
    updateLanguageButtonState(getCurrentLanguage());
});

// Update the active state of language buttons
function updateLanguageButtonState(lang) {
    const options = document.querySelectorAll('.language-option');
    options.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });
}
