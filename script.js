let ANIMATION_DURATION = 8000; // Duration of the color animation in milliseconds.
let headerColors = [
    { pct: 0, color: "#000000" }, // Start with black.
    { pct: 25, color: "#37377f" }, // Transition to dark blue.
    { pct: 50, color: "#377f37" }, // Transition to green.
    { pct: 75, color: "#7f3737" }, // Transition to red.
    { pct: 100, color: "#000000" } // End with black again.
];
let navColors = [
    { pct: 0, color: "#000000" }, // Start with black.
    { pct: 25, color: "#7f3737" }, // Transition to red.
    { pct: 50, color: "#377f37" }, // Transition to green.
    { pct: 75, color: "#37377f" }, // Transition to dark blue.
    { pct: 100, color: "#000000" } // End with black again.
];
let footerColors = [
    // The footer colors are the same as the header colors, but reversed.
    { pct: 0, color: "#377f37" }, // Start with green.
    { pct: 25, color: "#7f3737" }, // Transition to red.
    { pct: 50, color: "#000000" }, // Transition to black.
    { pct: 75, color: "#37377f" }, // Transition to dark blue.
    { pct: 100, color: "#377f37" } // End with green again.
];
function interpolateColor(colors, pct) {
    let i = 1; // Start at the second color since the first is always 0%.
    while (i < colors.length && pct > colors[i].pct) i++; // Find the right segment in the gradient.
    let prev = colors[i - 1]; // The previous color in the gradient.
    let next = colors[i]; // The next color in the gradient.
    let range = next.pct - prev.pct; // The range between the two colors.
    let rangePct = (pct - prev.pct) / range; // The percentage within the range.
    let hex = function (a, b) { return Math.round(a + (b - a) * rangePct); }; // Interpolates between two values based on the range percentage.
    let c1 = prev.color.match(/\w\w/g).map(function (x) { return parseInt(x, 16); }); // Converts the previous color from hex to RGB.
    let c2 = next.color.match(/\w\w/g).map(function (x) { return parseInt(x, 16); }); // Converts the next color from hex to RGB.
    return "#".concat(hex(c1[0], c2[0]).toString(16).padStart(2, "0")).concat(hex(c1[1], c2[1]).toString(16).padStart(2, "0")).concat(hex(c1[2], c2[2]).toString(16).padStart(2, "0")); // Returns the interpolated color in hex format.
}
let startTime = Date.now(); // Records the start time of the animation.
// Retrieves the saved offset from localStorage to continue the animation from where it left off.
const rawOffset = localStorage.getItem("colorAnimOffset"); // Gets the saved offset from localStorage, which is used to continue the animation from where it left off.
// Parses the saved offset, defaulting to 0 if it's not a valid number.
// This allows the animation to resume from the last point instead of starting over.
// If the saved offset is not a number, it defaults to 0.
// This ensures that the animation can continue seamlessly across page reloads.
const savedOffset = isNaN(parseInt(rawOffset, 10)) ? 0 : parseInt(rawOffset, 10); // Parses the saved offset as an integer, defaulting to 0 if it's not a valid number.
// Saves the current elapsed time to localStorage before the page is unloaded.
// This ensures that the animation can continue from the same point next time the page is loaded.
// The saved offset is calculated as the elapsed time since the start of the animation, adjusted by any saved offset.
// This allows the animation to resume from the last point instead of starting over.
window.addEventListener("beforeunload", () => { // Adds an event listener for the beforeunload event, which is triggered when the user is about to leave the page.
    // Calculates the current elapsed time since the start of the animation, adjusted by any saved offset.
    // This ensures that the animation can continue from the same point next time the page is loaded.
    // The elapsed time is calculated as the difference between the current time and the start time,
    const currentElapsed = (Date.now() - startTime + savedOffset) % ANIMATION_DURATION; // Ensures the elapsed time wraps around after reaching the animation duration.
    // Saves the current elapsed time to localStorage so that it can be used to continue the animation from the same point next time.
    // This allows the animation to resume seamlessly across page reloads.
    // The saved offset is stored as a string in localStorage.
    // This ensures that the animation can continue from the last point instead of starting over.
    // The modulo operation ensures that the elapsed time wraps around after reaching the animation duration.
    // This allows the animation to resume seamlessly across page reloads.
    localStorage.setItem("colorAnimOffset", currentElapsed); // Saves the current elapsed time to localStorage.
    // This allows the animation to resume from the last point instead of starting over.
    // The saved offset is used to continue the animation from where it left off.
    // This ensures that the animation can continue seamlessly across page reloads.
    // The saved offset is calculated as the elapsed time since the start of the animation, adjusted by any saved offset.
    // This allows the animation to resume from the last point instead of starting over.
});
function animateColors() {
    let now = Date.now(); // Gets the current time.
    // Calculates the elapsed time since the start of the animation, adjusted by any saved offset.
    let elapsed = (now - startTime + savedOffset) % ANIMATION_DURATION; // Ensures the elapsed time wraps around after reaching the animation duration.
    // Calculates the percentage of the animation completed based on the elapsed time.
    let pct = (elapsed / ANIMATION_DURATION) * 100; // Converts the elapsed time to a percentage of the total animation duration.
    let header = document.querySelector("header"); // Selects the header element.
    // If the header exists, sets its background color based on the current percentage of the animation.
    if (header)
        header.style.backgroundColor = interpolateColor(headerColors, pct); // Interpolates the color for the header based on the percentage.
    document.querySelectorAll("nav a").forEach(function (a) { return a.style.backgroundColor = interpolateColor(navColors, pct); }); // Selects all navigation links and sets their background color based on the current percentage of the animation.
    let footer = document.querySelector("footer"); // Selects the footer element.
    // If the footer exists, sets its background color based on the current percentage of the animation.
    if (footer)
        footer.style.backgroundColor = interpolateColor(footerColors, pct); // Interpolates the color for the footer based on the percentage.
    requestAnimationFrame(animateColors); // Requests the next animation frame to continue the color animation loop.
}
animateColors(); // Starts the color animation loop.
window.addEventListener("beforeunload", function () {
    let now = Date.now(); // Gets the current time again to calculate the elapsed time.
    // Calculates the elapsed time since the start of the animation, adjusted by any saved offset.
    let elapsed = (now - startTime + savedOffset) % ANIMATION_DURATION; // Ensures the elapsed time wraps around after reaching the animation duration.
    // Saves the elapsed time to localStorage so that it can be used to continue the animation from the same point next time.
    localStorage.setItem("colorAnimOffset", elapsed); // Saves the current animation offset to localStorage.
});
document.addEventListener("DOMContentLoaded", function () {
    let quizForm = document.getElementById('quizForm'); // Selects the quiz form element by its ID.
    // If the quiz form exists, initializes the quiz navigation logic.
    if (quizForm) { // If the quiz form is found, proceed with the quiz logic.
        // Initializes the current question index to 0 or retrieves it from localStorage.
        let current_1 = 0; // Default to the first question.
        // Selects all question sections within the quiz form.
        let sections_1 = document.querySelectorAll('.question-section'); // Selects all elements with the class 'question-section' within the quiz form.
        // If a current question index is saved in localStorage, use it; otherwise, default to 0.
        if (localStorage.getItem('quizCurrent')) { // Checks if there is a saved current question index in localStorage.
            // If a saved index exists, parse it as an integer; otherwise, default to 0.
            current_1 = parseInt(localStorage.getItem('quizCurrent'), 10) || 0; // Parses the saved index from localStorage, defaulting to 0 if it doesn't exist.
        }
        function showQuestion(index) {
            // Hides all sections and shows only the section at the specified index.
            sections_1.forEach(function (sec, i) {
                // Sets the display style of each section based on whether its index matches the current index.
                sec.style.display = i === index ? 'block' : 'none';
            }); // Sets the display of the current section to 'block' and others to 'none'.
            // Updates the current question index in localStorage to remember the user's progress.
            localStorage.setItem('quizCurrent', index); // Saves the current question index to localStorage so it can be retrieved later.
        }
        function nextQuestion() {
            // Checks if the current section has any radio buttons and if at least one is selected.
            let currentSection = sections_1[current_1]; // Gets the current section based on the current index.
            // Selects all radio buttons within the current section.
            let radios = currentSection.querySelectorAll('input[type="radio"]'); // Selects all radio input elements within the current section.
            // Checks if at least one radio button is checked.
            let answered = false; // Initializes a flag to check if an answer has been selected.
            // Loops through all radio buttons to see if any are checked.
            radios.forEach(function (radio) {
                // If a radio button is checked, sets the answered flag to true.
                if (radio.checked)
                    answered = true;
            }); // Checks if an answer has been selected before proceeding to the next question.
            // If no answer is selected, alerts the user to select an answer before continuing.
            if (!answered) {
                alert('Please select an answer before continuing.');
                return; // Exits the function if no answer is selected.
            }
            if (current_1 < sections_1.length - 1) {
                current_1++;
                showQuestion(current_1); // Advances to the next question and displays it.
            }
        }
        function prevQuestion() {
            // Checks if the current question is not the first one.
            if (current_1 > 0) {
                current_1--;
                showQuestion(current_1); // Goes back to the previous question and displays it.
            }
        }
        quizForm.onsubmit = function (e) {
            // Prevents the default form submission behavior to allow custom handling.
            e.preventDefault();
            alert('Quiz submitted!'); // Alerts the user that the quiz has been submitted.
            // Optionally, you can add logic here to process the quiz answers.
        };
        window.nextQuestion = nextQuestion; // Exposes the nextQuestion function to the global scope so it can be called from the HTML.
        window.prevQuestion = prevQuestion; // Exposes the prevQuestion function to the global scope so it can be called from the HTML.
        // Initially shows the first question when the page loads.
        showQuestion(current_1); // Displays the current question based on the saved index or defaults to the first question.
    }
});
