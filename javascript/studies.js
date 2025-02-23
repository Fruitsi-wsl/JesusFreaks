document.addEventListener("DOMContentLoaded", function () {
    let selectedDay = null;
    let scheduleData = {}; // Object to store data by day

    // Fetch the current schedule data when the page loads
    fetch('/get-schedule')
        .then(response => response.json())
        .then(data => {
            scheduleData = data; // Store fetched data
            console.log("Current schedule data:", scheduleData);
            updateScheduleUI(); // Update the UI
        })
        .catch(error => console.error('Error fetching schedule data:', error));

    // Function to update the UI with schedule data
    function updateScheduleUI() {
        document.querySelectorAll('.day-div').forEach(div => {
            let day = div.dataset.day;
            let titleEl = div.querySelector(".title p");
            let teacherEl = div.querySelector(".teacher p");
            let timeEl = div.querySelector(".time p");
            let descriptionEl = div.querySelector(".description p");

            if (scheduleData[day] && scheduleData[day].length > 0) {
                let entry = scheduleData[day][0]; // Get the first entry for the day

                titleEl.textContent = entry.title || "No title";
                teacherEl.textContent = entry.teacher || "No teacher";
                timeEl.textContent = entry.time || "No time set";
                descriptionEl.textContent = entry.description || "No description available";

                // Disable further clicks on this div once updated
                div.classList.add("disabled"); // Add a class to visually indicate it's disabled
                div.style.pointerEvents = "none"; // Disable clicking
            }
        });
    }

    // Open popup when a day div is clicked (Only for non-disabled divs)
    document.querySelectorAll('.day-div').forEach(div => {
        div.addEventListener('click', function () {
            if (this.classList.contains("disabled")) return; // Prevent interaction if disabled

            selectedDay = this.dataset.day;
            console.log("Clicked:", selectedDay); // Debugging

            document.getElementById('popup-title').innerText = `Enter Details for ${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}`;
            document.getElementById('popup').style.display = 'block';

            // Clear previous input values
            document.getElementById('title').value = "";
            document.getElementById('teacher').value = "";
            document.getElementById('time').value = "";
            document.getElementById('description').value = "";
        });
    });

    // Close popup
    function closePopup() {
        document.getElementById('popup').style.display = 'none';
    }

    // Save data when user clicks "Save"
    function saveData() {
        if (!selectedDay) return alert("Please select a day first!");

        let title = document.getElementById('title').value;
        let teacher = document.getElementById('teacher').value;
        let time = document.getElementById('time').value;
        let description = document.getElementById('description').value;

        if (!title || !teacher || !time || !description) {
            alert("All fields are required!");
            return;
        }

        scheduleData[selectedDay] = [{ title, teacher, time, description }];

        updateScheduleUI(); // Update UI with the new data
        closePopup();
    }

    // Attach event listeners to buttons
    document.querySelector("#popup button:first-of-type").addEventListener("click", saveData);
    document.querySelector("#popup button:last-of-type").addEventListener("click", closePopup);
});
