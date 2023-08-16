
function showModel(){
  const modelSelect = document.getElementById('modelSelect');
  const mm1 = document.getElementById("MM1Model") 
  const mm2 = document.getElementById("MM2Model")
  const mg1 = document.getElementById("MG1Model")
  const gg1 = document.getElementById("GG1Model")

  if(modelSelect.value == 1){
    mm1.style.display = "block"
    mm2.style.display = "none"
    mg1.style.display = "none"
    gg1.style.display = "none"
  }else if(modelSelect.value == 2){
    mm1.style.display = "none"
    mm2.style.display = "block"
    mg1.style.display = "none"
    gg1.style.display = "none"
  }else if(modelSelect.value == 3){
    mm1.style.display = "none"
    mm2.style.display = "none"
    mg1.style.display = "block"
    gg1.style.display = "none"
  }
  else{
    mm1.style.display = "none"
    mm2.style.display = "none"
    mg1.style.display = "none"
    gg1.style.display = "block"
  }

}


var dataSim
document.addEventListener("DOMContentLoaded", function() {
  const dropdown = document.getElementById("dropdown");
  const dropdown2 = document.getElementById("dropdown2");
  const inputFields = document.getElementById("inputFields");
  const inputFields2 = document.getElementById("inputFields2");

  dropdown.addEventListener("change", function() {
    const selectedValue = dropdown.value;
    inputFields.innerHTML = ""; // Clear existing input fields

    if (selectedValue === "1") {
      inputFields.innerHTML = `
        <label for="low">Low:</label>
        <input type="text" id="alow" name="low">
        <br>
        <label for="high">High:</label>
        <input type="text" id="ahigh" name="high">
      `;
    } else if (selectedValue === "2") {
      inputFields.innerHTML = `
        <label for="mean">Mean:</label>
        <input type="text" id="amean" name="mean">
        <br>
        <label for="var_service">Variance:</label>
        <input type="text" id="avar_service" name="var_service">
        <br>
        <label for="shape">Shape:</label>
        <input type="text" id="ashape" name="shape">
      `;
    } else if (selectedValue === "3") {
      inputFields.innerHTML = `
        <label for="mean">Mean:</label>
        <input type="text" id="amean" name="mean">
        <br>
        <label for="var_distribution">Variance:</label>
        <input type="text" id="avar_distribution" name="var_distribution">
      `;
    }
  });
  dropdown2.addEventListener("change", function() {
    const selectedValue = dropdown2.value;
    inputFields2.innerHTML = ""; // Clear existing input fields

    if (selectedValue === "1") {
      inputFields2.innerHTML = `
        <label for="low">Low:</label>
        <input type="text" id="slow" name="low">
        <br>
        <label for="high">High:</label>
        <input type="text" id="shigh" name="high">
      `;
    } else if (selectedValue === "2") {
      inputFields2.innerHTML = `
        <label for="mean">Mean:</label>
        <input type="text" id="smean" name="mean">
        <br>
        <label for="var_service">Variance:</label>
        <input type="text" id="svar_service" name="var_service">
        <br>
        <label for="shape">Shape:</label>
        <input type="text" id="sshape" name="shape">
      `;
    } else if (selectedValue === "3") {
      inputFields2.innerHTML = `
        <label for="mean">Mean:</label>
        <input type="text" id="smean" name="mean">
        <br>
        <label for="var_distribution">Variance:</label>
        <input type="text" id="svar_distribution" name="var_distribution">
      `;
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const queuingForm = document.getElementById("queuing-form");

  queuingForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const lambda = parseFloat(document.getElementById("lambda").value);
      const mu = parseFloat(document.getElementById("mu").value);

      const response = await fetch("http://127.0.0.1:5000/mm1", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              arrival_mean: lambda,
              service_mean: mu,
          }),
      });

      const data = await response.json();
      dataSim = data
      // Display results in the browser console
      console.log(data)
      populateTable(data);
      simulate(data)
      simulateTable(data)
      console.log("Simulation Results:");
      console.log("Average Number of Customers in System:", data["average customer time in the system"]);
      console.log("Average Time Spent in System:", data["average time in the system"]);
      console.log("Average Number of Customers in Queue:", data["average number of customers in the queue"]);
      // console.log("Average Time Spent in Queue:", data["avg_time_spent_in_queue"]);
  });
});
// Sample data (replace this with your actual data)
// var data = [
//   { metric: "Otto", value: "@mdo" },
//   { metric: "Thornton", value: "@fat" },
//   { metric: "Larry the Bird", value: "@twitter" }
// ];

