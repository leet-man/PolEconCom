const ANIMATION_DURATION = 8000;
const headerColors = [
    { pct: 0, color: "#000000" },
    { pct: 25, color: "#37377f" },
    { pct: 50, color: "#377f37" },
    { pct: 75, color: "#7f3737" },
    { pct: 100, color: "#000000" }
];
const navColors = [
    { pct: 0, color: "#000000" },
    { pct: 25, color: "#7f3737" },
    { pct: 50, color: "#377f37" },
    { pct: 75, color: "#37377f" },
    { pct: 100, color: "#000000" }
];
const footerColors = [
    { pct: 0, color: "#377f37" },
    { pct: 25, color: "#7f3737" },
    { pct: 50, color: "#000000" },
    { pct: 75, color: "#37377f" },
    { pct: 100, color: "#377f37" }
];

function interpolateColor(colors, pct) {
    let i = 1;
    while (i < colors.length && pct > colors[i].pct) i++;
    const prev = colors[i - 1];
    const next = colors[i];
    const range = next.pct - prev.pct;
    const rangePct = (pct - prev.pct) / range;
    const hex = (a, b) => Math.round(a + (b - a) * rangePct);
    const c1 = prev.color.match(/\w\w/g).map(x => parseInt(x, 16));
    const c2 = next.color.match(/\w\w/g).map(x => parseInt(x, 16));
    return `#${hex(c1[0], c2[0]).toString(16).padStart(2, "0")}${hex(c1[1], c2[1]).toString(16).padStart(2, "0")}${hex(c1[2], c2[2]).toString(16).padStart(2, "0")}`;
}

let startTime = Date.now();
const savedOffset = parseInt(localStorage.getItem("colorAnimOffset") || "0", 10);

function animateColors() {
    const now = Date.now();
    const elapsed = (now - startTime + savedOffset) % ANIMATION_DURATION;
    const pct = (elapsed / ANIMATION_DURATION) * 100;

    const header = document.querySelector("header");
    if (header) header.style.backgroundColor = interpolateColor(headerColors, pct);

    document.querySelectorAll("nav a").forEach(a => a.style.backgroundColor = interpolateColor(navColors, pct));

    const footer = document.querySelector("footer");
    if (footer) footer.style.backgroundColor = interpolateColor(footerColors, pct);

    requestAnimationFrame(animateColors);
}
animateColors();

window.addEventListener("beforeunload", () => {
    const now = Date.now();
    const elapsed = (now - startTime + savedOffset) % ANIMATION_DURATION;
    localStorage.setItem("colorAnimOffset", elapsed);
});

document.addEventListener("DOMContentLoaded", () => {
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        let current = 0;
        const sections = document.querySelectorAll('.question-section');
        if (localStorage.getItem('quizCurrent')) {
            current = parseInt(localStorage.getItem('quizCurrent'), 10) || 0;
        }
        function showQuestion(index) {
            sections.forEach((sec, i) => {
                sec.style.display = i === index ? 'block' : 'none';
            });
            localStorage.setItem('quizCurrent', index);
        }
        function nextQuestion() {
            const currentSection = sections[current];
            const radios = currentSection.querySelectorAll('input[type="radio"]');
            let answered = false;
            radios.forEach(radio => {
                if (radio.checked) answered = true;
            });
            if (!answered) {
                alert('Please select an answer before continuing.');
                return;
            }
            if (current < sections.length - 1) {
                current++;
                showQuestion(current);
            }
        }
        function prevQuestion() {
            if (current > 0) {
                current--;
                showQuestion(current);
            }
        }
        quizForm.onsubmit = function(e) {
            e.preventDefault();
            alert('Quiz submitted!');
        };
        window.nextQuestion = nextQuestion;
        window.prevQuestion = prevQuestion;
        showQuestion(current);
    }
});