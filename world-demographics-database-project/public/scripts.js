/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

// Function for resetting the db
async function resetDatabase() {
    const buttonElement = document.getElementById('resetDatabase');
    const resultElement = document.getElementById('resetDbResult');

    // button state
    buttonElement.textContent = 'Resetting...';
    buttonElement.disabled = true;
    resultElement.textContent = '';

    try {
        console.log('reaching scripts/resetDatabase')
        const response = await fetch('/reset-database', {
            method: 'POST'
        });

        const data = await response.json();
        console.log(data, 'here')
        if (data.success) {
            resultElement.textContent = data.message;
            resultElement.className = 'success-message';

            // refresh all data
            fetchTableData();

            // force reload
            const activeTab = document.querySelector('.tab-button.active');
            if (activeTab) {
                activeTab.click();
            }
            console.log('end of resetDb()')
        } else {
            resultElement.textContent = data.message;
            resultElement.className = 'error-message';
        }
    } catch (error) {
        resultElement.textContent = 'Error resetting database: ' + error.message;
        resultElement.className = 'error-message';
    } finally {
        // reset button
        buttonElement.textContent = 'Reset Database';
        buttonElement.disabled = false;
    }
}

// For Query 1: Inserting New City into City Relation
async function insertCity(event) {
    event.preventDefault();

    const cityName = document.getElementById('cityName').value;
    const countryId = document.getElementById('countryId').value;
    const population = document.getElementById('population').value;

    try {
        // making API request
        const response = await fetch('/city/insert-city', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cityName, countryId, population })
        });

        const result = await response.json();
        const resultEle = document.getElementById('insertResult');
        resultEle.textContent = result.message;
        resultEle.className = result.success ? 'Result message: Success' : 'Result message: error';

        // clearing form if we have a successful api request
        if(result.success) {
            alert('Successfully Added a City')
            document.getElementById('cityName').value = '';
            document.getElementById('countryId').value = '';
            document.getElementById('population').value = '';
        }
        fetchAndDisplayCities();
    } catch (err) {
        const resultEle = document.getElementById('insertResult');
        resultEle.textContent = 'Error occurred while making request.';
        resultEle.className = 'Result message: Error.';
    }
}

// For Query 2: UPDATE Currency
async function updateCurrency(event) {
    event.preventDefault();

    const currencyCode = document.getElementById('currencyCode').value;
    const currencyName = document.getElementById('currencyName').value;
    const valueAgainstUSD = document.getElementById('valueAgainstUSD').value;

    try {
        // making API request
        const response = await fetch('/currency/update-currency', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currencyCode, currencyName, valueAgainstUSD })
        });

        const result = await response.json();

        const resultEle = document.getElementById('updateCurrencyResult');
        resultEle.textContent = result.message;
        resultEle.className = result.success ? 'Result message: Success' : 'Result message: error';

        // clearing form if we have a successful api request
        if(result.success) {
            alert('Successfully Updated Currency')
            fetchAndDisplayCurrencies();
            document.getElementById('currencyCode').value = '';
            document.getElementById('currencyName').value = '';
            document.getElementById('valueAgainstUSD').value = '';
        }
    } catch (err) {
        const resultEle = document.getElementById('updateCurrencyResult');
        resultEle.textContent = 'Error occurred while making request.';
        resultEle.className = 'Result message: Error.';
    }
}

// For Query 3: Delete
async function deleteCity(event) {
    event.preventDefault();

    const cityName = document.getElementById('deleteCityName').value;
    const countryID = document.getElementById('deleteCityCountryID').value;

    try {
        // making API request
        const response = await fetch('/city/delete-city', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cityName, countryID })
        });

        const result = await response.json();

        const resultEle = document.getElementById('deleteCityResult');
        resultEle.textContent = result.message;
        resultEle.className = result.success ? 'Result message: Success' : 'Result message: error';

        // clearing form if we have a successful api request
        if(result.success) {
            alert('Successfully Deleted a City')
            document.getElementById('deleteCityName').value = '';
            document.getElementById('deleteCityCountryID').value = ''; // Fixed typo here
            fetchAndDisplayCities();
        }

    } catch (err) {
        alert('Could not Delete City')
        const resultEle = document.getElementById('deleteCityResult');
        resultEle.textContent = 'Error occurred while making request.';
        resultEle.className = 'Result message: Error.';
    }
}

