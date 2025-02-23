document.addEventListener("DOMContentLoaded", function () {
    let selectedDay = null;
    let scheduleData = {};  // Object to store data by day

    // Fetch the current schedule data when the page loads
    fetch('http://127.0.0.1:5000/get-schedule')
        .then(response => response.json())
        .then(data => {
            scheduleData = data;  // Use the data from the server
            console.log("Current schedule data:", scheduleData);
            updateUI(); // Optionally, update UI with fetched data
        })
        .catch(error => console.error('Error fetching schedule data:', error));

    // Open popup when a day div is clicked
    document.querySelectorAll('.day-div').forEach(div => {
        div.addEventListener('click', function () {
            if (this.classList.contains('saved')) return;  // Ignore clicks on saved divs

            selectedDay = this.dataset.day;
            console.log("Clicked:", selectedDay);

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

        if (!scheduleData[selectedDay]) {
            scheduleData[selectedDay] = [];
        }

        scheduleData[selectedDay].push({
            title: title,
            teacher: teacher,
            time: time,
            description: description
        });

        // Disable the day div after data is saved (so it's no longer clickable)
        document.querySelector(`.day-div[data-day="${selectedDay}"]`).classList.add("saved");

        // Send the updated schedule data to the server
        fetch('http://127.0.0.1:5000/save-schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scheduleData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save data');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);  // Show success message
            closePopup();

            // Optionally update the UI here (e.g., showing the new data on the page)
            updateUI(selectedDay);  // Custom function to update the div with the new data
        })
        .catch(error => {
            console.error('Error saving data:', error);
            alert('Failed to save data');
        });
    }

    // Attach event listeners to buttons
    document.querySelector("#popup button:first-of-type").addEventListener("click", saveData);
    document.querySelector("#popup button:last-of-type").addEventListener("click", closePopup);

    // Update the UI with the saved data
    function updateUI(day) {
        if (!day) {
            // Loop through all days and update them
            document.querySelectorAll('.day-div').forEach(div => {
                const dayData = scheduleData[div.dataset.day];
                if (dayData && dayData.length > 0) {
                    div.querySelector('.title p').innerText = dayData[dayData.length - 1].title;
                    div.querySelector('.teacher p').innerText = dayData[dayData.length - 1].teacher;
                    div.querySelector('.time p').innerText = dayData[dayData.length - 1].time;
                    div.querySelector('.description p').innerText = dayData[dayData.length - 1].description;
                }
            });
        } else {
            // Update only the clicked day
            const dayDiv = document.querySelector(`.day-div[data-day="${day}"]`);
            const dayData = scheduleData[day];
            if (dayData && dayData.length > 0) {
                dayDiv.querySelector('.title p').innerText = dayData[dayData.length - 1].title;
                dayDiv.querySelector('.teacher p').innerText = dayData[dayData.length - 1].teacher;
                dayDiv.querySelector('.time p').innerText = dayData[dayData.length - 1].time;
                dayDiv.querySelector('.description p').innerText = dayData[dayData.length - 1].description;
            }
        }
    }
});
