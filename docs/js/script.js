(function () {
  var state = { view: 'about', openId: null, transitioning: false };
  var goToTimer = null;

  var projectMap = {
    health: {
      title: 'Health Journal Assistant',
      wide: true,
      accent: '#2B9B65',
      items: [
        { type: 'image', src: 'assets/personal-projects-screenshots/health-journal-landing.png', label: 'Landing', caption: 'Landing page that remembers your previously entered symptoms' },
        { type: 'flip', images: ['assets/personal-projects-screenshots/health-journal-convo1.png', 'assets/personal-projects-screenshots/health-journal-convo2.png'], label: 'Conversation', caption: 'The AI asks context-aware follow-up questions and draws on general health knowledge to infer possible contributors to your symptoms, comparing what you\'re experiencing now against your historical patterns and recurring personal triggers.' },
        { type: 'image', src: 'assets/personal-projects-screenshots/health-journal-tracking.png', label: 'History', caption: 'View your past entries' },
        { type: 'image', src: 'assets/personal-projects-screenshots/health-journal-AI-insights.png', label: 'Insights', caption: 'AI generates personalized insights for you based on your logged history. It builds correlations over time, surfaces possible patterns, and helps you prepare for your doctor visits.' }
      ],
      appUrl: 'https://health-journal-flax.vercel.app/', githubUrl: 'https://github.com/shuyan1128/health-journal'
    },
    stylist: {
      title: 'AI Stylist',
      wipNote: '✎ still a WIP — a few design prototypes below',
      gallery: [
        { src: 'assets/personal-projects-screenshots/ai-stylist-1.png', note: 'describe a feeling, or auto-pick an outfit' },
        { src: 'assets/personal-projects-screenshots/ai-stylist-4.png', note: 'AI generates a mood board based on your input' },
        { src: 'assets/personal-projects-screenshots/ai-stylist-3.png', note: 'final looks, using clothes from your own closet' }
      ],
      githubUrl: 'https://github.com/shuyan1128/outfit-ai'
    },
    ordering: {
      title: 'Milk + Honey Online Ordering App',
      wide: true,
      accent: '#4a7aa6',
      media: [
        { src: 'assets/personal-projects-screenshots/ordering-customer.gif', label: 'Customer', caption: 'Sign-in/up, place orders online, track order status' },
        { src: 'assets/personal-projects-screenshots/ordering-vendor.gif', label: 'Vendor', caption: 'Place orders, manage inventory, mark order status' }
      ],
      appUrl: 'https://jyumohfour.github.io/milk-honey-ordering-SaaS/#/menu', githubUrl: 'https://github.com/jyumohfour/milk-honey-ordering-SaaS'
    },
    music: {
      title: 'Music Map',
      wide: true,
      accent: '#CD4B2B',
      media: [
        { src: 'assets/personal-projects-screenshots/music-map-intro.png', label: 'Landing', caption: 'Click the map to drop a note, or click an existing note to browse songs shared at that location' },
        { src: 'assets/personal-projects-screenshots/music-map-add-note.png', label: 'Add a note', caption: 'Search for a song, add an optional username and note, then attach it to a location' },
        { src: 'assets/personal-projects-screenshots/music-map-view-note.png', label: 'View notes', caption: 'Browse songs shared at a location, complete with personal stories, likes, and replies' }
      ],
      appUrl: 'assets/personal-projects-screenshots/music-map-design-doc.pdf', appLabel: '↗ Design doc', githubUrl: 'https://github.com/angiezh/MusicMap'
    }
  };

  var viewRoot = document.getElementById('view-root');
  var sections = {
    about: document.getElementById('view-about'),
    work: document.getElementById('view-work'),
    projects: document.getElementById('view-projects')
  };
  var navButtons = {
    about: document.getElementById('nav-about'),
    work: document.getElementById('nav-work'),
    projects: document.getElementById('nav-projects')
  };
  var inFlowNav = document.getElementById('in-flow-nav');
  var modal = document.getElementById('project-modal');
  var modalPanel = document.getElementById('modal-panel');
  var modalPreviewWrap = document.getElementById('modal-preview-wrap');
  var modalPreview = document.getElementById('modal-preview');
  var modalWipNote = document.getElementById('modal-wip-note');
  var modalTitle = document.getElementById('modal-title');
  var modalOneLiner = document.getElementById('modal-oneliner');
  var modalDescription = document.getElementById('modal-description');
  var modalBullets = document.getElementById('modal-bullets');
  var modalGallery = document.getElementById('modal-gallery');
  var modalMedia = document.getElementById('modal-media');
  var modalAppLink = document.getElementById('modal-app-link');
  var modalGithubLink = document.getElementById('modal-github-link');

  function applyView() {
    Object.keys(sections).forEach(function (key) {
      sections[key].classList.toggle('hidden', key !== state.view);
      navButtons[key].classList.toggle('active', key === state.view);
    });
    inFlowNav.style.display = state.view === 'about' ? 'none' : 'flex';
  }

  window.goTo = function (view) {
    if (view === state.view || state.transitioning) return;
    var start = window.scrollY;
    window.scrollTo({ top: 0, behavior: start > 40 ? 'smooth' : 'auto' });
    var delay = start > 40 ? 260 : 120;
    state.transitioning = true;
    viewRoot.classList.add('transitioning');
    clearTimeout(goToTimer);
    goToTimer = setTimeout(function () {
      state.view = view;
      applyView();
      state.transitioning = false;
      viewRoot.classList.remove('transitioning');
    }, delay);
  };

  window.openProject = function (id) {
    var p = projectMap[id];
    if (!p) return;
    state.openId = id;

    modalPanel.style.maxWidth = p.wide ? 'clamp(380px,94vw,760px)' : 'clamp(380px,90vw,560px)';

    if (p.preview) {
      modalPreview.src = p.preview;
      modalPreviewWrap.style.display = 'flex';
    } else {
      modalPreview.src = '';
      modalPreviewWrap.style.display = 'none';
    }
    if (p.wipNote) {
      modalWipNote.textContent = p.wipNote;
      modalWipNote.style.display = 'block';
    } else {
      modalWipNote.textContent = '';
      modalWipNote.style.display = 'none';
    }
    modalTitle.textContent = p.title;

    // Reset every switchable content block, then clear its content, so nothing
    // from a previously opened project can leak into this one.
    modalOneLiner.style.display = 'none';
    modalOneLiner.textContent = '';
    modalDescription.style.display = 'none';
    modalDescription.textContent = '';
    modalBullets.style.display = 'none';
    modalBullets.innerHTML = '';
    modalGallery.style.display = 'none';
    modalGallery.innerHTML = '';
    modalMedia.style.display = 'none';
    modalMedia.innerHTML = '';

    if (p.description) {
      modalDescription.textContent = p.description;
      modalDescription.style.display = 'block';
    }
    if (p.gallery) {
      var rotations = ['rotate(-4deg) translateX(-6px)', 'rotate(3deg) translateX(8px)', 'rotate(-2deg) translateX(-3px)'];
      var pins = ['pin-red.png', 'pin-teal.png', 'pin-pink-small.png'];
      modalGallery.innerHTML = p.gallery.map(function (g, i) {
        return '<div style="position:relative; background:#fff; padding:10px 10px 22px; border-radius:3px; box-shadow:0 10px 20px rgba(43,36,29,0.18); transform:' + rotations[i % rotations.length] + '; margin:0 auto 32px; width:82%; max-width:280px;">' +
          '<img src="' + g.src + '" alt="" style="display:block; width:100%; border-radius:2px;">' +
          '<div style="margin-top:12px; text-align:center; font-family:\'Space Mono\',monospace; font-size:12.5px; color:#a2206e; line-height:1.5;">' + g.note + '</div>' +
          '<img src="assets/' + pins[i % pins.length] + '" alt="" style="position:absolute; top:-14px; left:50%; transform:translateX(-50%) rotate(-6deg); width:26px; pointer-events:none;">' +
        '</div>';
      }).join('');
      modalGallery.style.display = 'block';
    } else if (p.items) {
      var itemsAccent = p.accent || '#4a7aa6';
      modalMedia.innerHTML = p.items.map(function (item, idx) {
        var imgSrc = item.type === 'flip' ? item.images[0] : item.src;
        var flipBtn = item.type === 'flip'
          ? '<button type="button" class="flip-btn" data-flip-idx="' + idx + '" aria-label="Show next image" style="position:absolute; bottom:12px; right:12px; width:34px; height:34px; border-radius:50%; border:none; background:rgba(43,36,29,0.75); color:#fffdf6; font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center;">→</button>'
          : '';
        return '<div style="text-align:left; max-width:380px; margin:0 auto;">' +
          '<div style="position:relative;">' +
            '<img class="flip-img" data-flip-idx="' + idx + '" src="' + imgSrc + '" alt="" style="display:block; width:100%; border-radius:10px; border:1px solid #e2d8c6;">' +
            flipBtn +
          '</div>' +
          '<div style="margin-top:10px; font-family:\'Space Mono\',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:' + itemsAccent + ';">' + item.label + '</div>' +
          '<div style="margin-top:3px; font-family:\'Hanken Grotesk\',sans-serif; font-size:12.5px; line-height:1.55; color:#4a4036;">' + item.caption + '</div>' +
        '</div>';
      }).join('');
      modalMedia.style.display = 'flex';
      modalMedia.querySelectorAll('.flip-btn').forEach(function (btn) {
        var idx = btn.getAttribute('data-flip-idx');
        var images = p.items[idx].images;
        var pos = 0;
        var img = modalMedia.querySelector('.flip-img[data-flip-idx="' + idx + '"]');
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          pos = (pos + 1) % images.length;
          img.src = images[pos];
        });
      });
    } else if (p.media) {
      var mediaAccent = p.accent || '#4a7aa6';
      modalMedia.innerHTML = p.media.map(function (m) {
        return '<div style="text-align:left; max-width:380px; margin:0 auto;">' +
          '<img src="' + m.src + '" alt="" style="display:block; width:100%; border-radius:10px; border:1px solid #e2d8c6;">' +
          '<div style="margin-top:10px; font-family:\'Space Mono\',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:' + mediaAccent + ';">' + m.label + '</div>' +
          '<div style="margin-top:3px; font-family:\'Hanken Grotesk\',sans-serif; font-size:12.5px; line-height:1.55; color:#4a4036;">' + m.caption + '</div>' +
        '</div>';
      }).join('');
      modalMedia.style.display = 'flex';
    } else if (p.bullets) {
      modalBullets.innerHTML = p.bullets.map(function (b) {
        return '<li style="display:flex; gap:8px; font-size:13.5px; line-height:1.5; color:#4a4036;"><span style="color:var(--accent,#b5613a); flex-shrink:0;">→</span><span>' + b + '</span></li>';
      }).join('');
      modalBullets.style.display = 'flex';
    } else if (p.oneLiner) {
      modalOneLiner.textContent = p.oneLiner;
      modalOneLiner.style.display = 'block';
    }
    if (p.appUrl) {
      modalAppLink.href = p.appUrl;
      modalAppLink.textContent = p.appLabel || '↗ View app';
      modalAppLink.style.display = 'flex';
    } else {
      modalAppLink.style.display = 'none';
    }
    modalGithubLink.href = p.githubUrl;
    modal.classList.remove('hidden');
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  };

  window.closeProject = function () {
    state.openId = null;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeProject();
  });

  function playPostcardEntrance() {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pieces = document.querySelectorAll('.ds-postcard-anim');
    pieces.forEach(function (el, i) {
      if (reduceMotion) return;
      var rot = 'rotate(var(--rot, 0deg))';
      var anim = el.animate([
        { opacity: 0, transform: 'translateY(28px) scale(0.92) ' + rot },
        { opacity: 1, transform: 'translateY(0) scale(1) ' + rot }
      ], {
        duration: 550,
        delay: i * 90,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'both'
      });
      // Hand control back to normal CSS (so :hover lift works) once entrance settles.
      anim.onfinish = function () { anim.cancel(); };
    });
  }

  applyView();
  playPostcardEntrance();
})();
