import * as config from "@/config";
import app from "@/server";
import "@/utils/axiosDev";

(async () => {
	app.listen(config.PORT, () => {
		console.log(`Listening to port ${process.env.PORT}`);
	});
})();
