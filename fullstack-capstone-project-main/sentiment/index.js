require('dotenv').config();
const express = require('express');
const cors = require('cors');
const natural = require('natural');

// Task 2: Initialize the Express server
const app = express();
app.use(cors());
app.use(express.json());

const port = 3070;

// Task 3: Create a POST /sentiment endpoint
app.post('/sentiment', async (req, res) => {
    try {
        // Task 4: Extract the sentence parameter from the request body
        const { sentence } = req.body;

        if (!sentence) {
            return res
                .status(400)
                .json({ error: 'Sentence parameter is required' });
        }

        // Create an instance of the sentiment analyzer
        const analyzer = new natural.SentimentAnalyzer(
            'English',
            natural.PorterStemmer,
            'afinn'
        );

        // Analyze the sentence
        const words = new natural.WordTokenizer().tokenize(sentence);
        const score = analyzer.getSentiment(words);

        // Task 5: Process the response from Natural
        let sentiment;
        if (score < 0) {
            sentiment = 'negative';
        } else if (score >= 0 && score <= 0.33) {
            sentiment = 'neutral';
        } else {
            sentiment = 'positive';
        }

        // Task 6: Implement success return state
        res.json({
            sentence,
            score,
            sentiment,
        });
    } catch (error) {
        // Task 7: Implement error return state
        console.error('Error analyzing sentiment:', error);
        res.status(500).json({ error: 'Error analyzing sentiment' });
    }
});

app.listen(port, () => {
    console.log(`Sentiment Analysis Server running on port ${port}`);
});
