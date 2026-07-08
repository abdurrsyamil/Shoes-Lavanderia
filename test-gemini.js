import { GoogleGenAI } from '@google/genai';
console.log('Initiating test...');
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});
console.log('Gemini client created.');
try {
  console.log('Calling generateContent...');
  const res = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: 'test'
  });
  console.log('Success!', res.text);
} catch (err) {
  console.error('API Error:', err);
}
