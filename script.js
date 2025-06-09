const ANIMATION_DURATION = 8000; // Duration of the color animation in milliseconds.
const headerColors = [ // Defines the color gradients for the header.
    { pct: 0, color: "#000000" }, // Start with black.
    { pct: 25, color: "#37377f" }, // Transition to dark blue.
    { pct: 50, color: "#377f37" }, // Transition to green.
    { pct: 75, color: "#7f3737" }, // Transition to red.
    { pct: 100, color: "#000000" } // End with black again.
];
const navColors = [ // Defines the color gradients for the navigation bar.
    { pct: 0, color: "#000000" }, // Start with black.
    { pct: 25, color: "#7f3737" }, // Transition to red.
    { pct: 50, color: "#377f37" }, // Transition to green.
    { pct: 75, color: "#37377f" }, // Transition to dark blue.
    { pct: 100, color: "#000000" } // End with black again.
];
const footerColors = [ // Defines the color gradients for the footer.
    // The footer colors are the same as the header colors, but reversed.
    { pct: 0, color: "#377f37" }, // Start with green.
    { pct: 25, color: "#7f3737" }, // Transition to red.
    { pct: 50, color: "#000000" }, // Transition to black.
    { pct: 75, color: "#37377f" }, // Transition to dark blue.
    { pct: 100, color: "#377f37" } // End with green again.
];

function interpolateColor(colors, pct) { // Calculates a color between two colors in a gradient, based on a percentage.
    let i = 1; // Start at the second color since the first is always 0%.
    while (i < colors.length && pct > colors[i].pct) i++; // Find the right segment in the gradient.
    const prev = colors[i - 1]; // The previous color in the gradient.
    const next = colors[i]; // The next color in the gradient.
    const range = next.pct - prev.pct; // The range between the two colors.
    const rangePct = (pct - prev.pct) / range; // The percentage within the range.
    const hex = (a, b) => Math.round(a + (b - a) * rangePct); // Interpolates between two values based on the range percentage.
    const c1 = prev.color.match(/\w\w/g).map(x => parseInt(x, 16)); // Converts the previous color from hex to RGB.
    const c2 = next.color.match(/\w\w/g).map(x => parseInt(x, 16)); // Converts the next color from hex to RGB.
    return `#${hex(c1[0], c2[0]).toString(16).padStart(2, "0")}${hex(c1[1], c2[1]).toString(16).padStart(2, "0")}${hex(c1[2], c2[2]).toString(16).padStart(2, "0")}`; // Returns the interpolated color in hex format.
}

let startTime = Date.now(); // Records the start time of the animation.
// Retrieves the saved offset from localStorage to continue the animation from where it left off.
const savedOffset = parseInt(localStorage.getItem("colorAnimOffset") || "0", 10); // If no saved offset exists, defaults to 0.

function animateColors() { // Animates the background colors of the header, nav links, and footer by smoothly transitioning through the color gradients.
    const now = Date.now(); // Gets the current time.
    // Calculates the elapsed time since the start of the animation, adjusted by any saved offset.
    const elapsed = (now - startTime + savedOffset) % ANIMATION_DURATION; // Ensures the elapsed time wraps around after reaching the animation duration.
    // Calculates the percentage of the animation completed based on the elapsed time.
    const pct = (elapsed / ANIMATION_DURATION) * 100; // Converts the elapsed time to a percentage of the total animation duration.

    const header = document.querySelector("header"); // Selects the header element.
    // If the header exists, sets its background color based on the current percentage of the animation.
    if (header) header.style.backgroundColor = interpolateColor(headerColors, pct); // Interpolates the color for the header based on the percentage.

    document.querySelectorAll("nav a").forEach(a => a.style.backgroundColor = interpolateColor(navColors, pct)); // Selects all navigation links and sets their background color based on the current percentage of the animation.

    const footer = document.querySelector("footer"); // Selects the footer element.
    // If the footer exists, sets its background color based on the current percentage of the animation.
    if (footer) footer.style.backgroundColor = interpolateColor(footerColors, pct); // Interpolates the color for the footer based on the percentage.

    requestAnimationFrame(animateColors); // Requests the next animation frame to continue the color animation loop.
}
animateColors(); // Starts the color animation loop.

