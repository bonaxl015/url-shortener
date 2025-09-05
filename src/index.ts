import app from './api/app';
import dotenv from 'dotenv';

dotenv.config();

const port: string | number = process.env.PORT || 5050;

app.listen(port, () => {
  console.log(`[server] Server running at port ${port}`);
  console.log(`[server] http://localhost:${port}`);
});
