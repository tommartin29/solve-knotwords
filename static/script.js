function createSetInputs() {
    const numSetsInput = document.getElementById('numSets');
    const numSets = parseInt(numSetsInput.value);
  
    const setsContainer = document.getElementById('setsContainer');
    setsContainer.innerHTML = '';
  
    for (let i = 1; i <= numSets; i++) {
      const setGroup = document.createElement('div');
      setGroup.classList.add('set-group');
  
      const lettersLabel = document.createElement('label');
      lettersLabel.textContent = `Letters Set ${i}:`;
      setGroup.appendChild(lettersLabel);
  
      const lettersInput = document.createElement('input');
      lettersInput.type = 'text';
      lettersInput.name = `letters${i}`;
      setGroup.appendChild(lettersInput);
  
      const lengthLabel = document.createElement('label');
      lengthLabel.textContent = `Length Set ${i}:`;
      setGroup.appendChild(lengthLabel);
  
      const lengthInput = document.createElement('input');
      lengthInput.type = 'number';
      lengthInput.name = `length${i}`;
      lengthInput.min = '1';
      setGroup.appendChild(lengthInput);
  
      setsContainer.appendChild(setGroup);
    }
  }
  
  // Create the initial set inputs when the page loads
  createSetInputs();
  
  // Toggle the about section
  document.getElementById('aboutButton').addEventListener('click', function() {
    const aboutContainer = document.getElementById('aboutContainer');
    if (aboutContainer.style.display === 'none') {
      aboutContainer.style.display = 'block';
    } else {
      aboutContainer.style.display = 'none';
    }
  });
  
  document.getElementById('wordForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const numSets = document.getElementById('numSets').value;
    const letters = [];
    const lengths = [];
    for (let i = 0; i < numSets; i++) {
      const lettersInput = document.querySelector(`input[name="letters${i + 1}"]`);
      const lengthInput = document.querySelector(`input[name="length${i + 1}"]`);
      if (!lettersInput.checkValidity() || !lengthInput.checkValidity()) {
        return;
      }
      letters.push(lettersInput.value);
      lengths.push(lengthInput.value);
    }
    const pattern = document.getElementById('pattern').value;
  
    console.log('Form submitted:');
    console.log('Letters:', letters);
    console.log('Lengths:', lengths);
    console.log('Pattern:', pattern);
  
    fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        letters: letters.join('|'),
        lengths: lengths.join(','),
        pattern: pattern
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response received:', data);
  
        const foundWordsElement = document.getElementById('foundWords');
        const matchingWordsElement = document.getElementById('matchingWords');
  
        console.log('foundWordsElement:', foundWordsElement);
        console.log('matchingWordsElement:', matchingWordsElement);
  
        if (!foundWordsElement || !matchingWordsElement) {
          console.error('Error: foundWordsElement or matchingWordsElement is null.');
          return;
        }
  
        foundWordsElement.textContent = data.found_words.length === 0 ? 'No words found.' : data.found_words.join(', ');
        matchingWordsElement.textContent = data.matching_words.length === 0 ? 'No words match the pattern.' : data.matching_words.join(', ');
  
        document.getElementById('resultsContainer').style.display = 'block';
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
  