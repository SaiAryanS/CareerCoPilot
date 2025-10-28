import {genkit} from 'genkit';
import {ollama} from 'genkitx-ollama';

export const ai = genkit({
  plugins: [
    ollama({
      models: [
        {
          name: 'llama3.1:8b',
          type: 'chat',
        },
      ],
      serverAddress: 'http://127.0.0.1:11434',
    }),
  ],
  model: 'ollama/llama3.1:8b',
});
