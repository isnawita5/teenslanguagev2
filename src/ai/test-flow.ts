import 'dotenv/config';

import { generateComicStrip } from './flows/generate-comic-strip';
import { interpretYouthLanguage } from './flows/interpret-youth-language';
import { suggestRelatedTerms } from './flows/suggest-related-terms';

async function main() {
    try {
        console.log('Testing suggestRelatedTerms...');
        const terms = await suggestRelatedTerms({ query: 'happy' });
        console.log('Related terms:', terms);

        console.log('\nTesting interpretYouthLanguage...');
        const interpretation = await interpretYouthLanguage({ query: 'lol', language: 'en' });
        console.log('Interpretation:', interpretation);

        console.log('\nTesting generateComicStrip...');
        const comicUrl = await generateComicStrip({
            termPhrase: 'Meeting a friend',
            exampleSentences: ['Hi there!', 'Long time no see.', 'How have you been?', 'Great, thanks!'],
            language: 'en'
        });
        console.log('Comic URL generated (length):', comicUrl.length);

    } catch (error) {
        console.error('Error running flows:', error);
    }
}

main();
