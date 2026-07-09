(function () {
  var state = { view: 'about', openId: null, transitioning: false };
  var goToTimer = null;

  var projectMap = {
    health: {
      title: 'Health Journal Assistant',
      description: 'This is an AI-assisted personal health journal that:',
      bullets: [
        'Conversationally captures your daily symptoms',
        'Remembers recurring triggers',
        'Builds correlations over time',
        'Surfaces possible patterns',
        'Helps you prepare for doctor visits',
        'Turns vague feelings into trackable signals'
      ],
      appUrl: '#', githubUrl: 'https://github.com/shuyanyan/health-journal',
      preview: 'assets/healthjournal.gif'
    },
    stylist: {
      title: 'AI Stylist',
      wipNote: '✎ still a WIP — a few design prototypes below',
      gallery: [
        { src: 'assets/ai-stylist-1.png', note: 'describe a feeling, or auto-pick an outfit' },
        { src: 'assets/ai-stylist-4.png', note: 'AI generates a mood board based on your input' },
        { src: 'assets/ai-stylist-3.png', note: 'final looks, using clothes from your own closet' }
      ],
      appUrl: '#', githubUrl: 'https://github.com/shuyanyan/ai-stylist'
    },
    ordering: {
      title: 'College Ordering App',
      wide: true,
      accent: '#4a7aa6',
      description: 'A 2-interface app with ordering and order-tracking features, enabling online ordering for both customers and vendors. It helps reduce the wait for customers to get a drink, and increases vendor efficiency.',
      media: [
        { src: 'assets/ordering-customer.gif', label: 'Customer', caption: 'Customer-facing front: place order, track order status' },
        { src: 'assets/ordering-vendor.gif', label: 'Vendor', caption: 'Vendor-facing front: place order, inventory management, mark order status' }
      ],
      appUrl: '#', githubUrl: 'https://github.com/shuyanyan/college-ordering'
    },
    music: {
      title: 'Music Map',
      wide: true,
      accent: '#8a6db0',
      description: 'Music Map provides a social space for people to share music related to locations that hold special meanings to them. Additionally, Music Map empowers users who seek human-recommended music to discover or rediscover "new" music enriched with special personal meanings and stories.',
      media: [
        { src: 'assets/music-map-intro.png', label: 'Landing', caption: 'Click the map to drop a note, or click an existing note to browse songs shared at that location' },
        { src: 'assets/music-map-add-note.png', label: 'Add a note', caption: 'Search for a song, add an optional username and note, then attach it to a location' },
        { src: 'assets/music-map-view-note.png', label: 'View notes', caption: 'Browse songs shared at a location, complete with personal stories, likes, and replies' }
      ],
      appUrl: '#', githubUrl: 'https://github.com/shuyanyan/music-map'
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
    } else if (p.media) {
      var mediaAccent = p.accent || '#4a7aa6';
      modalMedia.innerHTML = p.media.map(function (m) {
        return '<div style="text-align:left;">' +
          '<img src="' + m.src + '" alt="" style="display:block; width:100%; border-radius:10px; border:1px solid #e2d8c6;">' +
          '<div style="margin-top:10px; font-family:\'Space Mono\',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:' + mediaAccent + ';">' + m.label + '</div>' +
          '<div style="margin-top:3px; font-family:\'Space Mono\',monospace; font-size:12.5px; line-height:1.55; color:#4a4036;">' + m.caption + '</div>' +
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
    modalAppLink.href = p.appUrl;
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

  applyView();
})();
