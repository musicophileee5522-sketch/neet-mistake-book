# NEET Mistake Book: 100% free setup

Hosting and AI both have free options, so students and you pay nothing.

1. Free AI key: go to aistudio.google.com, sign in, click "Get API key". No card needed.
2. Free hosting: upload this folder to GitHub, then create a free Web Service on Render (render.com).
   Build command `npm install`, start command `npm start`.
3. In Render, add environment variable `GEMINI_API_KEY` = your key.
   Optional: `GEMINI_MODEL` (default `gemini-flash-latest`; pick a free Flash or Flash-Lite model shown in AI Studio),
   `BATCHES_PER_HOUR` (per visitor, default 12 = about 180 questions/hour).
4. Open your Render address and share it.

Local test: `npm install`, then `GEMINI_API_KEY=your_key npm start`, open http://localhost:3000

Good to know
- Free tier has daily and per-minute limits shared by ALL visitors. If many students generate 180-question tests,
  some will see "quota busy, try later". Smaller tests (20-45) work much better.
- Render's free service sleeps after inactivity; the first visit may take about a minute to wake up.
- On the free tier Google may use prompts to improve its models. Only test-generation prompts are sent, never student data.
- Mistake books are stored in each student's own browser.
- To switch to paid Claude later, set `ANTHROPIC_API_KEY` instead and remove `GEMINI_API_KEY`.
