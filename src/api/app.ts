import express, { Express } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import xssClean from 'xss-clean';

const app: Express = express();

// body parser into json
app.use(express.json());

// added security for headers
app.use(helmet());

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Prevent cross site scripting attacks
app.use(xssClean());

app.get('/', (req, res) => {
  res.send('Test')
})

export default app;
