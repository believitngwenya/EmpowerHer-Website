// Modern JavaScript with enhanced features
class EmpowerHerApp {
    constructor() {
        this.currentTheme = 'dark';
        this.isChatOpen = false;
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.renderContent();
        this.setupSmoothScrolling();
        this.setupTheme();
    }

    setupLoadingScreen() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 2000);
        });
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Chat functionality
        document.getElementById('chatToggle').addEventListener('click', () => this.toggleChat());
        document.getElementById('chatClose').addEventListener('click', () => this.toggleChat());

        // Navigation scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu
        document.querySelector('.mobile-menu-btn').addEventListener('click', () => this.toggleMobileMenu());

        // Button handlers
        document.getElementById('explore-resources').addEventListener('click', () => this.scrollToSection('resources'));
        document.getElementById('find-opportunities').addEventListener('click', () => this.scrollToSection('jobs'));
        document.getElementById('view-all-resources').addEventListener('click', () => this.showAllResources());
        document.getElementById('view-all-jobs').addEventListener('click', () => this.showAllJobs());

        // Resource category filtering
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterResources(e.target));
        });

        // Job filtering
        document.querySelectorAll('.modern-select').forEach(select => {
            select.addEventListener('change', () => this.filterJobs());
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    
                    // Animate counters when stats section is in view
                    if (entry.target.classList.contains('stats')) {
                        this.animateCounters();
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all sections and cards
        document.querySelectorAll('section, .resource-card, .job-card, .mentor-card, .feature-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('empowerher-theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.updateThemeIcon();
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('empowerher-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = document.querySelector('#themeToggle i');
        icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleChat() {
        this.isChatOpen = !this.isChatOpen;
        const chatBot = document.getElementById('chatBot');
        const chatToggle = document.getElementById('chatToggle');
        
        if (this.isChatOpen) {
            chatBot.classList.add('open');
            chatToggle.style.opacity = '0';
        } else {
            chatBot.classList.remove('open');
            chatToggle.style.opacity = '1';
        }
    }

    toggleMobileMenu() {
        document.querySelector('.navbar').classList.toggle('mobile-menu-active');
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = document.getElementById('scrollTop');
        
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            scrollTop.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            scrollTop.classList.remove('visible');
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        });
    }

    filterResources(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get category and filter resources
        const category = button.getAttribute('data-category');
        this.renderResources(category);
    }

    filterJobs() {
        // Get filter values
        const typeFilter = document.getElementById('job-type-filter').value;
        const industryFilter = document.getElementById('industry-filter').value;
        const experienceFilter = document.getElementById('experience-filter').value;
        const salaryFilter = document.getElementById('salary-filter').value;
        
        // Filter jobs based on selected criteria
        this.renderJobs(typeFilter, industryFilter, experienceFilter, salaryFilter);
    }

    showAllResources() {
        // Reset to show all resources
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.category-btn[data-category="all"]').classList.add('active');
        this.renderResources('all');
    }

    showAllJobs() {
        // Reset all filters
        document.getElementById('job-type-filter').value = 'all';
        document.getElementById('industry-filter').value = 'all';
        document.getElementById('experience-filter').value = 'all';
        document.getElementById('salary-filter').value = 'all';
        
        // Show all jobs
        this.renderJobs();
    }

    renderResources(category = 'all') {
        const container = document.getElementById('resources-container');
        const filteredResources = category === 'all' 
            ? this.resources 
            : this.resources.filter(resource => resource.category === category);
        
        if (filteredResources.length === 0) {
            container.innerHTML = this.getNoResultsHTML('resources');
            return;
        }
        
        container.innerHTML = filteredResources.map(resource => `
            <div class="resource-card">
                <div class="resource-header">
                    <span class="resource-category">${this.formatCategory(resource.category)}</span>
                    <span class="resource-badge ${resource.isFree ? 'badge-free' : 'badge-premium'}">
                        ${resource.isFree ? 'Free' : 'Premium'}
                    </span>
                </div>
                <h3 class="resource-title">${resource.title}</h3>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-meta">
                    <span class="resource-meta-item">
                        <i class="fas fa-signal"></i>
                        ${resource.level}
                    </span>
                    <span class="resource-meta-item">
                        <i class="far fa-clock"></i>
                        ${resource.duration}
                    </span>
                </div>
                <button class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-${resource.isFree ? 'play-circle' : 'lock'}"></i>
                    ${resource.isFree ? 'Start Learning' : 'Unlock Premium'}
                </button>
            </div>
        `).join('');
    }

    renderJobs(type = 'all', industry = 'all', experience = 'all', salary = 'all') {
        const container = document.getElementById('jobs-container');
        let filteredJobs = this.jobs;
        
        // Apply filters
        if (type !== 'all') filteredJobs = filteredJobs.filter(job => job.type === type);
        if (industry !== 'all') filteredJobs = filteredJobs.filter(job => job.category === industry);
        if (experience !== 'all') filteredJobs = filteredJobs.filter(job => job.experience === experience);
        if (salary !== 'all') {
            const minSalary = parseInt(salary);
            filteredJobs = filteredJobs.filter(job => {
                const jobMinSalary = parseInt(job.salary.replace(/[^\d]/g, ''));
                return jobMinSalary >= minSalary;
            });
        }
        
        if (filteredJobs.length === 0) {
            container.innerHTML = this.getNoResultsHTML('jobs');
            return;
        }
        
        container.innerHTML = filteredJobs.map(job => `
            <div class="job-card">
                <div class="job-header">
                    <span class="job-type">${job.type}</span>
                    <span class="job-date">${job.posted}</span>
                </div>
                <h3 class="job-title">${job.title}</h3>
                <div class="job-company">
                    <i class="fas fa-building"></i>
                    <span>${job.company}</span>
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${job.location}</span>
                </div>
                <p class="job-description">${job.description}</p>
                <div class="job-footer">
                    <span class="job-salary">${job.salary}</span>
                    <button class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i>
                        Apply Now
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderMentors() {
        const container = document.getElementById('mentors-container');
        container.innerHTML = this.mentors.map(mentor => `
            <div class="mentor-card">
                <div class="mentor-avatar ${mentor.avatar}">
                    <i class="fas fa-user"></i>
                </div>
                <h3 class="mentor-name">${mentor.name}</h3>
                <p class="mentor-role">${mentor.role}</p>
                <div class="mentor-expertise">
                    <span class="expertise-tag">${mentor.expertise}</span>
                </div>
                <p class="mentor-bio">${mentor.bio}</p>
                <button class="btn btn-primary" style="width: 100%;">
                    <i class="fas fa-handshake"></i>
                    Connect
                </button>
            </div>
        `).join('');
    }

    renderContent() {
        this.renderResources();
        this.renderJobs();
        this.renderMentors();
    }

    formatCategory(category) {
        const categories = {
            'career': 'Career Dev',
            'tech': 'Technology',
            'leadership': 'Leadership',
            'entrepreneurship': 'Business'
        };
        return categories[category] || category;
    }

    getNoResultsHTML(type) {
        const messages = {
            resources: 'No resources found matching your criteria. Try selecting a different category.',
            jobs: 'No jobs found matching your filters. Try adjusting your search criteria.'
        };
        
        return `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No ${type} found</h3>
                <p>${messages[type]}</p>
            </div>
        `;
    }

    // Sample data
    resources = [
        {
            id: 1,
            title: "AI & Machine Learning Fundamentals",
            description: "Master the basics of artificial intelligence and machine learning with hands-on projects and real-world applications.",
            category: "tech",
            type: "course",
            level: "Intermediate",
            duration: "8 weeks",
            isFree: false
        },
        {
            id: 2,
            title: "Women in Tech Leadership",
            description: "Develop leadership skills specifically tailored for women in technology roles and organizations.",
            category: "leadership",
            type: "course",
            level: "Advanced",
            duration: "6 weeks",
            isFree: true
        },
        {
            id: 3,
            title: "Startup Funding Strategies",
            description: "Learn how to secure funding for your startup from angel investors and venture capital firms.",
            category: "entrepreneurship",
            type: "workshop",
            level: "All Levels",
            duration: "4 hours",
            isFree: false
        },
        {
            id: 4,
            title: "Digital Marketing Mastery",
            description: "Comprehensive guide to digital marketing strategies for modern businesses and entrepreneurs.",
            category: "career",
            type: "course",
            level: "Beginner",
            duration: "5 weeks",
            isFree: true
        },
        {
            id: 5,
            title: "Blockchain & Web3 Essentials",
            description: "Understand blockchain technology and explore opportunities in the Web3 ecosystem.",
            category: "tech",
            type: "course",
            level: "Intermediate",
            duration: "4 weeks",
            isFree: true
        },
        {
            id: 6,
            title: "Executive Presence & Communication",
            description: "Develop commanding presence and effective communication skills for executive roles.",
            category: "leadership",
            type: "workshop",
            level: "Advanced",
            duration: "2 days",
            isFree: false
        }
    ];

    jobs = [
        {
            id: 1,
            title: "Senior Frontend Engineer",
            company: "TechForHer",
            location: "Remote",
            type: "Full-time",
            category: "Technology",
            experience: "senior",
            description: "Lead frontend development for our women empowerment platform using modern React and TypeScript.",
            salary: "$120,000 - $150,000",
            posted: "2 days ago"
        },
        {
            id: 2,
            title: "Product Marketing Manager",
            company: "WomenLead Inc.",
            location: "New York, NY",
            type: "Full-time",
            category: "Marketing",
            experience: "mid",
            description: "Drive product marketing strategies for our SaaS platform serving women entrepreneurs.",
            salary: "$90,000 - $120,000",
            posted: "1 week ago"
        },
        {
            id: 3,
            title: "UX/UI Designer",
            company: "DesignHer",
            location: "San Francisco, CA",
            type: "Full-time",
            category: "Design",
            experience: "mid",
            description: "Create beautiful and accessible user experiences for our design system and product suite.",
            salary: "$85,000 - $110,000",
            posted: "3 days ago"
        },
        {
            id: 4,
            title: "Data Scientist",
            company: "SheStats",
            location: "Remote",
            type: "Part-time",
            category: "Technology",
            experience: "senior",
            description: "Analyze data to uncover insights about women's economic participation and career progression.",
            salary: "$80,000 - $100,000",
            posted: "5 days ago"
        },
        {
            id: 5,
            title: "Community Manager",
            company: "EmpowerHer Network",
            location: "Remote",
            type: "Full-time",
            category: "Community",
            experience: "entry",
            description: "Build and engage our global community of women professionals and mentors.",
            salary: "$60,000 - $75,000",
            posted: "1 day ago"
        },
        {
            id: 6,
            title: "DevOps Engineer",
            company: "WomenInTech Cloud",
            location: "Austin, TX",
            type: "Full-time",
            category: "Technology",
            experience: "mid",
            description: "Manage cloud infrastructure and CI/CD pipelines for our scalable platform.",
            salary: "$100,000 - $130,000",
            posted: "4 days ago"
        }
    ];

    mentors = [
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            role: "CTO at TechForHer",
            expertise: "AI & Leadership",
            bio: "15+ years leading tech teams, specializing in AI product development and women in tech leadership.",
            avatar: "avatar-purple"
        },
        {
            id: 2,
            name: "Maria Rodriguez",
            role: "Serial Entrepreneur",
            expertise: "Startups & VC",
            bio: "Founder of 3 successful tech startups, raised $50M+ in funding. Passionate about women founders.",
            avatar: "avatar-pink"
        },
        {
            id: 3,
            name: "Dr. Amina Khan",
            role: "Healthcare Innovation Lead",
            expertise: "HealthTech",
            bio: "Leading digital health transformation with 20+ years in healthcare technology and policy.",
            avatar: "avatar-blue"
        },
        {
            id: 4,
            name: "Lisa Chen",
            role: "Investment Partner",
            expertise: "Finance & Strategy",
            bio: "Venture capital investor focusing on women-led startups. Former Fortune 500 strategist.",
            avatar: "avatar-green"
        },
        {
            id: 5,
            name: "Nadia Williams",
            role: "Head of Product Design",
            expertise: "Design Systems",
            bio: "Building inclusive design systems at scale. Mentor for women in design and tech.",
            avatar: "avatar-purple"
        },
        {
            id: 6,
            name: "Dr. Chloe Smith",
            role: "Data Science Director",
            expertise: "ML & Analytics",
            bio: "Leading data science teams and building AI products. Advocate for women in STEM education.",
            avatar: "avatar-pink"
        }
    ];
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmpowerHerApp();
    
    // Add scroll to top functionality
    document.getElementById('scrollTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    console.log('🚀 EmpowerHer Connect - Modern Women Empowerment Platform Loaded!');
});

// Add some modern browser features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // This is where you would register your service worker
        console.log('Service Worker support detected');
    });
}

// Add performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});