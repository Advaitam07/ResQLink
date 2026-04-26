const axios = require('axios');
const Case = require('../models/Case');
const { ok, fail } = require('../utils/response');

const translateText = async (text, target) => {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
  const { data } = await axios.post(url, { q: text, target, format: 'text' });
  return data.data.translations[0].translatedText;
};

// POST /api/translate
exports.translate = async (req, res) => {
  try {
    const { text, target = 'en' } = req.body;
    if (!text) return fail(res, 'Text required');
    const translated = await translateText(text, target);
    return ok(res, { original: text, translated, target }, 'Translation complete');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};

// POST /api/translate/case/:id
exports.translateCase = async (req, res) => {
  try {
    const { target = 'hi' } = req.body;
    const c = await Case.findById(req.params.id);
    if (!c) return fail(res, 'Case not found', 404);
    const [title, description] = await Promise.all([
      translateText(c.title, target),
      translateText(c.description, target),
    ]);
    return ok(res, { caseId: c._id, target, title, description }, 'Case translated');
  } catch (e) {
    return fail(res, e.message, 500);
  }
};
