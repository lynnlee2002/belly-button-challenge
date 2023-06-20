// Get the samples endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
});

// Display the default plot
function init() {

    // Select the dropdown menu from id selDataset
    let dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data and console log it
    d3.json(url).then(function(data) {
        console.log(data);

        // Extract the array of names from samples.json
        let names = data.names;

        // Iterate through the names array
        names.forEach((name) => {
            
            // Create "option" element in the html file to hold each name as the value
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Assign the default plot to the first name
        let name = names[0];

        // Call all the functions to display in the dashboard
        bar(name);
        bubble(name);
        demo_panel(name);
        gauge(name);
    });
}

// Create the bar chart
function bar(id_number) {

    // Fetch the JSON data and console log it
    d3.json(url).then(function(data) {
        console.log(data);

        // Create an array for samples object
        let samples = data.samples;

        // Call the filter fuction to obtain the IDs from samples object
        let data_filtered = samples.filter((sample) => sample.id === id_number);
        
        // Create the variable for the first ID
        let first_id = data_filtered[0];

        // Assign the data to the elements of the bar chart
        let bar_chart = [{

            // Slice the top 10 OTUs and create the bar chart on sample_values
            x: first_id.sample_values.slice(0,10).reverse(),
            y: first_id.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: first_id.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h" 
        }];

        Plotly.newPlot("bar", bar_chart);
    });
}

// Create the bubble chart
function bubble(id_number) {
    // Fetch the JSON data and console log it
    d3.json(url).then(function(data) {
        console.log(data);

        // Create an array for samples object
        let samples = data.samples;

        // Call the filter fuction to obtain the IDs from samples object
        let data_filtered = samples.filter((sample) => sample.id === id_number);
        
        // Create the variable for the first ID
        let first_id = data_filtered[0];

        // Assign the data to the elements of the bubble chart
        let bubble_graph = [{
            x: first_id.otu_ids,
            y: first_id.sample_values,
            text: first_id.otu_labels,
            mode: "markers",
            marker: {
                size: first_id.sample_values,
                color: first_id.otu_ids,
                colorscale: "Earth",
                opacity: 0.7
            }
        }];

        // Add the x-axis legend
        let layout = {
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", bubble_graph, layout);
    });
}

// Create the demographic info panel
function demo_panel(id_number) {

    // Fetch the JSON data and console log it
    d3.json(url).then(function(data) {
        console.log(data);

        // Create an array for metadata object
        let metadata = data.metadata;

        // Call the filter fuction to obtain the IDs from samples object
        let data_filtered = metadata.filter((meta_data) => meta_data.id == id_number);
        
        // Create the variable for the first ID
        let first_id = data_filtered[0];

        // Clean up the div with id "sample-metadata" in html
        d3.select("#sample-metadata").html("");

        // Call method object.entries() to create an array for metadata key-value pairs
        let key_value = Object.entries(first_id);

        // Append h5 child element to the div with id "sample-metadata" in html
        key_value.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        // Print the key_value pair array to the console
        console.log(key_value);
    });
}

// Create the gauge chart
function gauge(id_number) {
    // Fetch the JSON data
    d3.json(url).then(function(data) {

        // Create an array for metadata object
        let metadata = data.metadata;

        // Call the filter fuction to obtain the IDs from samples object
        let data_filtered = metadata.filter((meta_data) => meta_data.id == id_number);

        // Console log the filtered data
        console.log(data_filtered);
        
        // Create the variable for the first ID
        let first_id = data_filtered[0];

        // Call Object.value method to get the washing frequency
        let wash_freq = Object.values(first_id)[6];

        // Assign the data to the elements of the gauge chart
        let gauge_chart = [{
            value: wash_freq,
            domain: {x: [0, 1], y: [0, 1] },
		    title: {
                text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                font: {color: "black", size: 16}
            },
		    type: "indicator",
		    mode: "gauge+number",
            gauge: {
                axis: {range: [0,10], tickmode: "linear", tick0: 2, dtick: 2}, 
                bar: {color: "black"},
                steps: [
                    {range: [0, 1], color: "rgba(255, 255, 255, 0)"},
                    {range: [1, 2], color: "rgba(232, 226, 202, .5)"},
                    {range: [2, 3], color: "rgba(210, 206, 145, .5)"},
                    {range: [3, 4], color: "rgba(202, 209, 95, .5)"},
                    {range: [4, 5], color: "rgba(184, 205, 68, .5)"},
                    {range: [5, 6], color: "rgba(170, 202, 42, .5)"},
                    {range: [6, 7], color: "rgba(142, 178, 35 , .5)"},
                    {range: [7, 8], color: "rgba(110, 154, 22, .5)"},
                    {range: [8, 9], color: "rgba(50, 143, 10, 0.5)"},
                    {range: [9, 10], color: "rgba(14, 127, 0, .5)"}
                ],
                threshold: {
                    line: {color: "red", width: 4},
                    thickness: 0.75,
                    value: wash_freq
                },
                shape: "angular",
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray"
            }
        }]
        
        // Set up the yayout
        let layout = {
            annotations: [
                {
                    x: 0.98,
                    y: 0.36,
                    text: "<b>9-10</b>",
                    showarrow: false,
                    font: {
                        family: 'serif',
                        size: 14,
                        color: 'black'
                    }
                }
            ],
            width: 500, 
            height: 500,
            margin: {t: 0, b:0}
        };

        Plotly.newPlot("gauge", gauge_chart, layout);
    });
}

// Update the chart when the option changes
function optionChanged(id_number) {
    bar(id_number);
    bubble(id_number);
    demo_panel(id_number);
    gauge(id_number);
}


init();