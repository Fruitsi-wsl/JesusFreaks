document.addEventListener("DOMContentLoaded", function () {
    let selectedDay = null;
    let scheduleData = {};  // Object to store data by day

    // Fetch the current schedule data when the page loads
    fetch('/get-schedule')
        .then(response => response.json())
        .then(data => {
            scheduleData = data;  // Use the data from the server
            console.log("Current schedule data:", scheduleData);
        })
        .catch(error => console.error('Error fetching schedule data:', error));

    // Open popup when a day div is clicked
    document.querySelectorAll('.day-div').forEach(div => {
        div.addEventListener('click', function () {
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

        if (!scheduleData[selectedDay]) {
            scheduleData[selectedDay] = [];
        }

        scheduleData[selectedDay].push({
            title: title,
            teacher: teacher,
            time: time,
            description: description
        });

        // Send the updated schedule data to the server
        fetch('/save-schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(scheduleData)  // Send the entire schedule data
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);  // Show success message
            closePopup();
        })
        .catch(error => {
            console.error('Error saving data:', error);
            alert('Failed to save data');
        });
    }

    // Attach event listeners to buttons
    document.querySelector("#popup button:first-of-type").addEventListener("click", saveData);
    document.querySelector("#popup button:last-of-type").addEventListener("click", closePopup);
});
