import app, { initPromise } from '../server/server.js';

export default async function handler(req, res) {
  try {
    if (initPromise) {
      await initPromise;
    }
    return app(req, res);
  } catch (err) {
    console.error('Serverless Execution Error in api/index.js:', err);
    return res.status(500).json({
      error: 'Serverless Function Error',
      message: err.message
    });
  }
}
