/* ============================================================
   DIGIAVTAAR.AI — APPLICATION LOGIC
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Base URL for API calls (supports both port 8080 and Live Server port 5500)
  const API_BASE = window.location.port === '8080' ? '' : 'http://localhost:8080';

  // Video Elements & State
  const video = document.getElementById('main-video');
  const videoSource = document.getElementById('video-source');
  const videoCard = document.getElementById('video-card');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const bigPlayBtn = document.getElementById('big-play-btn');
  const replayBtn = document.getElementById('replay-btn');
  const playIcon = playPauseBtn.querySelector('.play-icon');
  const pauseIcon = playPauseBtn.querySelector('.pause-icon');
  const videoOverlay = document.getElementById('video-overlay');
  const unmuteBanner = document.getElementById('unmute-banner');
  const unmuteActionBtn = document.getElementById('unmute-action-btn');
  const progressContainer = document.getElementById('progress-container');
  const progressFilled = document.getElementById('progress-filled');
  const progressHandle = document.getElementById('progress-handle');
  const timeDisplay = document.getElementById('time-display');
  const volumeSlider = document.getElementById('volume-slider');
  const muteBtn = document.getElementById('mute-btn');
  const volumeIcon = muteBtn.querySelector('.volume-icon');
  const muteIcon = muteBtn.querySelector('.mute-icon');
  const speedBtn = document.getElementById('speed-btn');
  const speedMenu = document.getElementById('speed-menu');
  const theatreBtn = document.getElementById('theatre-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const waveformOverlay = document.getElementById('waveform-overlay');
  const downloadBtn = document.getElementById('download-btn');
  const copyLinkBtn = document.getElementById('copy-link-btn');
  const shareBtn = document.getElementById('share-btn');

  // Quick Video Cards
  const quickEnCard = document.getElementById('quick-en-card');
  const quickHiCard = document.getElementById('quick-hi-card');

  // Language Tabs
  const tabEn = document.getElementById('tab-en');
  const tabHinglish = document.getElementById('tab-hinglish');
  const pillSlider = document.getElementById('pill-slider');
  const currentLangPill = document.getElementById('current-lang-pill');
  const scriptLangIndicator = document.getElementById('script-lang-indicator');
  const scriptEn = document.getElementById('script-en');
  const scriptHinglish = document.getElementById('script-hinglish');

  // Hinglish sub tabs
  const subRomanBtn = document.getElementById('sub-roman-btn');
  const subDevBtn = document.getElementById('sub-dev-btn');
  const hinglishRomanView = document.getElementById('hinglish-roman-view');
  const hinglishDevView = document.getElementById('hinglish-dev-view');

  // Video Data Catalog
  const videoCatalog = {
    en: {
      url: 'videos/digital_literacy_en.mp4',
      poster: 'assets/anita_classroom.png',
      langName: 'English (Indian Accent)',
      scriptTag: 'English Script',
      downloadName: 'Digital_Literacy_Anita_English.mp4'
    },
    hinglish: {
      url: 'videos/digital_literacy_hinglish.mp4',
      poster: 'assets/anita_classroom.png',
      langName: 'Hinglish (Colloquial Youth)',
      scriptTag: 'Hinglish Script',
      downloadName: 'Digital_Literacy_Anita_Hinglish.mp4'
    }
  };

  let currentLang = 'en';

  // ------------------------------------------------------------
  // AUTOPLAY & UNMUTE HANDLING
  // ------------------------------------------------------------
  // Attempt autoplay muted immediately so Anita is moving and speaking visually on load
  video.muted = true;
  video.play().then(() => {
    showPlayOverlay(false);
  }).catch(err => {
    console.log('Autoplay deferred until user interaction:', err);
    showPlayOverlay(true);
  });

  function enableAudio() {
    video.muted = false;
    video.volume = 1;
    volumeSlider.value = 1;
    updateVolumeIcon();
    unmuteBanner.classList.add('hidden');
    video.currentTime = 0;
    video.play().catch(e => console.log('Play:', e));
    showToast('🔊 Audio enabled! Anita speaking in ' + videoCatalog[currentLang].langName);
  }

  if (unmuteActionBtn) {
    unmuteActionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      enableAudio();
    });
  }

  // ------------------------------------------------------------
  // LANGUAGE SWITCHER
  // ------------------------------------------------------------
  function switchLanguage(lang) {
    if (currentLang === lang) return;
    currentLang = lang;

    const data = videoCatalog[lang];
    const wasMuted = video.muted;

    if (lang === 'en') {
      tabEn.classList.add('active');
      tabHinglish.classList.remove('active');
      tabEn.setAttribute('aria-selected', 'true');
      tabHinglish.setAttribute('aria-selected', 'false');
      pillSlider.style.transform = 'translateX(0%)';

      scriptEn.classList.remove('hidden');
      scriptHinglish.classList.add('hidden');

      if (quickEnCard) quickEnCard.classList.add('active');
      if (quickHiCard) quickHiCard.classList.remove('active');
    } else {
      tabHinglish.classList.add('active');
      tabEn.classList.remove('active');
      tabHinglish.setAttribute('aria-selected', 'true');
      tabEn.setAttribute('aria-selected', 'false');
      pillSlider.style.transform = 'translateX(100%)';

      scriptHinglish.classList.remove('hidden');
      scriptEn.classList.add('hidden');

      if (quickHiCard) quickHiCard.classList.add('active');
      if (quickEnCard) quickEnCard.classList.remove('active');
    }

    currentLangPill.textContent = data.langName;
    scriptLangIndicator.textContent = data.scriptTag;
    downloadBtn.href = data.url;
    downloadBtn.setAttribute('download', data.downloadName);

    // Swap Video Source
    video.pause();
    videoSource.src = data.url;
    video.load();

    video.currentTime = 0;
    video.muted = wasMuted;
    video.play().then(() => {
      showPlayOverlay(false);
    }).catch(() => {
      showPlayOverlay(true);
    });

    showToast(`Switched to ${data.langName} video edition`);
  }

  tabEn.addEventListener('click', () => switchLanguage('en'));
  tabHinglish.addEventListener('click', () => switchLanguage('hinglish'));

  if (quickEnCard) quickEnCard.addEventListener('click', () => switchLanguage('en'));
  if (quickHiCard) quickHiCard.addEventListener('click', () => switchLanguage('hinglish'));

  // Hinglish Sub Tab Switching
  if (subRomanBtn && subDevBtn) {
    subRomanBtn.addEventListener('click', () => {
      subRomanBtn.classList.add('active');
      subDevBtn.classList.remove('active');
      hinglishRomanView.classList.remove('hidden');
      hinglishDevView.classList.add('hidden');
    });

    subDevBtn.addEventListener('click', () => {
      subDevBtn.classList.add('active');
      subRomanBtn.classList.remove('active');
      hinglishDevView.classList.remove('hidden');
      hinglishRomanView.classList.add('hidden');
    });
  }

  // ------------------------------------------------------------
  // VIDEO CONTROLS LOGIC
  // ------------------------------------------------------------
  function togglePlay() {
    if (video.paused || video.ended) {
      if (video.muted && !unmuteBanner.classList.contains('hidden')) {
        enableAudio();
      } else {
        video.play();
      }
    } else {
      video.pause();
    }
  }

  function showPlayOverlay(show) {
    if (show) {
      videoOverlay.classList.remove('hidden');
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
      waveformOverlay.classList.remove('active');
    } else {
      videoOverlay.classList.add('hidden');
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
      waveformOverlay.classList.add('active');
    }
  }

  playPauseBtn.addEventListener('click', togglePlay);
  bigPlayBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  video.addEventListener('play', () => showPlayOverlay(false));
  video.addEventListener('pause', () => showPlayOverlay(true));
  video.addEventListener('ended', () => {
    showPlayOverlay(true);
    progressFilled.style.width = '100%';
    progressHandle.style.left = '100%';
  });

  replayBtn.addEventListener('click', () => {
    video.currentTime = 0;
    video.play();
  });

  // Time formatting helper
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Video Time Update & Teleprompter Highlighting
  video.addEventListener('timeupdate', () => {
    const cur = video.currentTime;
    const dur = video.duration || 1;
    const pct = (cur / dur) * 100;

    progressFilled.style.width = `${pct}%`;
    progressHandle.style.left = `${pct}%`;

    timeDisplay.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;

    // Sync Teleprompter
    syncTeleprompter(cur);
  });

  function syncTeleprompter(curTime) {
    const activeWrapper = currentLang === 'en' ? scriptEn : scriptHinglish;
    const sentences = activeWrapper.querySelectorAll('.script-sentence');

    sentences.forEach(s => {
      const start = parseFloat(s.getAttribute('data-start'));
      const end = parseFloat(s.getAttribute('data-end'));
      if (!isNaN(start) && !isNaN(end)) {
        if (curTime >= start && curTime <= end) {
          s.classList.add('highlight-active');
        } else {
          s.classList.remove('highlight-active');
        }
      }
    });
  }

  // Scrubbing on Progress Bar
  let isDragging = false;

  function scrub(e) {
    const rect = progressContainer.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pos * (video.duration || 1);
  }

  progressContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    scrub(e);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) scrub(e);
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) isDragging = false;
  });

  // Volume & Mute
  volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value;
    video.muted = (video.volume === 0);
    if (!video.muted && unmuteBanner) unmuteBanner.classList.add('hidden');
    updateVolumeIcon();
  });

  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (video.muted) {
      volumeSlider.value = 0;
    } else {
      volumeSlider.value = video.volume || 1;
      if (unmuteBanner) unmuteBanner.classList.add('hidden');
    }
    updateVolumeIcon();
  });

  function updateVolumeIcon() {
    if (video.muted || video.volume === 0) {
      volumeIcon.classList.add('hidden');
      muteIcon.classList.remove('hidden');
    } else {
      volumeIcon.classList.remove('hidden');
      muteIcon.classList.add('hidden');
    }
  }

  // Playback Speed
  speedBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    speedMenu.classList.toggle('hidden');
  });

  speedMenu.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const speed = parseFloat(btn.getAttribute('data-speed'));
      video.playbackRate = speed;
      speedBtn.textContent = `${speed}x`;
      speedMenu.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      speedMenu.classList.add('hidden');
    });
  });

  window.addEventListener('click', () => {
    if (!speedMenu.classList.contains('hidden')) {
      speedMenu.classList.add('hidden');
    }
  });

  // Theatre Mode
  theatreBtn.addEventListener('click', () => {
    videoCard.classList.toggle('theatre-mode');
    const isTheatre = videoCard.classList.contains('theatre-mode');
    showToast(isTheatre ? 'Cinema mode activated' : 'Cinema mode closed');
  });

  // Fullscreen
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      const container = document.getElementById('video-frame-container');
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
  });

  // Copy Link & Share
  copyLinkBtn.addEventListener('click', () => {
    const fullUrl = window.location.origin + '/' + videoCatalog[currentLang].url;
    navigator.clipboard.writeText(fullUrl).then(() => {
      showToast('Direct video URL copied to clipboard!');
    }).catch(() => {
      showToast('URL: ' + fullUrl);
    });
  });

  shareBtn.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: 'Digital Literacy AI Avatar — Anita',
        text: 'Watch Anita, an Indian teenager AI avatar, explain digital literacy in English & Hinglish!',
        url: window.location.href
      }).catch(e => console.log('Share error:', e));
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Page link copied to clipboard!');
    }
  });

  // ------------------------------------------------------------
  // D-ID API CREDITS FETCHER
  // ------------------------------------------------------------
  async function fetchCredits() {
    try {
      const res = await fetch(`${API_BASE}/api/credits`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      const credits = data.remaining !== undefined ? data.remaining : (data.credits?.[0]?.remaining ?? '--');
      
      const badge = document.getElementById('credits-count');
      const genBadge = document.getElementById('gen-credits-count');
      if (badge) badge.textContent = credits;
      if (genBadge) genBadge.textContent = `${credits} Credits`;
    } catch (e) {
      console.warn('Credits fetch error:', e);
    }
  }

  fetchCredits();

  // ------------------------------------------------------------
  // INTERACTIVE CYBER QUIZ
  // ------------------------------------------------------------
  const quizQuestions = [
    {
      q: 'A gaming tournament admin on Discord requests your WhatsApp OTP to "verify your tournament entry". What should you do?',
      options: [
        { text: 'Share the OTP quickly before the slot fills up.', correct: false },
        { text: 'Never share! It is an account takeover scam trying to hijack your number.', correct: true },
        { text: 'Share only the last 3 digits of the OTP.', correct: false }
      ],
      explanation: 'Golden Rule from Anita: Legitimate admins never ask for OTPs. Sharing an OTP gives attackers complete control of your account.'
    },
    {
      q: 'You receive an urgent WhatsApp message claiming "Govt is giving free tablets to all students, click here now!" What is the smart step?',
      options: [
        { text: 'Forward it to all your school WhatsApp groups immediately.', correct: false },
        { text: 'Verify the news on the official Government portal or PIB Fact Check before sharing.', correct: true },
        { text: 'Click the link and enter your Aadhaar details.', correct: false }
      ],
      explanation: 'Spotting Fake Forwards: Always pause and verify viral claims on official govt domains (.gov.in) before forwarding.'
    },
    {
      q: 'Which of the following makes the strongest and safest password according to digital literacy best practices?',
      options: [
        { text: 'Rahul@2008 (Name + Birth year)', correct: false },
        { text: '12345678#Abc', correct: false },
        { text: 'Mango#Thunder*Pencil!92 (4 random words combined with symbols)', correct: true }
      ],
      explanation: 'Passphrase Security: Multi-word passphrases with symbols resist brute-force attacks far better than predictable names or birth years.'
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;

  const qNumberEl = document.getElementById('q-number');
  const qTitleEl = document.getElementById('q-title');
  const optionsListEl = document.getElementById('options-list');
  const quizFeedbackEl = document.getElementById('quiz-feedback');
  const feedbackTextEl = document.getElementById('feedback-text');
  const nextQBtn = document.getElementById('next-q-btn');
  const quizFillEl = document.getElementById('quiz-fill');

  function renderQuestion(index) {
    const q = quizQuestions[index];
    qNumberEl.textContent = `Question ${index + 1} of ${quizQuestions.length}`;
    qTitleEl.textContent = q.q;
    quizFillEl.style.width = `${((index + 1) / quizQuestions.length) * 100}%`;
    quizFeedbackEl.classList.add('hidden');

    optionsListEl.innerHTML = '';
    const letters = ['A', 'B', 'C'];

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="opt-letter">${letters[idx]}</span>
        <span class="opt-text">${opt.text}</span>
      `;
      btn.addEventListener('click', () => handleOptionClick(btn, opt.correct, q.explanation));
      optionsListEl.appendChild(btn);
    });
  }

  function handleOptionClick(selectedBtn, isCorrect, explanation) {
    const allBtns = optionsListEl.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      selectedBtn.classList.add('correct');
      score++;
      feedbackTextEl.innerHTML = `🎉 <strong>Correct!</strong> ${explanation}`;
    } else {
      selectedBtn.classList.add('incorrect');
      // Highlight the correct one
      allBtns.forEach(b => {
        if (b.querySelector('.opt-text').textContent.includes(quizQuestions[currentQuestionIndex].options.find(o => o.correct).text)) {
          b.classList.add('correct');
        }
      });
      feedbackTextEl.innerHTML = `⚠️ <strong>Not quite!</strong> ${explanation}`;
    }

    quizFeedbackEl.classList.remove('hidden');

    if (currentQuestionIndex === quizQuestions.length - 1) {
      nextQBtn.textContent = 'View Final Score';
    } else {
      nextQBtn.textContent = 'Next Question';
    }
  }

  nextQBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      renderQuestion(currentQuestionIndex);
    } else {
      // Quiz completed
      optionsListEl.innerHTML = '';
      qNumberEl.textContent = 'Quiz Completed! 🌟';
      qTitleEl.textContent = `You scored ${score} out of ${quizQuestions.length}!`;
      feedbackTextEl.innerHTML = score === 3 
        ? '🏆 <strong>Outstanding!</strong> You are a Certified Cyber-Smart Teenager!' 
        : '👍 <strong>Good job!</strong> Keep practicing digital literacy hygiene.';
      nextQBtn.textContent = 'Retake Quiz';
      nextQBtn.onclick = () => {
        currentQuestionIndex = 0;
        score = 0;
        renderQuestion(0);
      };
    }
  });

  renderQuestion(0);

  // ------------------------------------------------------------
  // LIVE AI AVATAR STUDIO GENERATOR
  // ------------------------------------------------------------
  const scriptInput = document.getElementById('custom-script-input');
  const charCounter = document.getElementById('char-counter');
  const langSelect = document.getElementById('gen-language-select');
  const presenterSelect = document.getElementById('gen-presenter-select');
  const generateBtn = document.getElementById('generate-video-btn');
  const statusBox = document.getElementById('gen-status-box');
  const statusTitle = document.getElementById('status-title');
  const statusSub = document.getElementById('status-sub');
  const genProgressBar = document.getElementById('gen-progress-bar');
  const previewPlaceholder = document.getElementById('preview-placeholder');
  const customVideoWrapper = document.getElementById('custom-video-wrapper');
  const customVideoPlayer = document.getElementById('custom-video-player');
  const customVideoSource = document.getElementById('custom-video-source');
  const customDownloadBtn = document.getElementById('custom-download-btn');

  // Char Counter
  scriptInput.addEventListener('input', () => {
    const len = scriptInput.value.length;
    charCounter.textContent = `${len} / 250 chars`;
  });

  // Quick template chips
  document.querySelectorAll('.chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      scriptInput.value = chip.getAttribute('data-text');
      scriptInput.dispatchEvent(new Event('input'));
      scriptInput.focus();
    });
  });

  // Generation Trigger
  generateBtn.addEventListener('click', async () => {
    const text = scriptInput.value.trim();
    if (!text) {
      showToast('Please type a message or choose a template first!');
      scriptInput.focus();
      return;
    }

    generateBtn.disabled = true;
    statusBox.classList.remove('hidden');
    genProgressBar.style.width = '15%';
    statusTitle.textContent = 'Contacting D-ID Neural API...';
    statusSub.textContent = 'Submitting script to upper-body presenter engine...';

    try {
      const payload = {
        script: text,
        language: langSelect.value,
        presenter_id: presenterSelect.value
      };

      const res = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.description || data.error || 'Failed to start generation');
      }

      const clipId = data.id;
      statusTitle.textContent = 'Synthesizing Neural Avatar Video...';
      statusSub.textContent = `Rendering clip [${clipId}] & lipsync...`;
      genProgressBar.style.width = '35%';

      // Start Polling
      pollClipStatus(clipId);
    } catch (err) {
      statusBox.classList.add('hidden');
      generateBtn.disabled = false;
      showToast(`Generation Error: ${err.message}`);
    }
  });

  async function pollClipStatus(clipId) {
    let pollCount = 0;
    const maxPolls = 30;

    const interval = setInterval(async () => {
      pollCount++;
      const currentPct = Math.min(90, 35 + pollCount * 3);
      genProgressBar.style.width = `${currentPct}%`;

      try {
        const res = await fetch(`${API_BASE}/api/clip-status/${clipId}`);
        const data = await res.json();

        if (data.status === 'done') {
          clearInterval(interval);
          genProgressBar.style.width = '100%';
          statusTitle.textContent = 'Rendering Complete!';
          statusSub.textContent = 'Serving video directly to preview player.';

          setTimeout(() => {
            statusBox.classList.add('hidden');
            generateBtn.disabled = false;

            const videoUrl = data.local_video_url || data.result_url;
            previewPlaceholder.classList.add('hidden');
            customVideoWrapper.classList.remove('hidden');
            customVideoSource.src = videoUrl;
            customVideoPlayer.load();
            customVideoPlayer.play().catch(e => console.log('Autoplay:', e));

            customDownloadBtn.href = videoUrl;
            showToast('🎉 Your custom AI avatar video is ready!');
            fetchCredits();
          }, 800);
        } else if (data.status === 'error') {
          clearInterval(interval);
          statusBox.classList.add('hidden');
          generateBtn.disabled = false;
          showToast(`Error from D-ID: ${data.error?.message || 'Processing failed'}`);
        }
      } catch (e) {
        console.warn('Poll error:', e);
      }

      if (pollCount >= maxPolls) {
        clearInterval(interval);
        statusBox.classList.add('hidden');
        generateBtn.disabled = false;
        showToast('Processing took too long. Check API credits.');
      }
    }, 3000);
  }

  // ------------------------------------------------------------
  // TOAST HELPER
  // ------------------------------------------------------------
  function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
