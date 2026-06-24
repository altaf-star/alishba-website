/* ══════════════════════════════════════════════════
   LOADING SCREEN
══════════════════════════════════════════════════ */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('gone');
        spawnHeartRain(22);
    }, 2200);
});

/* ══════════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════════ */
const curDot  = Object.assign(document.createElement('div'), { className:'cur-dot' });
const curRing = Object.assign(document.createElement('div'), { className:'cur-ring' });
document.body.append(curDot, curRing);

let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    curDot.style.cssText = `left:${mx}px;top:${my}px;`;
    maybeSpawnTrail(mx, my);
});

(function ringLoop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    curRing.style.cssText = `left:${rx}px;top:${ry}px;`;
    requestAnimationFrame(ringLoop);
})();

/* ══════════════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════════════ */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = pct + '%';
}, { passive: true });

/* ══════════════════════════════════════════════════
   FLOATING HEARTS BACKGROUND
══════════════════════════════════════════════════ */
const heartsBg  = document.getElementById('hearts-bg');
const heartGlyphs = ['❤️','💕','💖','💗','💓','💝','🌹','✨','💞','🌸'];

function spawnFH() {
    const el = document.createElement('div');
    el.className = 'fh';
    el.textContent = heartGlyphs[Math.floor(Math.random() * heartGlyphs.length)];
    el.style.cssText = `
        left:${Math.random()*100}%;
        font-size:${(Math.random()*1.4+0.6).toFixed(2)}rem;
        animation-duration:${(Math.random()*14+10).toFixed(1)}s;
        animation-delay:${(Math.random()*8).toFixed(1)}s;
        opacity:${(Math.random()*0.28+0.1).toFixed(2)};
    `;
    heartsBg.appendChild(el);
    setTimeout(() => el.remove(), 26000);
}
for (let i = 0; i < 12; i++) setTimeout(spawnFH, i * 300);
setInterval(spawnFH, 1800);

/* ══════════════════════════════════════════════════
   PARTICLES CANVAS
══════════════════════════════════════════════════ */
const pCanvas = document.getElementById('particles-canvas');
const pCtx    = pCanvas.getContext('2d');

function resizeCanvases() {
    pCanvas.width  = tCanvas.width  = window.innerWidth;
    pCanvas.height = tCanvas.height = window.innerHeight;
}

class Star {
    constructor() { this.init(); }
    init() {
        this.x   = Math.random() * pCanvas.width;
        this.y   = Math.random() * pCanvas.height;
        this.r   = Math.random() * 1.8 + 0.3;
        this.vx  = (Math.random() - 0.5) * 0.35;
        this.vy  = (Math.random() - 0.5) * 0.35;
        this.a   = Math.random() * 0.55 + 0.08;
        this.col = Math.random() > 0.5 ? '#ff6b9d' : '#a78bfa';
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > pCanvas.width || this.y < 0 || this.y > pCanvas.height) this.init();
    }
    draw() {
        pCtx.save();
        pCtx.globalAlpha = this.a;
        pCtx.fillStyle   = this.col;
        pCtx.shadowColor = this.col;
        pCtx.shadowBlur  = 7;
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.restore();
    }
}

const stars = Array.from({ length: 140 }, () => new Star());

(function animStars() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    stars.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animStars);
})();

/* ══════════════════════════════════════════════════
   MOUSE TRAIL / SPARKLES
══════════════════════════════════════════════════ */
const tCanvas = document.getElementById('trail-canvas');
const tCtx    = tCanvas.getContext('2d');
resizeCanvases();
window.addEventListener('resize', resizeCanvases, { passive: true });

const trails = [];

function maybeSpawnTrail(x, y) {
    if (Math.random() > 0.35) return;
    trails.push({
        x, y,
        vx: (Math.random() - 0.5) * 3.5,
        vy: (Math.random() - 0.5) * 3.5 - 1.2,
        a:  1,
        s:  Math.random() * 5 + 2,
        col: Math.random() > 0.5 ? '#ff6b9d' : '#ffd700',
        ch: Math.random() > 0.55 ? '✦' : '·'
    });
}

