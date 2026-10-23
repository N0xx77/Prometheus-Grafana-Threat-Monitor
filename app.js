const express = require('express');
const client = require('prom-client');

const app = express();
app.use(express.json());

//Collect standard node runtime/process metrics
client.collectDefaultMetrics();

//Metric 1: Track Authentication Attempts (Brute-Force Vector)
const authCounter = new client.Counter({
  name: 'security_auth_attempts_total',
  help: 'Total login attempts categorized by status',
  labelNames: ['status']
});

//Metric 2: Track Unauthorized Access (Reconnaissance/Path Probing Vector)
const accessViolationCounter = new client.Counter({
  name: 'security_access_violations_total',
  help: 'Total 401/403 access violations categorized by route',
  labelNames: ['route']
});

//Endpoint exposed for Prometheus scraping
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

//Targeted Endpoint: Authentication API
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    authCounter.inc({ status: 'success' });
    return res.status(200).json({ status: 'Authenticated' });
  }
  authCounter.inc({ status: 'failure' });
  return res.status(401).json({ error: 'Invalid Credentials' });
});

//Targeted Endpoint: Restricted Admin API
app.get('/api/admin', (req, res) => {
  accessViolationCounter.inc({ route: '/api/admin' });
  res.status(403).json({ error: 'Forbidden' });
});

app.listen(5000, () => console.log('[+] Target Security API live on port 5000'));