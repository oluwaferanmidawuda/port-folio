// DOM Elements
const currentYearSpan = document.getElementById('current-year');
const skillButtons = document.querySelectorAll('.skill-btn');
const skillDescription = document.getElementById('skill-description');
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;
const projectsContainer = document.getElementById('projects-container');

// Current Year
currentYearSpan.textContent = new Date().getFullYear();

// Skill Information
const skillInfo = {
    "HTML": "HTML5 is the latest evolution of the standard that defines HTML. I use semantic HTML5 elements to create accessible, SEO-friendly website structures.",
    "CSS": "CSS3 allows me to create beautiful, responsive designs. I'm proficient with Flexbox, Grid, animations, and modern CSS methodologies like BEM.",
    "JavaScript": "ES6+ JavaScript enables me to build interactive web applications. I use modern features like arrow functions, promises, async/await, and modules.",
    "React": "React.js is my go-to frontend library for building component-based UIs. I'm experienced with hooks, context API, and React Router.",
    "Node.js": "For backend development, I use Node.js with Express to build RESTful APIs and server-side applications."
};

// Skill Button Interaction
skillButtons.forEach(button => {
    button.addEventListener('click', () => {
        const skill = button.dataset.skill;
        skillDescription.innerHTML = `
            <h4>${skill}</h4>
            <p>${skillInfo[skill]}</p>
        `;
        skillDescription.style.backgroundColor = 'var(--light)';
    });
});

// Theme Toggle
function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggleBtn.innerHTML = theme === 'dark' 
        ? '<span class="theme-icon">☀️</span> Light Mode' 
        : '<span class="theme-icon">🌙</span> Dark Mode';
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Load saved theme or prefer color scheme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    }
});

// Load Projects from JSON - Updated with better error handling
async function loadProjects() {
    try {
        // Show loading state
        projectsContainer.innerHTML = '<div class="loading">Loading projects...</div>';
        
        const response = await fetch('data/projects.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const projects = await response.json();
        
        // Clear loading state
        projectsContainer.innerHTML = '';
        
        // Create project cards
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-links">
                    <a href="${project.link || '#'}" target="_blank" rel="noopener noreferrer">
                        View Project
                    </a>
                    ${project.code ? `
                    <a href="${project.code}" target="_blank" rel="noopener noreferrer">
                        View Code
                    </a>
                    ` : ''}
                </div>
                ${project.tags ? `
                <div class="project-tags">
                    ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
                ` : ''}
            `;
            
            projectsContainer.appendChild(projectCard);
        });
        
    } catch (error) {
        console.error('Failed to load projects:', error);
        projectsContainer.innerHTML = `
            <div class="error-message">
                <p>⚠️ Could not load projects. Please try again later.</p>
                <p><small>${error.message}</small></p>
            </div>
        `;
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', loadProjects);