(function animTrails() {
    tCtx.clearRect(0, 0, tCanvas.width, tCanvas.height);
    for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i];
        t.x += t.vx; t.y += t.vy; t.a -= 0.045;
        if (t.a <= 0) { trails.splice(i, 1); continue; }
        tCtx.save();
        tCtx.globalAlpha = t.a;
        tCtx.fillStyle   = t.col;
        tCtx.font        = `${t.s * 3}px Arial`;
        tCtx.fillText(t.ch, t.x, t.y);
        tCtx.restore();
    }
    requestAnimationFrame(animTrails);
})();

/* ══════════════════════════════════════════════════
   HERO BUTTON → SCROLL + HEART RAIN
══════════════════════════════════════════════════ */
document.getElementById('open-heart-btn').addEventListener('click', () => {
    spawnHeartRain(35);
    document.getElementById('love-letter').scrollIntoView({ behavior: 'smooth' });
});

/* ══════════════════════════════════════════════════
   HEART RAIN
══════════════════════════════════════════════════ */
const hrContainer = document.getElementById('heart-rain');

function spawnHeartRain(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'rh';
            el.textContent = heartGlyphs[Math.floor(Math.random() * heartGlyphs.length)];
            const dur = (Math.random() * 2 + 2).toFixed(2);
            el.style.cssText = `
                left:${Math.random()*100}%;
                font-size:${(Math.random()*1.6+0.9).toFixed(2)}rem;
                animation-duration:${dur}s;
                opacity:${(Math.random()*0.5+0.4).toFixed(2)};
            `;
            hrContainer.appendChild(el);
            setTimeout(() => el.remove(), parseFloat(dur) * 1000 + 200);
        }, i * 75);
    }
}

/* ══════════════════════════════════════════════════
   TYPING ANIMATION — LOVE LETTER
══════════════════════════════════════════════════ */
const LETTER = `My love,

I don't know if today is one of those difficult days — or one of those days when everything feels overwhelming.

But I want you to know something.

You are loved. You are appreciated. You are important.

No mood swing, bad day, stress, or sadness can change how much you mean to me.

Even on your hardest days, I will still choose you.

Again. And again. And again.

❤️`;

let letterDone = false;

function runTypingAnimation() {
    if (letterDone) return;
    letterDone = true;

    const el = document.getElementById('letter-text');
    el.innerHTML = '';

    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    el.appendChild(cursor);

    let i = 0;
    function tick() {
        if (i >= LETTER.length) {
            setTimeout(() => cursor.remove(), 2500);
            return;
        }
        const ch = LETTER[i++];
        cursor.insertAdjacentText('beforebegin', ch);
        setTimeout(tick, ch === '\n' ? 90 : 32);
    }
    tick();
}

/* ══════════════════════════════════════════════════
   INTERSECTION OBSERVER — SCROLL REVEAL
══════════════════════════════════════════════════ */
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
    });
}, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

/* Dedicated observer for the letter section */
new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) setTimeout(runTypingAnimation, 400);
}, { threshold: 0.25 }).observe(document.getElementById('love-letter'));

/* Dedicated observer for final section */
new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) runFinalAnimation();
}, { threshold: 0.35 }).observe(document.getElementById('final'));

/* ══════════════════════════════════════════════════
   INTERACTIVE HEART
══════════════════════════════════════════════════ */
const bigHeart = document.getElementById('big-heart');
let beatSpeed  = 1.6;

bigHeart.addEventListener('click', () => {
    beatSpeed = Math.max(0.28, beatSpeed - 0.22);
    bigHeart.style.animationDuration = beatSpeed + 's';
    burstParticles(bigHeart);

    clearTimeout(bigHeart._rst);
    bigHeart._rst = setTimeout(() => {
        beatSpeed = 1.6;
        bigHeart.style.animationDuration = '1.6s';
    }, 5000);
});

