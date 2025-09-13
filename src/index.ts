import app from './api/app';
import { ENV } from './api/config/env';

app.listen(ENV.PORT, () => {
	console.log(`[server] Server running at port ${ENV.PORT}`);
	console.log(`[server] Running at: http://localhost:${ENV.PORT}`);
});
