var li_items = document.querySelectorAll(".sidebar ul li");
var hamburger = document.querySelector(".hamburger");
var wrapper = document.querySelector(".wrapper");

li_items.forEach((li_item) => {
    li_item.addEventListener("mouseenter", () => {
        if (wrapper.classList.contains("click_collapse")) {
            return;
        } else {
            li_item.closest(".wrapper").classList.remove("hover_collapse");
        }
    });
});

li_items.forEach((li_item) => {
    li_item.addEventListener("mouseleave", () => {
        if (wrapper.classList.contains("click_collapse")) {
            return;
        } else {
            li_item.closest(".wrapper").classList.add("hover_collapse");
        }
    });
});

hamburger.addEventListener("click", () => {
    wrapper.classList.toggle("hover_collapse");
    // Add or remove the class based on your layout needs
    // wrapper.classList.toggle("click_collapse");

    // Ensure the sidebar is above the map when the hamburger is clicked
    var sidebar = document.querySelector(".sidebar");
    if (wrapper.classList.contains("hover_collapse")) {
        sidebar.style.zIndex = "100";
    } else {
        sidebar.style.zIndex = ""; // Reset to default value or adjust as needed
    }
});


function updateMap() {
    // Fetch the selected date from the input field (you may need to format it as needed)
    var selectedDate = document.getElementById('dateInput').value;

    // Perform any map updates or actions based on the selected date
    // For demonstration purposes, let's just log the selected date to the console
    console.log('Selected Date:', selectedDate);
}

function submitPrediction() {
    // Show loading indicator
    document.getElementById('loadingIndicator').style.display = 'block';

    var selectedFile = document.getElementById('selected_file').value;
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `selected_file=${selectedFile}`
    })
    .then(response => response.json())
    .then(data => {
        // Hide loading indicator
        document.getElementById('loadingIndicator').style.display = 'none';

        // Automatically refresh the map view after the prediction and map data update
        refreshMapView();
    })
    .catch((error) => {
        console.error('Error:', error);
        // Hide loading indicator even if there's an error
        document.getElementById('loadingIndicator').style.display = 'none';
    });
}

