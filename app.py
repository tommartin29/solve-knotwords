from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
import json
import itertools
import sys

app = Flask(__name__)
CORS(app)

def matches_pattern(word, pattern):
    if len(word) != len(pattern):
        return False
    for w, p in zip(word, pattern):
        if p != '?' and w != p:
            return False
    return True

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        data = request.get_json()
        lengths_from_each_set = [int(x) for x in data['lengths'].split(',')]
        letters_in_each_set = data['letters'].split('|')  # Split the letters string
        pattern = data['pattern']

        # Fetch the word list JSON file from the GitHub repository
        url = "https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json"
        response = requests.get(url)

        # Load the JSON data
        word_dict = json.loads(response.text)

        # Convert the keys to lowercase
        word_dict = {k.lower(): v for k, v in word_dict.items()}

        # Convert the input lengths and letters into separate lists
        lengths = lengths_from_each_set.copy()
        letters_sets = letters_in_each_set
        num_sets = len(lengths)

        # Generate all possible combinations
        found_words = set()  # Use a set to avoid duplicates
        matching_words = set()  # Words that match the pattern

        # If all the letters are contained within one set
        if num_sets == 1:
            permutations = itertools.permutations(letters_sets[0], lengths[0])
            for permutation in permutations:
                word = ''.join(permutation).lower()  # Convert to lowercase
                if word in word_dict:
                    found_words.add(word)
                    if matches_pattern(word, pattern):
                        matching_words.add(word)
        else:
            permutations = [itertools.permutations(letters, length) for letters, length in zip(letters_sets, lengths)]
            for permutation in itertools.product(*permutations):
                word = ''.join([''.join(p) for p in permutation]).lower()  # Convert to lowercase
                if word in word_dict:
                    found_words.add(word)
                    if matches_pattern(word, pattern):
                        matching_words.add(word)

        return jsonify({
            'found_words': sorted(list(found_words)),
            'matching_words': sorted(list(matching_words)),
        })
    else:
        return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