// Function to populate the table with data
function populateTable(dataS) {
  var head = document.querySelector("#heading")
    var x = document.createElement("h4")
    x.textContent = "Performance Measures"
    head.appendChild(x)
  var table = document.querySelector("#queuing");
  var thead = document.createElement("thead");
  var headerRow = document.createElement("tr");
  var headerCell1 = document.createElement("th");
  var headerCell2 = document.createElement("th");
  headerCell1.textContent = "Metric";
  headerCell2.textContent = "Value";
  headerRow.appendChild(headerCell1);
  headerRow.appendChild(headerCell2);
  thead.appendChild(headerRow);
  table.appendChild(thead);
  // dataS is object
  var keys = [
    "average service time",
    "average inter-arrival time",
    "average waiting time",
    "average waiting time for those who wait",
    "average customer time in the system",
    "average response time",
    "average number of customers in the system",
    "average number of customers in the queue",
    "average waiting time in the queue",
    "average time in the system",
    "probability of zero customers to wait",
    "utilization factor" 
  ]
  var tbody = document.createElement("tbody");
  for(var i = 0; i < keys.length; i++){


      var row = document.createElement("tr");
      
      var metricCell = document.createElement("td");
      metricCell.textContent = keys[i];
      
      var valueCell = document.createElement("td");
      valueCell.textContent = dataS[keys[i]];

      row.appendChild(metricCell);
      row.appendChild(valueCell);
      
      tbody.appendChild(row);
  };
  table.appendChild(tbody);
}
// another function to show my arrival time data and other data in the table Arrival Time': [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4], 'Service Time': [1, 2, 1, 3, 2, 1, 1, 5, 2, 9, 3, 3, 3, 1, 3], 'InterArrival Time': [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
function simulate(simValues){
  var table = document.querySelector("#simulate");
  var thead = document.createElement("thead");
  var headerRow = document.createElement("tr");
  var headerCell1 = document.createElement("th");
  var headerCell2 = document.createElement("th");
  var headerCell3 = document.createElement("th");
  headerCell1.textContent = "Arrival Time";
  headerCell2.textContent = "Service Time";
  headerCell3.textContent = "InterArrival Time";
  headerRow.appendChild(headerCell1);
  headerRow.appendChild(headerCell2);
  headerRow.appendChild(headerCell3);
  thead.appendChild(headerRow);
  table.appendChild(thead);
  // dataS is object
  var keys = [
    "Arrival Time",
    "Service Time",
    "InterArrival Time"
  ]
  var tbody = document.createElement("tbody");
  for(var j = 0; j < simValues["Arrival Time"].length; j++){
    var row = document.createElement("tr");

  for(var i = 0; i < keys.length; i++){
      
      var valueCell = document.createElement("td");
      valueCell.textContent = simValues[keys[i]][j];

      row.appendChild(valueCell);
      
      tbody.appendChild(row);
  }
  table.appendChild(tbody);
}



var plotData = {
  labels: ['Turnaround Time', 'Wait Time', 'Response Time'],
  datasets: [
    {
      label: 'Metrics',
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
      borderWidth: 1,
      data: [Math.max(...simValues["Turnaround Time"]),Math.max(...simValues["Wait Time"]), Math.max(...simValues["Response Time"])], // Replace with your actual data
    },
  ],
};

// Get the canvas element
var ctx = document.getElementById('myChart').getContext('2d');

// Create the chart
var myChart = new Chart(ctx, {
  type: 'bar',
  data: plotData,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart'
      }
    }
  },
})

}
// Call the function to populate the table when the page loads
// window.onload = function() {
//   populateTable();
// };