window.addEventListener("beforeunload", () => { // Saves the current animation offset to localStorage when the user leaves or reloads the page.
    const now = Date.now(); // Gets the current time again to calculate the elapsed time.
    // Calculates the elapsed time since the start of the animation, adjusted by any saved offset.
    const elapsed = (now - startTime + savedOffset) % ANIMATION_DURATION; // Ensures the elapsed time wraps around after reaching the animation duration.
    // Saves the elapsed time to localStorage so that it can be used to continue the animation from the same point next time.
    localStorage.setItem("colorAnimOffset", elapsed); // Saves the current animation offset to localStorage.
});

document.addEventListener("DOMContentLoaded", () => { // Sets up quiz navigation logic after the DOM is fully loaded.
    const quizForm = document.getElementById('quizForm'); // Selects the quiz form element by its ID.
    // If the quiz form exists, initializes the quiz navigation logic.
    if (quizForm) { // If the quiz form is found, proceed with the quiz logic.
        // Initializes the current question index to 0 or retrieves it from localStorage.
        let current = 0; // Default to the first question.
        // Selects all question sections within the quiz form.
        const sections = document.querySelectorAll('.question-section'); // Selects all elements with the class 'question-section' within the quiz form.
        // If a current question index is saved in localStorage, use it; otherwise, default to 0.
        if (localStorage.getItem('quizCurrent')) { // Checks if there is a saved current question index in localStorage.
            // If a saved index exists, parse it as an integer; otherwise, default to 0.
            current = parseInt(localStorage.getItem('quizCurrent'), 10) || 0; // Parses the saved index from localStorage, defaulting to 0 if it doesn't exist.
        }
        function showQuestion(index) { // Displays the question section corresponding to the given index and hides all others.
            // Hides all sections and shows only the section at the specified index.
            sections.forEach((sec, i) => { // Loops through each section and its index.
                // Sets the display style of each section based on whether its index matches the current index.
                sec.style.display = i === index ? 'block' : 'none';
            }); // Sets the display of the current section to 'block' and others to 'none'.
            // Updates the current question index in localStorage to remember the user's progress.
            localStorage.setItem('quizCurrent', index); // Saves the current question index to localStorage so it can be retrieved later.
        }
        function nextQuestion() { // Advances to the next question if the current one is answered.
            // Checks if the current section has any radio buttons and if at least one is selected.
            const currentSection = sections[current]; // Gets the current section based on the current index.
            // Selects all radio buttons within the current section.
            const radios = currentSection.querySelectorAll('input[type="radio"]'); // Selects all radio input elements within the current section.
            // Checks if at least one radio button is checked.
            let answered = false; // Initializes a flag to check if an answer has been selected.
            // Loops through all radio buttons to see if any are checked.
            radios.forEach(radio => { // Iterates through each radio button in the current section.
                // If a radio button is checked, sets the answered flag to true.
                if (radio.checked) answered = true;
            }); // Checks if an answer has been selected before proceeding to the next question.
            // If no answer is selected, alerts the user to select an answer before continuing.
            if (!answered) {
                alert('Please select an answer before continuing.');
                return; // Exits the function if no answer is selected.
            }
            if (current < sections.length - 1) {
                current++;
                showQuestion(current); // Advances to the next question and displays it.
            }
        }
        function prevQuestion() { // Goes back to the previous question if the current one is not the first.
            // Checks if the current question is not the first one.
            if (current > 0) {
                current--;
                showQuestion(current); // Goes back to the previous question and displays it.
            }
        }
        quizForm.onsubmit = function(e) { // Handles the form submission event.
            // Prevents the default form submission behavior to allow custom handling.
            e.preventDefault();
            alert('Quiz submitted!'); // Alerts the user that the quiz has been submitted.
            // Optionally, you can add logic here to process the quiz answers.
        };
        window.nextQuestion = nextQuestion; // Exposes the nextQuestion function to the global scope so it can be called from the HTML.
        window.prevQuestion = prevQuestion; // Exposes the prevQuestion function to the global scope so it can be called from the HTML.
        // Initially shows the first question when the page loads.
        showQuestion(current); // Displays the current question based on the saved index or defaults to the first question.
    }
});
