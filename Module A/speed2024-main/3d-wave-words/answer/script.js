const container = document.querySelector('.container');
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

for (let i = 0; i < 1600; i++) {
    const word = document.createElement('div');
    word.className = 'word';
    word.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
    container.appendChild(word);
}

function applyWave() {
    const words = document.querySelectorAll('.word');
    let time = 0;
    function animateWave() {
        time += 0.05;
        words.forEach((box, index) => {
            const x = index % 40;
            const y = Math.floor(index / 40);
            const offset = Math.sin(x * 0.5 + time) * Math.sin(y * 0.5 + time) * 20;
            box.style.transform = `translateZ(${offset}px)`;
        });
        requestAnimationFrame(animateWave);
    }

    animateWave();
}

applyWave();