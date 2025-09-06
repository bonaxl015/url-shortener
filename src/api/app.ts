import express, { Express } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import xssClean from 'xss-clean';
import path from 'path';

import mainRoutes from './routes';
import { customHeaders } from './middlewares/customHeaders';

const app: Express = express();

app.use(express.static(path.join(process.cwd(), '..', 'public')));

// body parser into json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// added security for headers
app.use(helmet());

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Prevent cross site scripting attacks
app.use(xssClean());

// Custom headers
app.use(customHeaders);

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../view'));

// Set routes
app.use(mainRoutes);

export default app;