// For Query 4: Selection Query for Country
async function countrySelection(event) {
    event.preventDefault();

    // Get values from form
    const minPopulation = document.getElementById('minPopulation').value || 0;
    const maxPopulation = document.getElementById('maxPopulation').value || Number.MAX_SAFE_INTEGER;
    const minGDP = document.getElementById('minGDP').value || 0;
    const maxGDP = document.getElementById('maxGDP').value || Number.MAX_SAFE_INTEGER;
    const name = document.getElementById('countryName').value || 'null';
    const currencyCode = document.getElementById('countryCurrencyCode').value || 'null';

    // Properly format the query parameters
    const queryParameters = new URLSearchParams({
        minPopulation,
        maxPopulation,
        minGDP,
        maxGDP,
        name,
        currencyCode
    }).toString();

    try {
        const response = await fetch(`/countries/country-selection?${queryParameters}`, {
            method: 'GET'
        });

        const result = await response.json();
        const resultEle = document.getElementById('countrySelectionResult');
        resultEle.textContent = result.message;
        resultEle.className = result.success ? 'Result message: Success' : 'Result message: error';

        // clearing form if we have a successful api request
        if(result.success) {
            document.getElementById('minPopulation').value = '';
            document.getElementById('maxPopulation').value = '';
            document.getElementById('minGDP').value = '';
            document.getElementById('maxGDP').value = '';
            document.getElementById('countryName').value = '';
            document.getElementById('countryCurrencyCode').value = '';
        }
    } catch (err) {
        const resultEle = document.getElementById('countrySelectionResult');
        resultEle.textContent = 'Error occurred while making request.';
        resultEle.className = 'Result message: Error.';
    }
}

// For Query 5: Projection
async function languageProjection(event) {
    event.preventDefault();

    // getting user selected attributes
    const selectedAttributes = [];
    document.querySelectorAll('input[name="languageAttributes"]:checked').forEach(checkbox => {
        selectedAttributes.push(checkbox.value);
    });

    // checking we selected an attribute
    if (selectedAttributes.length === 0) {
        const resultElement = document.getElementById('languageProjectionResult');
        resultElement.textContent = 'Please select at least one attribute';
        resultElement.className = 'error-message';
        return;
    }

    try {
        const response = await fetch(`/languages/language-projection?attributes=${selectedAttributes.join(',')}`);
        const result = await response.json();

        if (result.success) {
            const headerRow = document.getElementById('languageProjectionHeader');
            headerRow.innerHTML = '';

            selectedAttributes.forEach(attr => {
                const headerCell = document.createElement('th');

                let displayName = attr;
                if (attr === 'languageName') displayName = 'Language Name';
                if (attr === 'scriptType') displayName = 'Script Type';
                if (attr === 'languageFamily') displayName = 'Language Family';

                headerCell.textContent = displayName;
                headerRow.appendChild(headerCell);
            });

            const tableBody = document.querySelector('#languageProjectionTable tbody');
            tableBody.innerHTML = '';

            result.data.forEach(language => {
                const row = document.createElement('tr');

                selectedAttributes.forEach(attr => {
                    const cell = document.createElement('td');
                    cell.textContent = language[attr] || 'N/A';
                    row.appendChild(cell);
                });

                tableBody.appendChild(row);
            });

            document.getElementById('languageProjectionContainer').style.display = 'block';

            // clearing
            const resultElement = document.getElementById('languageProjectionResult');
            resultElement.textContent = '';
            resultElement.className = '';
        } else {
            throw new Error(result.message || 'Failed to fetch languages');
        }
    } catch (err) {
        console.error('Error performing language projection:', err);
        const resultElement = document.getElementById('languageProjectionResult');
        resultElement.textContent = 'Error: ' + err.message;
        resultElement.className = 'error-message';
    }
}

//For Query 6: Join
async function getCountriesByLanguage(event) {

    event.preventDefault();

    const languageName = document.getElementById('languageName').value;
    const tableElement = document.getElementById('resultsTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch(`/languages/countries-by-language?language=${languageName}`, {
        method: 'GET'
    });

    const responseData = await response.json();
    const countries = responseData.data;

    console.log(responseData, '319')
    console.log(countries, '320')

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    countries.forEach(country => {
        const row = tableBody.insertRow();
        const fields = [country[0], country[1], country[2]];
        fields.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
    document.getElementById('resultsTable').style.display = '';
}

// For Query 7: Aggregation with GROUP BY --> Average City population by country
async function averageCityPopByCountry() {
    try {
        // making db request
        const response = await fetch('/countries/avg-city-population');
        const result = await response.json();

        if(result.success) {
            // tabulate results
            const tableBody = document.querySelector('#averageCityPopulationTable tbody');
            tableBody.innerHTML = '';

            result.data.forEach(row => {
                // create table row for each row in query result
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.countryName}</td>
                    <td>${row.averageCityPopulation.toLocaleString()}</td>
                    <td>${row.cityCount}</td>
                `
                // append it to the table body
                tableBody.appendChild(tr);
            })
            document.getElementById('averageCityPopByCountry').style.display = 'block';
        } else {
            throw new Error(`Error processing request: ${result.message}`);
        }
    } catch (err) {

    }
}

// For Query 8: Aggregation with Having to get widely spoken languages
async function getWidelySpokenLanguages() {
    try {
        // making db request
        const response = await fetch('/languages/get-widely-spoken-languages');
        const result = await response.json();

        if(result.success) {
            // tabulate results
            const tableBody = document.querySelector('#widelySpokenLanguagesTable tbody');
            tableBody.innerHTML = '';

            result.data.forEach(row => {
                // create table row for each row in query result
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row[0]}</td>
                    <td>${row[1]}</td>
                `
                // append it to the table body
                tableBody.appendChild(tr);
            })
            document.getElementById('widelySpokenLanguagesContainer').style.display = 'block';
        } else {
            throw new Error(`Error processing request: ${result.message || 'Unknown error'}`);
        }
    } catch (err) {
        console.error('Error fetching widely spoken languages:', err);
    }
}