function burstParticles(origin) {
    const rc = origin.getBoundingClientRect();
    const cx = rc.left + rc.width  / 2;
    const cy = rc.top  + rc.height / 2;

    for (let i = 0; i < 14; i++) {
        const p = document.createElement('div');
        p.textContent = heartGlyphs[Math.floor(Math.random() * 5)];
        p.style.cssText = `
            position:fixed;left:${cx}px;top:${cy}px;
            font-size:${(Math.random()*1.3+0.7).toFixed(2)}rem;
            pointer-events:none;z-index:9999;
            transition:transform 1s ease-out, opacity 1s ease-out;
        `;
        document.body.appendChild(p);

        const angle = (i / 14) * Math.PI * 2;
        const dist  = Math.random() * 110 + 55;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            p.style.transform = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist - 50}px)`;
            p.style.opacity   = '0';
        }));
        setTimeout(() => p.remove(), 1050);
    }
}

/* ══════════════════════════════════════════════════
   MINI GAME
══════════════════════════════════════════════════ */
function pickAnswer() {
    document.getElementById('game-q').classList.add('hidden');
    document.getElementById('game-result').classList.remove('hidden');
    launchConfetti();
    spawnHeartRain(22);
}

function resetGame() {
    document.getElementById('game-q').classList.remove('hidden');
    document.getElementById('game-result').classList.add('hidden');
}

function launchConfetti() {
    const box    = document.getElementById('confetti-box');
    const colors = ['#ff6b9d','#ffd700','#a78bfa','#ff4757','#2ed573','#74b9ff','#fd79a8'];

    for (let i = 0; i < 90; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'cf';
            const size = Math.random() * 11 + 5;
            const dur  = (Math.random() * 2.5 + 2).toFixed(2);
            el.style.cssText = `
                left:${Math.random()*100}%;
                width:${size}px;height:${size}px;
                background:${colors[Math.floor(Math.random()*colors.length)]};
                border-radius:${Math.random()>0.5?'50%':'3px'};
                animation-duration:${dur}s;
                opacity:1;
            `;
            box.appendChild(el);
            setTimeout(() => el.remove(), parseFloat(dur)*1000 + 300);
        }, i * 28);
    }
}

/* ══════════════════════════════════════════════════
   FINAL SECTION WORD-BY-WORD ANIMATION
══════════════════════════════════════════════════ */
let finalDone = false;

function runFinalAnimation() {
    if (finalDone) return;
    finalDone = true;

    const mainEl = document.getElementById('final-words-el');
    const loveEl = document.getElementById('final-love-el');

    const mainWords = 'let me carry some of it with you.'.split(' ');
    const loveWords = 'I love you ❤️'.split(' ');

    mainWords.forEach((word, i) => {
        setTimeout(() => {
            const s = document.createElement('span');
            s.textContent = word + ' ';
            s.style.cssText = `
                display:inline-block;opacity:0;transform:translateY(22px);
                transition:all .55s cubic-bezier(.4,0,.2,1);
                background:linear-gradient(135deg,#ffffff,#ffb3c6);
                -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                background-clip:text;
            `;
            mainEl.appendChild(s);
            requestAnimationFrame(() => requestAnimationFrame(() => {
                s.style.opacity   = '1';
                s.style.transform = 'translateY(0)';
            }));
        }, i * 195);
    });

    const loveDelay = mainWords.length * 195 + 700;

    loveWords.forEach((word, i) => {
        setTimeout(() => {
            const s = document.createElement('span');
            s.textContent = word + ' ';
            s.style.cssText = `
                display:inline-block;opacity:0;transform:scale(0.4);
                transition:all .6s cubic-bezier(.34,1.56,.64,1);
            `;
            loveEl.appendChild(s);
            requestAnimationFrame(() => requestAnimationFrame(() => {
                s.style.opacity   = '1';
                s.style.transform = 'scale(1)';
            }));
        }, loveDelay + i * 380);
    });

    setTimeout(() => spawnHeartRain(45), loveDelay + loveWords.length * 380 + 200);
}

/* ══════════════════════════════════════════════════
   MUSIC PLAYER
══════════════════════════════════════════════════ */
const musicBtn  = document.getElementById('music-btn');
const musicIcon = document.getElementById('music-icon');
const bgMusic   = document.getElementById('bg-music');
let playing = false;

musicBtn.addEventListener('click', () => {
    if (playing) {
        bgMusic.pause();
        musicIcon.textContent = '♪';
        musicBtn.classList.remove('playing');
    } else {
        bgMusic.play().catch(() => {});
        musicIcon.textContent = '⏸';
        musicBtn.classList.add('playing');
    }
    playing = !playing;
});

/* ══════════════════════════════════════════════════
   PARALLAX — HERO GLOW FOLLOWS SCROLL
══════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    if (hero) hero.style.backgroundPositionY = (window.scrollY * 0.45) + 'px';
}, { passive: true });

/* ══════════════════════════════════════════════════
   PROTECT PHOTO FROM RIGHT-CLICK
══════════════════════════════════════════════════ */
document.querySelector('.photo-frame')?.addEventListener('contextmenu', e => e.preventDefault());
