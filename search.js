document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value;
    fetch(`https://tempus2.xyz/api/v0/search/playersAndMaps/${query}`)
        .then(response => response.json())
        .then(data => {
            const results = document.getElementById('searchResults');
            results.innerHTML = '';

            if (data && (data.maps.length || data.players.length)) {
                appendResults('Maps', data.maps, results, false);
                appendResults('Players', data.players, results, true);
            } else {
                results.innerHTML = '<li>No results found.</li>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            results.innerHTML = '<li>Error loading data. Please try again later.</li>';
        });
});

function appendResults(title, items, resultsContainer, isPlayer) {
    if (items.length) {
        const header = document.createElement('li');
        header.textContent = title;
        header.className = 'result-header';
        resultsContainer.appendChild(header);

        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name;
            if (isPlayer) {
                li.className = 'player-result';
                li.addEventListener('click', function() {
                    showPlayerProfile(item);
                });
                const details = document.createElement('div');
                details.className = 'player-details';
                details.innerHTML = `ID: ${item.id}<br>SteamID: ${item.steamid}`;
                li.appendChild(details);
            }
            resultsContainer.appendChild(li);
        });
    }
}


function showPlayerProfile(player) {
    fetch(`https://tempus2.xyz/api/v0/players/id/${player.id}/stats`)
        .then(response => response.json())
        .then(data => {
            const profileDiv = document.getElementById('playerProfile');
            profileDiv.style.display = 'block';
            document.getElementById('search').style.display = 'none'; // Hide search section

            const profileContent = document.getElementById('profileContent');
            profileContent.innerHTML = `
                <h3>${data.player_info.name}</h3>
                <p>ID: ${data.player_info.id}</p>
                <p>SteamID: ${data.player_info.steamid}</p>
                <p>Country: ${data.player_info.country}</p>
                <p>Total Points: ${data.rank_info.points}</p>
                <p>Overall Rank: ${data.rank_info.rank}</p>
                <p>Country Rank: ${data.country_rank_info.rank}</p>
                <h4>Class Ranks</h4>
                <p>Soldier Rank: ${data.class_rank_info['3'].rank} (Points: ${data.class_rank_info['3'].points}, Title: ${data.class_rank_info['3'].title})</p>
                <p>Demo Rank: ${data.class_rank_info['4'].rank} (Points: ${data.class_rank_info['4'].points}, Title: ${data.class_rank_info['4'].title})</p>
                <!-- Display more stats as needed -->
            `;
            // Here, you can further process and display other statistics like pr_stats, wr_stats, etc.

            document.getElementById('mapSearchButton').setAttribute('data-playerid', data.player_info.id);
        })
        .catch(error => {
            console.error('Error:', error);
            const profileContent = document.getElementById('profileContent');
            profileContent.innerHTML = '<p>Error loading profile. Please try again later.</p>';
        });
}

document.getElementById('mapSearchButton').addEventListener('click', function() {
    const query = document.getElementById('mapSearchInput').value;
    const playerId = document.getElementById('mapSearchButton').getAttribute('data-playerid');
    performMapSearch(query, playerId);
});

function performMapSearch(query, playerId) {
    fetch(`https://tempus2.xyz/api/v0/search/playersAndMaps/${query}`)
        .then(response => response.json())
        .then(data => {
            const results = document.getElementById('mapSearchResults');
            results.innerHTML = '';

            if (data && data.maps.length) {
                data.maps.forEach(map => {
                    const li = document.createElement('li');
                    li.textContent = map.name;
                    li.className = 'map-result';
                    li.addEventListener('click', function() {
                        showMapDetails(map, playerId);
                    });
                    results.appendChild(li);
                });
            } else {
                results.innerHTML = '<li>No map results found.</li>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            results.innerHTML = '<li>Error loading map data. Please try again later.</li>';
        });
}

function showMapDetails(map, playerId) {
    // Hide map search section
    document.getElementById('mapSearch').style.display = 'none';

    // Create a div for map details
    const mapDetailsDiv = document.createElement('div');
    mapDetailsDiv.id = 'mapDetails';
    mapDetailsDiv.innerHTML = `<h3>Map Details: ${map.name}</h3>`;

    // Fetch and display Soldier (class 3) stats
    fetchMapStats(map.id, playerId, 3, mapDetailsDiv);

    // Fetch and display Demo (class 4) stats
    fetchMapStats(map.id, playerId, 4, mapDetailsDiv);

    // Create a back button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Map Search';
    backButton.id = 'backToMapSearchButton';
    backButton.addEventListener('click', function() {
        document.getElementById('playerProfile').removeChild(mapDetailsDiv);
        document.getElementById('mapSearch').style.display = 'block';
    });

    mapDetailsDiv.appendChild(backButton);
    document.getElementById('playerProfile').appendChild(mapDetailsDiv);
}

function fetchMapStats(mapId, playerId, classId, container) {
    const apiUrl = `https://tempus2.xyz/api/v0/maps/id/${mapId}/zones/typeindex/map/1/records/player/${playerId}/${classId}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const className = classId === 3 ? 'Soldier' : 'Demo';
            const statsSection = document.createElement('div');
            if (data.result) {
                statsSection.innerHTML = `
                    <h4>${className} Stats</h4>
                    <p>Completions: ${data.completion_info[className.toLowerCase()]}</p>
                    <p>Rank: ${data.result.rank}</p>
                    <p>Duration: ${data.result.duration.toFixed(2)} seconds</p>
                    <!-- Additional details can be added here -->
                `;
            } else {
                statsSection.innerHTML = `
                    <h4>${className} Stats</h4>
                    <p>No Completions</p>
                `;
            }
            container.appendChild(statsSection);
        })
        .catch(error => {
            console.error('Error fetching map stats:', error);
            const errorSection = document.createElement('div');
            errorSection.textContent = `Error loading ${classId === 3 ? 'Soldier' : 'Demo'} stats.`;
            container.appendChild(errorSection);
        });
}

document.getElementById('backButton').addEventListener('click', backToSearch);

function backToSearch() {
    document.getElementById('search').style.display = 'block';
    document.getElementById('playerProfile').style.display = 'none';
}