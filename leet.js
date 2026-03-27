document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");

    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-level");
    const mediumLabel = document.getElementById("medium-level");
    const hardLabel = document.getElementById("hard-level");

    const cardStatsContainer = document.querySelector(".stat-card");

    // ✅ Username validation
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        if (!regex.test(username)) {
            alert("Invalid Username");
            return false;
        }
        return true;
    }

    // ✅ Fetch user data
    async function fetchUserDetails(username) {
        const url = `https://leetcode-api-faisalshohag.vercel.app/${username}`;

        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("User not found");
            }

            const data = await response.json();
            console.log("API Data:", data);

            displayUserData(data);

        } catch (error) {
            statsContainer.innerHTML = `<p>${error.message}</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    // ✅ Update progress circles
    function updateProgress(solved, total, label, circle) {
        if (!total) return;

        const percent = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${percent}%`);
        label.textContent = `${solved}/${total}`;
    }

    // ✅ Display data on UI
    function displayUserData(data) {

        const totalEasy = data.totalEasy;
        const totalMedium = data.totalMedium;
        const totalHard = data.totalHard;

        const easySolved = data.easySolved;
        const mediumSolved = data.mediumSolved;
        const hardSolved = data.hardSolved;

        updateProgress(easySolved, totalEasy, easyLabel, easyProgressCircle);
        updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolved, totalHard, hardLabel, hardProgressCircle);
        const cardsData = [
            { label: "Total Solved", value: data.totalSolved },
            { label: "Ranking", value: data.ranking },

            {

                label: "Acceptance Rate", 
                value: data.acceptanceRate ? data.acceptanceRate + "%" : "N/A" 
            },
            { 
            label: "Contribution Points", 
            value: data.contributionPoints ? data.contributionPoints : "N/A" 
            }
        ];

        cardStatsContainer.innerHTML = cardsData.map(item => `
            <div class="card">
                <h4>${item.label}</h4>
                <p>${item.value}</p>
            </div>
        `).join("");
    }

    // ✅ Button click event
    searchButton.addEventListener("click", function () {
        const username = usernameInput.value.trim();

        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });

});