// For Query 10: Division to get Countries with all climate types
async function countriesWithAllClimateTypes() {
    try {
        // making db request
        const response = await fetch('/countries/countries-with-all-climate-types');
        const result = await response.json();

        if(result.success) {
            // tabulate results
            const tableBody = document.querySelector('#countriesWithAllClimateTypesTable tbody');
            tableBody.innerHTML = '';

            result.data.forEach(row => {
                // create table row for each row in query result
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.name}</td>
                `
                // append it to the table body
                tableBody.appendChild(tr);
            })
            document.getElementById('countriesWithAllClimateTypes').style.display = 'block';
        } else {
            throw new Error(`Error processing request: ${result.message}`);
        }
    } catch (err) {

    }
}

// For Query 9: Nested group by aggregation to get continent with lowest avg GDP
async function getLowestAvgGdpContinent() {
    try {
        // making db request
        const response = await fetch('/gdp/lowest-avg-gdp-continent');
        const result = await response.json();

        if(result.success) {
            // tabulate results
            const tableBody = document.querySelector('#lowestAvgGdpTable tbody');
            tableBody.innerHTML = '';

            result.data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row[0]}</td>
                `
                tableBody.appendChild(tr);
            })
            document.getElementById('lowestAvgGdpContainer').style.display = 'block';
        } else {
            throw new Error(`Error processing request: ${result.message || 'Unknown error'}`);
        }
    } catch (err) {
        console.error('Error fetching lowest average GDP:', err);
    }
}

// for tab navigation
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from everything
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}


// Fetching and displaying countries data
async function fetchAndDisplayCountries() {
    try {
        console.log('fetchcountries')
        const response = await fetch('/countries');
        const result = await response.json();

        console.log('getting somewhere')
        if (result.success) {
            // for countries tab
            const tableBody = document.querySelector('#countriesTable tbody');

            // clearing and resetting data
            if (tableBody) {
                tableBody.innerHTML = '';

                result.data.forEach(country => {
                    const row = tableBody.insertRow();

                    const nameCell = row.insertCell();
                    nameCell.textContent = country.name;

                    const populationCell = row.insertCell();
                    populationCell.textContent = country.population;

                    const gdpCell = row.insertCell();
                    gdpCell.textContent = country.gdp;

                    const surfaceAreaCell = row.insertCell();
                    surfaceAreaCell.textContent = country.surfaceArea;

                    const currencyCodeCell = row.insertCell();
                    currencyCodeCell.textContent = country.currencyCode;
                });
            }
        } else {
            console.error('Failed to fetch countries:', result.message);
        }
    } catch (err) {
        console.error('Error fetching countries:', err);
    }
}

// Fetch countries, populate dropdown menus
async function fetchAndPopulateCountries() {
    try {
        // get all countries
        const response = await fetch('/countries');
        const result = await response.json();

        if (result.success) {
            // dropdown elements
            const countryDropdowns = [
                document.getElementById('countryId'),
                document.getElementById('deleteCityCountryID')
            ];

            // populating dropdowns
            countryDropdowns.forEach(dropdown => {
                if (dropdown) {
                    const firstOption = dropdown.options[0];
                    dropdown.innerHTML = '';
                    dropdown.appendChild(firstOption);

                    result.data.forEach(country => {
                        const option = document.createElement('option');
                        option.value = country.id;
                        option.textContent = country.name;
                        dropdown.appendChild(option);
                    });
                }
            });
        } else {
            console.error('Error retrieving countries:', result.message);
        }
    } catch (err) {
        console.error('Error retrieving countries:', err);
    }
}


