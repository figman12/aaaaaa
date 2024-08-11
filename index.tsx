import { Plugin, Patcher, Utilities } from 'vencord';
import axios from 'axios';

// LibreTranslate API endpoint
const LIBRE_TRANSLATE_API = 'https://libretranslate.com/translate';

// Target language for translation
const TARGET_LANGUAGE = 'en'; // Example: English

// Function to translate text using LibreTranslate
const translateText = async (text: string, targetLanguage: string) => {
  try {
    const response = await axios.post(LIBRE_TRANSLATE_API, {
      q: text,
      source: 'auto', // Auto-detect source language
      target: targetLanguage,
      format: 'text',
    });

    return response.data.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return null;
  }
};

// Define your plugin
export default class AutoTranslatePlugin extends Plugin {
  async onStart() {
    console.log('AutoTranslatePlugin is starting!');

    // Hook into the message creation process
    Patcher.after('messageCreate', 'autoTranslate', (thisObject, [message]) => {
      // Ensure it's a valid message and not from the bot itself
      if (message.author.bot) return;

      // Translate the message content
      translateText(message.content, TARGET_LANGUAGE).then((translatedText) => {
        if (translatedText) {
          // Send the translated message as a reply
          message.channel.send(`Translated: ${translatedText}`);
        }
      });
    });
  }

  async onStop() {
    console.log('AutoTranslatePlugin is stopping!');
    // Clean up any patches or hooks if necessary
    Patcher.unpatchAll();
  }
}
