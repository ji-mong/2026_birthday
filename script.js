document.addEventListener('DOMContentLoaded', () => {
    // 1. RSVP Voting Logic
    const rsvpButtons = document.querySelectorAll('.vote-btn');
    
    rsvpButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            rsvpButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Subtle pop animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 100);
            
            const vote = btn.dataset.vote;
            console.log(`RSVP Selected: ${vote}`);
        });
    });

    // 2. Poll 2nd Round Location Logic
    const radioInputs = document.querySelectorAll('input[name="place-vote"]');
    
    radioInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            // Remove selected class from all wrappers
            document.querySelectorAll('.poll-option-wrapper').forEach(wrapper => {
                wrapper.classList.remove('selected');
            });
            // Add selected class to the checked wrapper
            const wrapper = e.target.closest('.poll-option-wrapper');
            if (wrapper) wrapper.classList.add('selected');
            
            console.log(`2nd Round Voted: ${e.target.value}`);
        });
    });

    // 3. Modal and Carousel Logic
    const modal = document.getElementById('menu-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const menuBtns = document.querySelectorAll('.menu-btn');
    const modalTitle = document.getElementById('modal-place-title');
    
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    
    let currentSlide = 0;
    let slidesCount = 0;

    // Mock data for menus (Using placeholder service as requested)
    const menuData = {
        '달마루': [
            'https://via.placeholder.com/400x300/1e293b/8b5cf6?text=Dalmaru+Menu+1',
            'https://via.placeholder.com/400x300/1e293b/f43f5e?text=Dalmaru+Menu+2',
            'https://via.placeholder.com/400x300/1e293b/10b981?text=Dalmaru+Menu+3'
        ],
        '만재': [
            'https://via.placeholder.com/400x300/1e293b/f59e0b?text=Manjae+Menu+1',
            'https://via.placeholder.com/400x300/1e293b/3b82f6?text=Manjae+Menu+2'
        ],
        '달윤': [
            'https://via.placeholder.com/400x300/1e293b/ec4899?text=Dalyun+Menu+1',
            'https://via.placeholder.com/400x300/1e293b/06b6d4?text=Dalyun+Menu+2',
            'https://via.placeholder.com/400x300/1e293b/a855f7?text=Dalyun+Menu+3',
            'https://via.placeholder.com/400x300/1e293b/ef4444?text=Dalyun+Menu+4'
        ]
    };

    let resizeObserver;

    function setupCarousel(place) {
        const images = menuData[place] || [];
        slidesCount = images.length;
        currentSlide = 0;
        
        // Clear previous
        track.innerHTML = '';
        indicatorsContainer.innerHTML = '';
        
        if (slidesCount === 0) return;

        // Build slides & indicators
        images.forEach((src, idx) => {
            // Slide
            const img = document.createElement('img');
            img.src = src;
            img.className = 'carousel-slide';
            img.alt = `${place} Menu ${idx + 1}`;
            track.appendChild(img);
            
            // Indicator
            const indicator = document.createElement('div');
            indicator.className = `indicator ${idx === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => goToSlide(idx));
            indicatorsContainer.appendChild(indicator);
        });

        updateCarouselUI();
        
        // Ensure flex-shrink is working by checking the container width
        track.style.width = '100%'; 
    }

    function goToSlide(index) {
        if (index < 0 || index >= slidesCount) return;
        currentSlide = index;
        const translateX = -currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        document.querySelectorAll('.indicator').forEach((ind, idx) => {
            ind.classList.toggle('active', idx === currentSlide);
        });
        
        updateCarouselUI();
    }

    function updateCarouselUI() {
        // Hide/Show prev/next buttons based on position
        prevBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
        nextBtn.style.display = currentSlide === slidesCount - 1 ? 'none' : 'flex';
    }

    // Modal Events
    menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const place = btn.dataset.place;
            modalTitle.textContent = `${place} 메뉴`;
            setupCarousel(place);
            modal.classList.add('active');
        });
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Carousel Button Events
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    
    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const threshold = 50; // Minimum swipe distance
        if (touchEndX < touchStartX - threshold) {
            // Swipe Left -> Next
            goToSlide(currentSlide + 1);
        }
        if (touchEndX > touchStartX + threshold) {
            // Swipe Right -> Prev
            goToSlide(currentSlide - 1);
        }
    }
});
