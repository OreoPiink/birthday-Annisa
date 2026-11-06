
/* =====================================
   MATRIX DIGITAL ANIMATION
===================================== */

const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

let matrixColumns = [];
const matrixFontSize = 15;

function resizeMatrix() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const columns = Math.floor(canvas.width / matrixFontSize);

  matrixColumns = Array.from(
    { length: columns },
    () => Math.random() * -50
  );
}

function drawMatrix() {
  ctx.fillStyle = "rgba(8, 4, 13, 0.12)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = matrixFontSize + "px monospace";

  const characters = "01FITRIANNISA♥";

  matrixColumns.forEach((y, index) => {
    const character = characters[
      Math.floor(Math.random() * characters.length)
    ];

    ctx.fillStyle = Math.random() > 0.96
      ? "#ffffff"
      : "#ff4fa3";

    ctx.fillText(
      character,
      index * matrixFontSize,
      y * matrixFontSize
    );

    if (
      y * matrixFontSize > canvas.height &&
      Math.random() > 0.975
    ) {
      matrixColumns[index] = 0;
    } else {
      matrixColumns[index] += 0.65;
    }
  });
}

resizeMatrix();
window.addEventListener("resize", resizeMatrix);

let matrixAnimation = setInterval(drawMatrix, 45);


/* =====================================
   TYPING EFFECT
===================================== */

const typingText = document.getElementById("typingText");

const openingText =
  "Initializing birthday experience... Loading special memories...";

let typingIndex = 0;
let typingTimer;

function typeText() {
  clearTimeout(typingTimer);

  if (typingIndex < openingText.length) {
    typingText.textContent += openingText.charAt(typingIndex);

    typingIndex++;

    typingTimer = setTimeout(typeText, 55);
  }
}

typeText();


/* =====================================
   AUDIO DAN MUSIK
===================================== */

const music = document.getElementById("backgroundMusic");

const soundButton = document.getElementById("soundButton");
const soundIcon = document.getElementById("soundIcon");
const soundLabel = document.getElementById("soundLabel");

let musicEnabled = false;
let audioContext = null;

// Volume musik
music.volume = 0.7;

// Update tombol musik
function updateSoundButton() {
  soundIcon.textContent = musicEnabled ? "♫" : "♪";

  soundLabel.textContent = musicEnabled
    ? "MUSIC ON"
    : "MUSIC OFF";

  soundButton.setAttribute(
    "aria-label",
    musicEnabled ? "Matikan musik" : "Nyalakan musik"
  );
}

// Fungsi menyalakan musik
async function enableMusic() {
  try {
    await music.play();

    musicEnabled = true;
    updateSoundButton();

    console.log("MUSIK BERHASIL DIPUTAR");

  } catch (error) {
    musicEnabled = false;
    updateSoundButton();

    console.error("MUSIK GAGAL DIPUTAR:", error);
  }
}

// Fungsi mematikan musik
function disableMusic() {
  music.pause();

  musicEnabled = false;
  updateSoundButton();
}

// Sinkronisasi status musik
music.addEventListener("play", () => {
  musicEnabled = true;
  updateSoundButton();
});

music.addEventListener("pause", () => {
  musicEnabled = false;
  updateSoundButton();
});

music.addEventListener("error", () => {
  console.error(
    "File musik tidak dapat dibaca. Periksa nama dan lokasi sound-tiktok.mp3"
  );
});

// Tombol MUSIC ON/OFF
soundButton.addEventListener("click", () => {
  playSound("click");

  if (music.paused) {
    enableMusic();
  } else {
    disableMusic();
  }
});


/* =====================================
   EFEK SUARA DIGITAL
===================================== */

