export default async function handler(req, res) {
  try {
    const { default: app, initPromise } = await import('../server/server.js');
    if (initPromise) {
      await initPromise;
    }
    return app(req, res);
  } catch (err) {
    console.error('Serverless Crash Details:', err);
    return res.status(500).json({
      error: 'Backend Initialization Error',
      name: err.name,
      message: err.message,
      stack: err.stack
    });
  }
}