// "average service time",
// "average inter-arrival time",
// "average waiting time",
// "average waiting time for those who wait",
// "average customer time in the system",
// "average response time",
// "average number of customers in the system",
// "average number of customers in the queue",
// "average waiting time in the queue",
// "average time in the system",
// "probability of zero customers to wait",
// "utilization factor"
function simulateTable(tableVals){
  // gonna push 8 values into the table start end tat wait response
  var table = document.querySelector("#simulation")
  var thead = document.createElement("thead");
  var headerRow = document.createElement("tr");
  var headerCell1 = document.createElement("th");
  var headerCell2 = document.createElement("th");
  var headerCell3 = document.createElement("th");
  var headerCell4 = document.createElement("th");
  var headerCell5 = document.createElement("th");
  var headerCell6 = document.createElement("th");
  var headerCell7 = document.createElement("th");
  var headerCell8 = document.createElement("th");
  headerCell1.textContent = "Arrival Time";
  headerCell2.textContent = "Service Time";
  headerCell3.textContent = "InterArrival Time";
  headerCell4.textContent = "Start Time";
  headerCell5.textContent = "End Time";
  headerCell6.textContent = "Turnaround Time";
  headerCell7.textContent = "Wait Time";
  headerCell8.textContent = "Response Time";
  headerRow.appendChild(headerCell1);
  headerRow.appendChild(headerCell2);
  headerRow.appendChild(headerCell3);
  headerRow.appendChild(headerCell4);
  headerRow.appendChild(headerCell5);
  headerRow.appendChild(headerCell6);
  headerRow.appendChild(headerCell7);
  headerRow.appendChild(headerCell8);
  thead.appendChild(headerRow);
  table.appendChild(thead);
  // dataS is object
  var keys = [
    "Arrival Time",
    "Service Time",
    "InterArrival Time",
    "Start Time",
    "End Time",
    "Turnaround Time",
    "Wait Time",
    "Response Time"
  ]
  var tbody = document.createElement("tbody");
  for(var j = 0; j < tableVals["Arrival Time"].length; j++){
    var row = document.createElement("tr");
    for(var i = 0; i < keys.length; i++){
      var valueCell = document.createElement("td");
      valueCell.textContent = tableVals[keys[i]][j];
      row.appendChild(valueCell);
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
  }

}


// MM1 Complete



// Startin MM2

document.addEventListener("DOMContentLoaded", function () {
  const queuingForm = document.getElementById("queuing-form2");

  queuingForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const lambda = parseFloat(document.getElementById("lambda").value);
      const mu = parseFloat(document.getElementById("mu").value);

      const response = await fetch("http://127.0.0.1:5000/mm2", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              arrival_mean: lambda,
              service_mean: mu,
          }),
      });

      const data = await response.json();

      dataSim = data
      // Display results in the browser console
      console.log(data)
      populateTable2(data)
      simulate2(data)
      simulateTable2(data)
    })
  })


  function populateTable2(dataS) {
    var head = document.querySelector("#heading")
    var x = document.createElement("h4")
    x.textContent = "Performance Measures"
    head.appendChild(x)
    var table = document.querySelector("#queuing");
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var headerCell1 = document.createElement("th");
    var headerCell2 = document.createElement("th");
    headerCell1.textContent = "Metric";
    headerCell2.textContent = "Value";
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // dataS is object
    var keys = [
      "average service time",
      "average inter-arrival time",
      "average waiting time",
      "average waiting time for those who wait",
      "average customer time in the system",
      "average response time",
      "utilization rate of server 1",
      "utilization rate of server 2",
      "proportion of idle time of server 1",
      "proportion of idle time of server 2",
      "Probability of customers to wait",
      "Probability of zero customers to wait",
      "average number of customers in the system",
      "average number of customers in the queue",
      "average waiting time in the queue",
      "average time in the system",
      "probability of zero customers to wait",
      "utilization factor"
    ]
    var tbody = document.createElement("tbody");
    for(var i = 0; i < keys.length; i++){
  
  
        var row = document.createElement("tr");
        
        var metricCell = document.createElement("td");
        metricCell.textContent = keys[i];
        
        var valueCell = document.createElement("td");
        valueCell.textContent = dataS[keys[i]];
  
        row.appendChild(metricCell);
        row.appendChild(valueCell);
        
        tbody.appendChild(row);
    };
    table.appendChild(tbody);
  }
  // another function to show my arrival time data and other data in the table Arrival Time': [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4], 'Service Time': [1, 2, 1, 3, 2, 1, 1, 5, 2, 9, 3, 3, 3, 1, 3], 'InterArrival Time': [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
  function simulate2(simValues){
    var table = document.querySelector("#simulate");
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var headerCell1 = document.createElement("th");
    var headerCell2 = document.createElement("th");
    var headerCell3 = document.createElement("th");
    headerCell1.textContent = "Arrival Time";
    headerCell2.textContent = "Service Time";
    headerCell3.textContent = "InterArrival Time";
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    headerRow.appendChild(headerCell3);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // dataS is object
    var keys = [
      "Arrival Time",
      "Service Time",
      "InterArrival Time"
    ]
    var tbody = document.createElement("tbody");
    for(var j = 0; j < simValues["Arrival Time"].length; j++){
      var row = document.createElement("tr");
  
    for(var i = 0; i < keys.length; i++){
        
        var valueCell = document.createElement("td");
        valueCell.textContent = simValues[keys[i]][j];
  
        row.appendChild(valueCell);
        
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
  }
  
  
  
  var plotData = {
    labels: ['Turnaround Time', 'Wait Time', 'Response Time'],
    datasets: [
      {
        label: 'Metrics',
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
        data: [Math.max(...simValues["Turnaround Time"]),Math.max(...simValues["Wait Time"]), Math.max(...simValues["Response Time"])], // Replace with your actual data
      },
    ],
  };
  
  // Get the canvas element
  var ctx = document.getElementById('myChart').getContext('2d');
  
  // Create the chart
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: plotData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Bar Chart'
        }
      }
    },
  })
  
  }
  // Call the function to populate the table when the page loads
  // window.onload = function() {
  //   populateTable();
  // };
  
  // "average service time",
  // "average inter-arrival time",
  // "average waiting time",
  // "average waiting time for those who wait",
  // "average customer time in the system",
  // "average response time",
  // "average number of customers in the system",
  // "average number of customers in the queue",
  // "average waiting time in the queue",
  // "average time in the system",
  // "probability of zero customers to wait",
  // "utilization factor"
  function simulateTable2(tableVals){
    // gonna push 8 values into the table start end tat wait response
    var table = document.querySelector("#simulation")
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var headerCell1 = document.createElement("th");
    var headerCell2 = document.createElement("th");
    var headerCell3 = document.createElement("th");
    var headerCell4 = document.createElement("th");
    var headerCell5 = document.createElement("th");
    var headerCell6 = document.createElement("th");
    var headerCell7 = document.createElement("th");
    var headerCell8 = document.createElement("th");
    var headerCell9 = document.createElement("th");
    headerCell1.textContent = "Arrival Time";
    headerCell2.textContent = "Service Time";
    headerCell3.textContent = "InterArrival Time";
    headerCell4.textContent = "Start Time";
    headerCell5.textContent = "End Time";
    headerCell6.textContent = "Turnaround Time";
    headerCell7.textContent = "Wait Time";
    headerCell8.textContent = "Response Time";
    headerCell9.textContent = "Servers";
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    headerRow.appendChild(headerCell3);
    headerRow.appendChild(headerCell4);
    headerRow.appendChild(headerCell5);
    headerRow.appendChild(headerCell6);
    headerRow.appendChild(headerCell7);
    headerRow.appendChild(headerCell8);
    headerRow.appendChild(headerCell9);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // dataS is object
    var keys = [
      "Arrival Time",
      "Service Time",
      "InterArrival Time",
      "Start Time",
      "End Time",
      "Turnaround Time",
      "Wait Time",
      "Response Time",
      "Servers"
    ]
    var tbody = document.createElement("tbody");
    for(var j = 0; j < tableVals["Arrival Time"].length; j++){
      var row = document.createElement("tr");
      for(var i = 0; i < keys.length; i++){
        var valueCell = document.createElement("td");
        valueCell.textContent = tableVals[keys[i]][j];
        row.appendChild(valueCell);
        tbody.appendChild(row);
      }
      table.appendChild(tbody);
    }
  
  }


  // MM2 Completed

  // MG1 Starting



  document.addEventListener("DOMContentLoaded", function () {
    const queuingForm = document.getElementById("queuing-form3");
  
    queuingForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const dropdown = document.getElementById("dropdown");
        const lambda = parseFloat(document.getElementById("lambda").value);
        const distribution = parseInt(dropdown.value);
        if(dropdown.value == 1){
          var val1 = document.getElementById('high')
          var val2 = document.getElementById('low')
          var list = [parseFloat(val1.value),parseFloat(val2.value)]
          console.log("Uniform",val1,val2)
        }else if(dropdown.value == 2){
          var val1 = document.getElementById('mean')
          var val2 = document.getElementById('var_service')
          var val3 = document.getElementById('shape')
          var list = [parseFloat(val1.value),parseFloat(val2.value),parseFloat(val3.value)]
          console.log("Gamma")
        }else if(dropdown.value == 3){
          var val1 = document.getElementById('mean')
          var val2 = document.getElementById('var_distribution')
          var list = [parseFloat(val1.value),parseFloat(val2.value)]
          console.log("Normal")
        }
        const response = await fetch("http://127.0.0.1:5000/mg1", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                arrival_mean: lambda,
                distribution: distribution,
                values: list
            }),
        });
  
        const data = await response.json();
  
        dataSim = data
        // Display results in the browser console
        console.log(data)
        populateTable3(data)
        simulate3(data)
        simulateTable3(data)
      })
    })

    

  function populateTable3(dataS) {
    var head = document.querySelector("#heading")
    var x = document.createElement("h4")
    x.textContent = "Performance Measures"
    head.appendChild(x)
    var table = document.querySelector("#queuing");
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var headerCell1 = document.createElement("th");
    var headerCell2 = document.createElement("th");
    headerCell1.textContent = "Metric";
    headerCell2.textContent = "Value";
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // dataS is object
    var keys = [
      "average number of customers in the system",
      "average number of customers in the queue",
      "average waiting time in the queue",
      "average time in the system",
      "probability of zero customers to wait",
      "proportion of idle time of server",
      "utilization factor",
    ]
    var tbody = document.createElement("tbody");
    for(var i = 0; i < keys.length; i++){
  
  
        var row = document.createElement("tr");
        
        var metricCell = document.createElement("td");
        metricCell.textContent = keys[i];
        
        var valueCell = document.createElement("td");
        valueCell.textContent = dataS[keys[i]];
  
        row.appendChild(metricCell);
        row.appendChild(valueCell);
        
        tbody.appendChild(row);
    };
    table.appendChild(tbody);
  }
  // another function to show my arrival time data and other data in the table Arrival Time': [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4], 'Service Time': [1, 2, 1, 3, 2, 1, 1, 5, 2, 9, 3, 3, 3, 1, 3], 'InterArrival Time': [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
  function simulate3(simValues){
    var table = document.querySelector("#simulate");
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var headerCell1 = document.createElement("th");
    var headerCell2 = document.createElement("th");
    var headerCell3 = document.createElement("th");
    headerCell1.textContent = "Arrival Time";
    headerCell2.textContent = "Service Time";
    headerCell3.textContent = "InterArrival Time";
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    headerRow.appendChild(headerCell3);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // dataS is object
    var keys = [
      "Arrival Time",
      "Service Time",
      "InterArrival Time"
    ]
    var tbody = document.createElement("tbody");
    for(var j = 0; j < simValues["Arrival Time"].length; j++){
      var row = document.createElement("tr");
  
    for(var i = 0; i < keys.length; i++){
        
        var valueCell = document.createElement("td");
        valueCell.textContent = simValues[keys[i]][j];
  
        row.appendChild(valueCell);
        
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
  }
  
  
  
  var plotData = {
    labels: ['Turnaround Time', 'Wait Time', 'Response Time'],
    datasets: [
      {
        label: 'Metrics',
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
        data: [Math.max(...simValues["Turnaround Time"]),Math.max(...simValues["Wait Time"]), Math.max(...simValues["Response Time"])], // Replace with your actual data
      },
    ],
  };
  
  // Get the canvas element
  var ctx = document.getElementById('myChart').getContext('2d');
  
  // Create the chart
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: plotData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Bar Chart'
        }
      }
    },
  })
  
  }
  // Call the function to populate the table when the page loads
  // window.onload = function() {
  //   populateTable();
  // };
  
  // "average service time",
  // "average inter-arrival time",
  // "average waiting time",
  // "average waiting time for those who wait",
  // "average customer time in the system",
  // "average response time",
  // "average number of customers in the system",
  // "average number of customers in the queue",
  // "average waiting time in the queue",
  // "average time in the system",
  // "probability of zero customers to wait",
  // "utilization factor"
  function simulateTable3(tableVals){
    // gonna push 8 values into the table start end tat wait response
    var table = document.querySelector("#simulation")
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var headerCell1 = document.createElement("th");
    var headerCell2 = document.createElement("th");
    var headerCell3 = document.createElement("th");
    var headerCell4 = document.createElement("th");
    var headerCell5 = document.createElement("th");
    var headerCell6 = document.createElement("th");
    var headerCell7 = document.createElement("th");
    var headerCell8 = document.createElement("th");
    var headerCell9 = document.createElement("th");
    headerCell1.textContent = "Arrival Time";
    headerCell2.textContent = "Service Time";
    headerCell3.textContent = "InterArrival Time";
    headerCell4.textContent = "Start Time";
    headerCell5.textContent = "End Time";
    headerCell6.textContent = "Turnaround Time";
    headerCell7.textContent = "Wait Time";
    headerCell8.textContent = "Response Time";
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    headerRow.appendChild(headerCell3);
    headerRow.appendChild(headerCell4);
    headerRow.appendChild(headerCell5);
    headerRow.appendChild(headerCell6);
    headerRow.appendChild(headerCell7);
    headerRow.appendChild(headerCell8);
    headerRow.appendChild(headerCell9);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // dataS is object
    var keys = [
      "Arrival Time",
      "Service Time",
      "InterArrival Time",
      "Start Time",
      "End Time",
      "Turnaround Time",
      "Wait Time",
      "Response Time",
    ]
    var tbody = document.createElement("tbody");
    for(var j = 0; j < tableVals["Arrival Time"].length; j++){
      var row = document.createElement("tr");
      for(var i = 0; i < keys.length; i++){
        var valueCell = document.createElement("td");
        valueCell.textContent = tableVals[keys[i]][j];
        row.appendChild(valueCell);
        tbody.appendChild(row);
      }
      table.appendChild(tbody);
    }
  
  }


  // MG1 Compelted


  // GG1 Starting

  document.addEventListener("DOMContentLoaded", function () {
    const queuingForm = document.getElementById("queuing-form4");
  
    queuingForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const dropdown = document.getElementById("dropdown");
        // const lambda = parseFloat(document.getElementById("lambda").value);
        const arrival_distribution = parseInt(dropdown.value);
        if(dropdown.value == 1){
          var val1 = document.getElementById('ahigh')
          var val2 = document.getElementById('alow')
          var list = [parseFloat(val1.value),parseFloat(val2.value)]
          console.log("Uniform",val1,val2)
        }else if(dropdown.value == 2){
          var val1 = document.getElementById('amean')
          var val2 = document.getElementById('avar_service')
          var val3 = document.getElementById('ashape')
          var list = [parseFloat(val1.value),parseFloat(val2.value),parseFloat(val3.value)]
          console.log("Gamma",parseFloat(val1.value),parseFloat(val2.value),parseFloat(val3.value))
        }else if(dropdown.value == 3){
          var val1 = document.getElementById('amean')
          var val2 = document.getElementById('avar_distribution')
          var list = [parseFloat(val1.value),parseFloat(val2.value)]
          console.log("Normal")
        }


        const dropdown2 = document.getElementById("dropdown2");
        // const lambda = parseFloat(document.getElementById("lambda").value);
        const service_distribution = parseInt(dropdown2.value);
        if(dropdown2.value == 1){
          var val1 = document.getElementById('shigh')
          var val2 = document.getElementById('slow')
          var listS = [parseFloat(val1.value),parseFloat(val2.value)]
          console.log("Uniform",val1,val2)
        }else if(dropdown2.value == 2){
          var val1 = document.getElementById('smean')
          var val2 = document.getElementById('svar_service')
          var val3 = document.getElementById('sshape')
          var listS = [parseFloat(val1.value),parseFloat(val2.value),parseFloat(val3.value)]
          console.log("Gamma")
        }else if(dropdown2.value == 3){
          var val1 = document.getElementById('smean')
          var val2 = document.getElementById('svar_distribution')
          var listS = [parseFloat(val1.value),parseFloat(val2.value)]
          console.log("Normal",parseFloat(val1.value),parseFloat(val2.value))
        }
        const response = await fetch("http://127.0.0.1:5000/gg1", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                arrival_distribution: arrival_distribution,
                service_distribution: service_distribution,
                arrival_values: list,
                service_values: listS
            }),
        });
  
        const data = await response.json();
  
        dataSim = data
        // Display results in the browser console
        console.log(data)
        populateTable4(data)
        simulate4(data)
        simulateTable4(data)
      })
    })


     

  function populateTable4(dataS) {
    var head = document.querySelector("#heading")
    var x = document.createElement("h4")
    x.textContent = "Performance Measures"
    head.appendChild(x)
    var table = document.querySelector("#queuing");
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var headerCell1 = document.createElement("th");
    var headerCell2 = document.createElement("th");
    headerCell1.textContent = "Metric";
    headerCell2.textContent = "Value";
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // dataS is object
    var keys = [
      "average number of customers in the system",
      "average number of customers in the queue",
      "average waiting time in the queue",
      "average time in the system",
      "probability of zero customers to wait",
      "proportion of idle time of server",
      "utilization factor"      
    ]
    var tbody = document.createElement("tbody");
    for(var i = 0; i < keys.length; i++){
  
  
        var row = document.createElement("tr");
        
        var metricCell = document.createElement("td");
        metricCell.textContent = keys[i];
        
        var valueCell = document.createElement("td");
        valueCell.textContent = dataS[keys[i]];
  
        row.appendChild(metricCell);
        row.appendChild(valueCell);
        
        tbody.appendChild(row);
    };
    table.appendChild(tbody);
  }
  // another function to show my arrival time data and other data in the table Arrival Time': [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4], 'Service Time': [1, 2, 1, 3, 2, 1, 1, 5, 2, 9, 3, 3, 3, 1, 3], 'InterArrival Time': [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
  function simulate4(simValues){
    var table = document.querySelector("#simulate");
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var headerCell1 = document.createElement("th");
    var headerCell2 = document.createElement("th");
    var headerCell3 = document.createElement("th");
    headerCell1.textContent = "Arrival Time";
    headerCell2.textContent = "Service Time";
    headerCell3.textContent = "InterArrival Time";
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    headerRow.appendChild(headerCell3);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // dataS is object
    var keys = [
      "Arrival Time",
      "Service Time",
      "InterArrival Time"
    ]
    var tbody = document.createElement("tbody");
    for(var j = 0; j < simValues["Arrival Time"].length; j++){
      var row = document.createElement("tr");
  
    for(var i = 0; i < keys.length; i++){
        
        var valueCell = document.createElement("td");
        valueCell.textContent = simValues[keys[i]][j];
  
        row.appendChild(valueCell);
        
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
  }
  
  
  
  var plotData = {
    labels: ['Turnaround Time', 'Wait Time', 'Response Time'],
    datasets: [
      {
        label: 'Metrics',
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1,
        data: [Math.max(...simValues["Turnaround Time"]),Math.max(...simValues["Wait Time"]), Math.max(...simValues["Response Time"])], // Replace with your actual data
      },
    ],
  };
  
  // Get the canvas element
  var ctx = document.getElementById('myChart').getContext('2d');
  
  // Create the chart
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: plotData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Bar Chart'
        }
      }
    },
  })
  
  }
  // Call the function to populate the table when the page loads
  // window.onload = function() {
  //   populateTable();
  // };
  
  // "average service time",
  // "average inter-arrival time",
  // "average waiting time",
  // "average waiting time for those who wait",
  // "average customer time in the system",
  // "average response time",
  // "average number of customers in the system",
  // "average number of customers in the queue",
  // "average waiting time in the queue",
  // "average time in the system",
  // "probability of zero customers to wait",
  // "utilization factor"
  function simulateTable4(tableVals){
    // gonna push 8 values into the table start end tat wait response
    var table = document.querySelector("#simulation")
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    var headerCell1 = document.createElement("th");
    var headerCell2 = document.createElement("th");
    var headerCell3 = document.createElement("th");
    var headerCell4 = document.createElement("th");
    var headerCell5 = document.createElement("th");
    var headerCell6 = document.createElement("th");
    var headerCell7 = document.createElement("th");
    var headerCell8 = document.createElement("th");
    var headerCell9 = document.createElement("th");
    headerCell1.textContent = "Arrival Time";
    headerCell2.textContent = "Service Time";
    headerCell3.textContent = "InterArrival Time";
    headerCell4.textContent = "Start Time";
    headerCell5.textContent = "End Time";
    headerCell6.textContent = "Turnaround Time";
    headerCell7.textContent = "Wait Time";
    headerCell8.textContent = "Response Time";
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    headerRow.appendChild(headerCell3);
    headerRow.appendChild(headerCell4);
    headerRow.appendChild(headerCell5);
    headerRow.appendChild(headerCell6);
    headerRow.appendChild(headerCell7);
    headerRow.appendChild(headerCell8);
    headerRow.appendChild(headerCell9);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    // dataS is object
    var keys = [
      "Arrival Time",
      "Service Time",
      "InterArrival Time",
      "Start Time",
      "End Time",
      "Turnaround Time",
      "Wait Time",
      "Response Time",
    ]
    var tbody = document.createElement("tbody");
    for(var j = 0; j < tableVals["Arrival Time"].length; j++){
      var row = document.createElement("tr");
      for(var i = 0; i < keys.length; i++){
        var valueCell = document.createElement("td");
        valueCell.textContent = tableVals[keys[i]][j];
        row.appendChild(valueCell);
        tbody.appendChild(row);
      }
      table.appendChild(tbody);
    }
  
  }