// Fetching and displaying cities data
async function fetchAndDisplayCities() {
    try {
        const response = await fetch('/city');
        const result = await response.json();

        if (result.success) {
            // for cities tab
            const tableBody = document.querySelector('#citiesTable tbody');
            if (tableBody) {
                tableBody.innerHTML = '';

                result.data.forEach(city => {
                    const row = tableBody.insertRow();

                    const nameCell = row.insertCell();
                    nameCell.textContent = city.cityName;

                    const countryCell = row.insertCell();
                    countryCell.textContent = city.countryName;

                    const populationCell = row.insertCell();
                    populationCell.textContent = city.population.toLocaleString();
                });
            }
        } else {
            console.error('Failed to fetch cities:', result.message);
        }
    } catch (err) {
        console.error('Error fetching cities:', err);
    }
}

// Fetching and displaying currencies data
async function fetchAndDisplayCurrencies() {
    try {
        const response = await fetch('/currency');
        const result = await response.json();

        if (result.success) {
            // for currencies tab

            const tableBody = document.querySelector('#currenciesTable tbody');
            if (tableBody) {
                tableBody.innerHTML = '';

                result.data.forEach(currency => {
                    const row = tableBody.insertRow();

                    const codeCell = row.insertCell();
                    codeCell.textContent = currency.code;

                    const nameCell = row.insertCell();
                    nameCell.textContent = currency.name;

                    const valueAgainstUSDCell = row.insertCell();
                    valueAgainstUSDCell.textContent = currency.valueAgainstUSD.toLocaleString();
                });
            }
        } else {
            console.error('Failed to fetch currencies:', result.message);
        }
    } catch (err) {
        console.error('Error fetching currencies:', err);
    }
}

// Fetching and display languages
async function fetchAndDisplayLanguages() {
    try {
        const response = await fetch('/languages');
        const result = await response.json();

        if (result.success) {
            // for languages tab

            const tableBody = document.querySelector('#languagesTable tbody');
            if (tableBody) {
                tableBody.innerHTML = '';

                result.data.forEach(language => {
                    const row = tableBody.insertRow();

                    const nameCell = row.insertCell();
                    nameCell.textContent = language.language;

                    const scriptCell = row.insertCell();
                    scriptCell.textContent = language.scriptType;

                    const familyCell = row.insertCell();
                    familyCell.textContent = language.languageFamily;
                });
            }
        } else {
            console.error('Failed to fetch languages:', result.message);
        }
    } catch (err) {
        console.error('Error fetching languages:', err);
    }
}

// Fetching GDP data
async function fetchAndDisplayGDP() {
    try {
        const response = await fetch('/gdp');
        const result = await response.json();

        if (result.success) {
            // for GDP tab

            const tableBody = document.querySelector('#gdpTable tbody');
            if (tableBody) {
                tableBody.innerHTML = '';

                result.data.forEach(gdpEntry => {
                    const row = tableBody.insertRow();

                    const countryName = row.insertCell();
                    countryName.textContent = gdpEntry.name;

                    const gdpCell = row.insertCell();
                    gdpCell.textContent = gdpEntry.gdp.toLocaleString();
                });
            }
        } else {
            console.error('Failed to fetch GDP data:', result.message);
        }
    } catch (err) {
        console.error('Error fetching GDP data:', err);
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();

    // tab navigation
    setupTabs();

    // loading everything from db
    fetchTableData();


    // Country tab functionality
    document.getElementById("loadAvgCityPopButton").addEventListener("click", averageCityPopByCountry);
    document.getElementById("loadAllClimateTypesBtn").addEventListener("click", countriesWithAllClimateTypes);
    document.getElementById("runQueryButton").addEventListener("click", countrySelection)

    // City tab functionality
    document.getElementById("insertCity").addEventListener("submit", insertCity);
    document.getElementById("deleteCity").addEventListener("submit", deleteCity);

    // Currency tab functionality
    document.getElementById("updateCurrencyForm").addEventListener("submit", updateCurrency);

    // Language Tab functionality
    document.getElementById("loadWidelySpokenLanguagesBtn").addEventListener("click", getWidelySpokenLanguages);
    document.getElementById("languageProjectionForm").addEventListener("submit", languageProjection);
    document.getElementById("getCountryByLanguage").addEventListener("submit", getCountriesByLanguage);

    // GDP Tab functionality
    document.getElementById("loadLowestAvgGdpBtn").addEventListener("click", getLowestAvgGdpContinent);

    // Resetting db
    document.getElementById("resetDatabase").addEventListener("click", resetDatabase);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndPopulateCountries();
    fetchAndDisplayCountries();
    fetchAndDisplayCities();
    fetchAndDisplayCurrencies();
    fetchAndDisplayLanguages();
    fetchAndDisplayGDP();
}
