document.getElementById('csvFileInput').addEventListener('change', handleFileSelect, false);

let entries = [];

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const text = event.target.result;
        const rows = text.split('\n');
        // Assuming the first row is the header
        const header = rows[0].toLowerCase().split(',').map(h => h.trim());
        const nameIndex = header.indexOf('name');
        const codeIndex = header.indexOf('code');
        
        if (nameIndex !== -1 && codeIndex !== -1) {
            entries = [];
            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].split(',').map(c => c.trim());
                if (cells[nameIndex] && cells[codeIndex]) {
                    entries.push({
                        name: cells[nameIndex],
                        code: cells[codeIndex]
                    });
                }
            }
        } else {
            alert("CSV must have 'name' and 'code' columns.");
        }
    };

    reader.readAsText(file);
}

function startProcessing() {
    const processButton = document.querySelector('button');
    const loadingDiv = document.getElementById('loading');
    const manyPerson = document.getElementById('manyPerson').value;
    loadingDiv.style.display = 'block';
    processButton.disabled = true;

    setTimeout(() => {
        processButton.disabled = false;
        loadingDiv.style.display = 'none';
        processCSV(parseInt(manyPerson));
    }, 3000);
}

function processCSV(groupSize) {
    shuffleArray(entries);
    const groups = [];
    for (let i = 0; i < entries.length; i += groupSize) {
        groups.push(entries.slice(i, i + groupSize));
    }

    displayGroups(groups);
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayGroups(groups) {
    const container = document.getElementById('groupsContainer');
    container.innerHTML = '';
    groups.forEach((group, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'col-lg-4 col-md-6 col-12';
        const groupCard = document.createElement('div');
        groupCard.className = 'bg-white group shadow';
        groupDiv.appendChild(groupCard);
        const groupHeader = document.createElement('h3');
        groupHeader.textContent = `Group ${index + 1}`;
        groupCard.appendChild(groupHeader);
        const groupList = document.createElement('ul');
        group.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.code} - ${entry.name}`;
            groupList.appendChild(listItem);
        });
        groupCard.appendChild(groupList);
        container.appendChild(groupDiv);
    });
}