function playSound(type = "click") {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === "click") {
      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(650, now);

      oscillator.frequency.exponentialRampToValueAtTime(
        900,
        now + 0.09
      );

      gain.gain.setValueAtTime(0.08, now);

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.12
      );

      oscillator.start(now);
      oscillator.stop(now + 0.12);

    } else if (type === "success") {
      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(523, now);
      oscillator.frequency.setValueAtTime(659, now + 0.13);
      oscillator.frequency.setValueAtTime(784, now + 0.26);

      gain.gain.setValueAtTime(0.08, now);

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.55
      );

      oscillator.start(now);
      oscillator.stop(now + 0.55);

    } else if (type === "celebration") {
      oscillator.type = "triangle";

      oscillator.frequency.setValueAtTime(784, now);
      oscillator.frequency.setValueAtTime(988, now + 0.15);
      oscillator.frequency.setValueAtTime(1175, now + 0.3);

      gain.gain.setValueAtTime(0.07, now);

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.7
      );

      oscillator.start(now);
      oscillator.stop(now + 0.7);
    }

  } catch (error) {
    console.log("Audio effect tidak tersedia:", error);
  }
}


/* =====================================
   PINDAH ANTAR BAGIAN
===================================== */

const screens = document.querySelectorAll(".screen");

function showScreen(screenId) {
  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);

  if (target) {
    target.classList.add("active");

    window.scrollTo(0, 0);
  }

  if (screenId === "birthday") {
    playSound("celebration");
  } else {
    playSound("success");
  }
}


/* =====================================
   TOMBOL MULAI
===================================== */

const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {

  // PENTING:
  // music.play() dipanggil langsung saat klik pengguna.
  // Jangan menunggu fungsi async lain sebelum memanggilnya.

  music.volume = 0.7;

  const playPromise = music.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        musicEnabled = true;
        updateSoundButton();

        console.log("MUSIK BERHASIL MENYALA!");
      })
      .catch(error => {
        musicEnabled = false;
        updateSoundButton();

        console.error("MUSIK GAGAL MENYALA:", error);
      });
  }

  playSound("success");

  showScreen("birthday");
});


/* =====================================
   TOMBOL LANJUTKAN
===================================== */

document.querySelectorAll(".next-button").forEach(button => {
  button.addEventListener("click", () => {
    const nextScreen = button.dataset.next;

    if (nextScreen) {
      showScreen(nextScreen);
    }
  });
});


/* =====================================
   ANIMASI TIUP LILIN
===================================== */

const blowButton = document.getElementById("blowButton");

const flame = document.getElementById("flame");

const wishInstruction =
  document.getElementById("wishInstruction");

let candleBlown = false;

blowButton.addEventListener("click", () => {
  if (!candleBlown) {
    candleBlown = true;

    flame.classList.add("off");

    wishInstruction.textContent =
      "Semoga semua harapan indahmu menjadi kenyataan. ♡";

    blowButton.textContent = "WISH SENT ♥";

    playSound("celebration");

  } else {
    wishInstruction.textContent =
      "Sebuah harapan indah untuk Fitri Annisa. ♡";
  }
});


/* =====================================
   REPLAY WEBSITE
===================================== */

const replayButton = document.getElementById("replayButton");

replayButton.addEventListener("click", () => {
  candleBlown = false;

  flame.classList.remove("off");

  blowButton.textContent = "MAKE A WISH ✨";

  wishInstruction.textContent =
    "Tekan tombol di bawah untuk meniup lilin.";

  typingText.textContent = "";

  typingIndex = 0;

  typeText();

  showScreen("opening");
});


/* =====================================
   EFEK SUARA PADA TOMBOL
===================================== */

document.querySelectorAll("button").forEach(button => {

  if (
    button.id !== "startButton" &&
    button.id !== "soundButton" &&
    button.id !== "blowButton"
  ) {
    button.addEventListener("click", () => {
      playSound("click");
    });
  }

});


/* =====================================
   ANIMASI MATRIX SAAT TAB AKTIF
===================================== */

document.addEventListener("visibilitychange", () => {
  clearInterval(matrixAnimation);

  if (!document.hidden) {
    matrixAnimation = setInterval(drawMatrix, 45);
  }
});


/* =====================================
   INISIALISASI
===================================== */

updateSoundButton();
