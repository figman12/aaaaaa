/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
