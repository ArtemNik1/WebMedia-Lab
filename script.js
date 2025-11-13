// Аудио плеер
const audioElement = document.getElementById('audioElement');
const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const audioSelect = document.getElementById('audioSelect');

playPauseBtn.addEventListener('click', () => {
    if (audioElement.paused) {
        audioElement.play();
        playPauseBtn.textContent = '⏸️';
    } else {
        audioElement.pause();
        playPauseBtn.textContent = '▶️';
    }
});

muteBtn.addEventListener('click', () => {
    audioElement.muted = !audioElement.muted;
    muteBtn.textContent = audioElement.muted ? '🔇' : '🔊';
});

volumeSlider.addEventListener('input', () => {
    audioElement.volume = volumeSlider.value;
});

audioSelect.addEventListener('change', () => {
    audioElement.src = audioSelect.value;
    audioElement.load();
    playPauseBtn.textContent = '▶️';
});

// Видео плеер
const videoElement = document.getElementById('videoElement');
const videoPlayPauseBtn = document.getElementById('videoPlayPauseBtn');
const videoMuteBtn = document.getElementById('videoMuteBtn');
const videoVolumeSlider = document.getElementById('videoVolumeSlider');
const videoSelect = document.getElementById('videoSelect');

videoPlayPauseBtn.addEventListener('click', () => {
    if (videoElement.paused) {
        videoElement.play();
        videoPlayPauseBtn.textContent = '⏸️';
    } else {
        videoElement.pause();
        videoPlayPauseBtn.textContent = '▶️';
    }
});

videoMuteBtn.addEventListener('click', () => {
    videoElement.muted = !videoElement.muted;
    videoMuteBtn.textContent = videoElement.muted ? '🔇' : '🔊';
});

videoVolumeSlider.addEventListener('input', () => {
    videoElement.volume = videoVolumeSlider.value;
});

videoSelect.addEventListener('change', () => {
    videoElement.src = videoSelect.value;
    videoElement.load();
    videoPlayPauseBtn.textContent = '▶️';
});

// Canvas анимация
const animationCanvas = document.getElementById('animationCanvas');
const ctx = animationCanvas.getContext('2d');
const startAnimationBtn = document.getElementById('startAnimation');
const stopAnimationBtn = document.getElementById('stopAnimation');
const ballColorInput = document.getElementById('ballColor');
const speedControl = document.getElementById('speedControl');

let animationId = null;
const balls = [];
const ballCount = 15;

class Ball {
    constructor() {
        this.radius = Math.random() * 20 + 10;
        this.x = Math.random() * (animationCanvas.width - this.radius * 2) + this.radius;
        this.y = Math.random() * (animationCanvas.height - this.radius * 2) + this.radius;
        this.dx = (Math.random() - 0.5) * 5;
        this.dy = (Math.random() - 0.5) * 5;
        this.color = ballColorInput.value;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        const speed = speedControl.value / 2;
        
        if (this.x + this.radius > animationCanvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > animationCanvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx * speed;
        this.y += this.dy * speed;
    }
}

function initBalls() {
    balls.length = 0;
    for (let i = 0; i < ballCount; i++) {
        balls.push(new Ball());
    }
}

function animate() {
    ctx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
    
    balls.forEach(ball => {
        ball.color = ballColorInput.value;
        ball.update();
        ball.draw();
    });
    
    animationId = requestAnimationFrame(animate);
}

startAnimationBtn.addEventListener('click', () => {
    if (!animationId) {
        initBalls();
        animate();
    }
});

stopAnimationBtn.addEventListener('click', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
});

// Обработка изображений
const imageCanvas = document.getElementById('imageCanvas');
const imageCtx = imageCanvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const grayscaleBtn = document.getElementById('grayscaleBtn');
const sepiaBtn = document.getElementById('sepiaBtn');
const invertBtn = document.getElementById('invertBtn');
const resetImageBtn = document.getElementById('resetImageBtn');
const saveImageBtn = document.getElementById('saveImageBtn');
const resizeSlider = document.getElementById('resizeSlider');

let originalImage = null;
let currentImage = null;

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                currentImage = img;
                drawImageOnCanvas(img);
                resizeSlider.value = 100;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function drawImageOnCanvas(img, width = imageCanvas.width, height = imageCanvas.height) {
    imageCanvas.width = width;
    imageCanvas.height = height;
    imageCtx.clearRect(0, 0, width, height);
    imageCtx.drawImage(img, 0, 0, width, height);
}

function applyFilter(filterFunction) {
    if (!currentImage) return;
    
    const imageData = imageCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const newColors = filterFunction(r, g, b);
        
        data[i] = newColors.r;
        data[i + 1] = newColors.g;
        data[i + 2] = newColors.b;
    }
    
    imageCtx.putImageData(imageData, 0, 0);
}

grayscaleBtn.addEventListener('click', () => {
    applyFilter((r, g, b) => {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        return { r: gray, g: gray, b: gray };
    });
});

sepiaBtn.addEventListener('click', () => {
    applyFilter((r, g, b) => {
        return {
            r: Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189)),
            g: Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)),
            b: Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
        };
    });
});

invertBtn.addEventListener('click', () => {
    applyFilter((r, g, b) => {
        return { r: 255 - r, g: 255 - g, b: 255 - b };
    });
});

resetImageBtn.addEventListener('click', () => {
    if (originalImage) {
        currentImage = originalImage;
        drawImageOnCanvas(originalImage);
        resizeSlider.value = 100;
    }
});

resizeSlider.addEventListener('input', () => {
    if (originalImage) {
        const scale = resizeSlider.value / 100;
        const newWidth = originalImage.width * scale;
        const newHeight = originalImage.height * scale;
        drawImageOnCanvas(originalImage, newWidth, newHeight);
    }
});

saveImageBtn.addEventListener('click', () => {
    if (currentImage) {
        const link = document.createElement('a');
        link.download = 'processed-image.png';
        link.href = imageCanvas.toDataURL();
        link.click();
    }
});

// Инициализация
initBalls();