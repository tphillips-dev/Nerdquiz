// Sort quizzes with active first, then alphabetical
function sortQuizzes(quizzes) {
  return [...quizzes].sort((a, b) => {
    // Active quizzes first
    if (a.status === "active" && b.status !== "active") return -1;
    if (b.status === "active" && a.status !== "active") return 1;
    // Alphabetical order for same status
    return a.title.localeCompare(b.title);
  });
}

async function loadQuizzes() {
  try {
    const response = await fetch("public/data/quizzes.json");
    const data = await response.json();
    const sortedQuizzes = sortQuizzes(data.quizzes);
    renderQuizzes(sortedQuizzes);
  } catch (error) {
    console.error("Error loading quizzes:", error);
    document.getElementById("quiz-container").innerHTML =
      '<p class="error">Failed to load quizzes. Please try again later.</p>';
  }
}

function renderQuizzes(quizzes) {
  const container = document.getElementById("quiz-container");
  let html = "";

  for (const quiz of quizzes) {
    let audioSupportText = "";
    if (quiz.status === "active") {
      switch (quiz.audioSupport) {
        case "full":
          audioSupportText = "Full Audio Support";
          break;
        case "half":
          audioSupportText = "Partial Audio Support";
          break;
        case "none":
          audioSupportText = "No Audio Support";
          break;
        default:
          audioSupportText = "";
      }
    }

    html += `
    <a href="${quiz.status === "active" ? quiz.href : "#"}" 
       class="quiz-box ${quiz.status !== "active" ? "coming-soon" : ""}"
       aria-label="${quiz.title} quiz">
        <h2>${quiz.title}</h2>
        <p>${quiz.tagline}</p>
        ${
          quiz.status === "active" && audioSupportText
            ? `<div class="audio-support-overlay">${audioSupportText}</div>`
            : ""
        }
    </a>
  `;
  }

  container.innerHTML = html;
  initializeQuizInteractions();
}

function initializeQuizInteractions() {
  document.querySelectorAll(".quiz-box").forEach((box) => {
    if (box.classList.contains("coming-soon")) {
      box.addEventListener("click", (e) => e.preventDefault());
    }

    box.addEventListener("touchstart", handleTouchStart);
    box.addEventListener("touchend", handleTouchEnd);
  });
}

const handleTouchStart = (e) => {
  if (!e.target.classList.contains("coming-soon")) {
    e.target.classList.add("active");
  }
};

const handleTouchEnd = (e) => {
  e.target.classList.remove("active");
};

// Loading handler
window.addEventListener("load", () => {
  loadQuizzes().finally(() => {
    setTimeout(() => {
      document.getElementById("loading-overlay").style.opacity = "0";
      setTimeout(() => {
        document.getElementById("loading-overlay").style.display = "none";
      }, 500);
    }, 1000);
  });
});
