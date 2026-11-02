# Learnloop AI prototype (Netlify)

This package keeps the existing Learnloop HTML app and adds an automatic AI-test generation button. Saved tests, scores, mistake book and analytics remain in the browser's local storage. Only test settings (exam, difficulty, question count and chapter text) are sent to the Netlify Function; personal study history is not sent.

## Deploy

1. Put `index.html` and the `netlify/` folder at the root of the same Netlify site/repository.
2. In Netlify: **Site configuration → Environment variables**, add:
   - `GEMINI_API_KEY` = your Google AI Studio API key (secret; never put it in `index.html`)
   - optional `GEMINI_MODEL` = `gemini-2.5-flash-lite`
3. Trigger a new deploy.
4. Open the deployed site, go to **Tests → Build an AI test**, select 20 questions and tap **Generate test automatically**.

The function expects Node.js 18+ (built-in `fetch`) and is deployed automatically by Netlify from `netlify/functions/`.

## Important prototype notes

- Google AI Studio free-tier eligibility, quotas, model availability and data-use terms can change. Check current terms before using it with real student content.
- There is no app-level user authentication or robust per-user rate limiting in this prototype. The provider's quota is not a hard cost cap. For a public link, add abuse/rate limiting or keep the site shared only with trusted testers.
- AI questions and answer keys can be wrong. Review generated tests before relying on them for exam preparation.
- Start with 20 questions. Large 100–180-question outputs may exceed provider output limits or be incomplete; if that happens, generate smaller tests.
- No API key is included in this package.
