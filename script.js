document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Sticky Navigation & Scroll Highlighting
  // ==========================================================================
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  // Track active section in viewport
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // ==========================================================================
  // 2. Mobile Menu Toggle
  // ==========================================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================================================
  // 3. Typewriter Effect
  // ==========================================================================
  const words = [
    "Co-founder & CTO at PayCore Egypt.",
    "Architecting PCI-DSS & cloud-native payment platforms.",
    "20+ years of system & security architecture.",
    "World Quality Commitment Award recipient (2014).",
    "Customizing AI agents and workflows for real-world business utility.",
    "Writing Arabic novels & poetry—believing code is poetry."
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterText = document.getElementById('typewriter-text');
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const delayBetweenWords = 2000;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let dynamicSpeed = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      dynamicSpeed = delayBetweenWords;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      dynamicSpeed = 500;
    }

    setTimeout(type, dynamicSpeed);
  }

  if (typewriterText) {
    setTimeout(type, 1000);
  }

  // ==========================================================================
  // 4. Parallax Profile Card Effect (3D Tilt)
  // ==========================================================================
  const tiltCard = document.querySelector('.profile-card-wrapper');
  
  if (tiltCard) {
    tiltCard.addEventListener('mousemove', (e) => {
      const cardRect = tiltCard.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;
      
      // Calculate mouse coordinates relative to the center of the card
      const mouseX = e.clientX - cardRect.left - cardWidth / 2;
      const mouseY = e.clientY - cardRect.top - cardHeight / 2;
      
      // Calculate rotation angles (max 15 degrees)
      const rotateX = -(mouseY / (cardHeight / 2)) * 12;
      const rotateY = (mouseX / (cardWidth / 2)) * 12;
      
      // Apply the rotation
      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    tiltCard.addEventListener('mouseleave', () => {
      // Smoothly reset translation
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // ==========================================================================
  // 5. Timeline Category Filter & Expanded Details
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineLine = document.querySelector('.timeline-line');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          // Let animation play, then hide
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
      
      // Re-draw or reset timeline height indicator line
      setTimeout(recalculateTimelineLine, 350);
    });
  });

  function recalculateTimelineLine() {
    if (!timelineLine) return;
    
    const visibleItems = Array.from(timelineItems).filter(item => item.style.display !== 'none');
    if (visibleItems.length === 0) {
      timelineLine.style.height = '0%';
      return;
    }
    
    const firstItem = visibleItems[0];
    const lastItem = visibleItems[visibleItems.length - 1];
    
    const firstOffset = firstItem.offsetTop + 32; // Offset to start at dot center
    const lastOffset = lastItem.offsetTop + 32;
    const totalHeight = lastOffset - firstOffset;
    
    timelineLine.style.top = `${firstOffset}px`;
    timelineLine.style.height = `${totalHeight}px`;
  }

  // Expandable details logic
  const expandBtns = document.querySelectorAll('.timeline-expand-btn');

  expandBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.timeline-card');
      const expandedContent = card.querySelector('.timeline-expanded-content');
      
      const isExpanded = btn.classList.toggle('expanded');
      expandedContent.classList.toggle('show');
      
      if (isExpanded) {
        btn.querySelector('.btn-text').textContent = 'Show Less';
      } else {
        btn.querySelector('.btn-text').textContent = 'Read Details';
      }
      
      // Re-render timeline line since heights changed
      setTimeout(recalculateTimelineLine, 450);
    });
  });

  // Recalculate timeline on window resize
  window.addEventListener('resize', recalculateTimelineLine);
  setTimeout(recalculateTimelineLine, 500);

  // ==========================================================================
  // 6. Copy Email to Clipboard Functionality
  // ==========================================================================
  const copyBtn = document.getElementById('copy-email-btn');
  const tooltipAlert = document.getElementById('tooltip-alert');

  if (copyBtn && tooltipAlert) {
    copyBtn.addEventListener('click', () => {
      const email = 'hani@pm.me';
      
      navigator.clipboard.writeText(email).then(() => {
        // Show tooltip
        tooltipAlert.classList.add('show');
        
        // Hide tooltip after 2 seconds
        setTimeout(() => {
          tooltipAlert.classList.remove('show');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }

  // ==========================================================================
  // 7. Interactive Resume Hub Modal & Tab Switching Logic
  // ==========================================================================
  const modalBackdrop = document.getElementById('resume-modal');
  const openResumeNav = document.getElementById('open-resume-nav');
  const openResumeHero = document.getElementById('open-resume-hero');
  const closeResumeModal = document.getElementById('close-resume-modal');

  function showResumeModal(e) {
    if (e) e.preventDefault();
    if (modalBackdrop) {
      modalBackdrop.classList.add('active');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function hideResumeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = 'auto';
    }
  }

  if (openResumeNav) openResumeNav.addEventListener('click', showResumeModal);
  if (openResumeHero) openResumeHero.addEventListener('click', showResumeModal);
  if (closeResumeModal) closeResumeModal.addEventListener('click', hideResumeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        hideResumeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        hideResumeModal();
      }
    });
  }

  // Resume Hub Modal Tab Switching
  const tabs = [
    { btn: document.getElementById('tab-master'), pane: document.getElementById('pane-master') },
    { btn: document.getElementById('tab-exec'), pane: document.getElementById('pane-exec') },
    { btn: document.getElementById('tab-advisory'), pane: document.getElementById('pane-advisory') }
  ];

  tabs.forEach(tab => {
    if (tab.btn && tab.pane) {
      tab.btn.addEventListener('click', () => {
        tabs.forEach(t => {
          if (t.btn && t.pane) {
            if (t.btn === tab.btn) {
              t.btn.classList.add('active');
              t.btn.setAttribute('aria-selected', 'true');
              t.pane.classList.add('active');
            } else {
              t.btn.classList.remove('active');
              t.btn.setAttribute('aria-selected', 'false');
              t.pane.classList.remove('active');
            }
          }
        });
      });
    }
  });
});

