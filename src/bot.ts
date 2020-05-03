
import { Botkit } from 'botkit';
import * as dotenv from 'dotenv';
import { WebAdapter } from 'botbuilder-adapter-web';
import { BotkitCMSHelper } from 'botkit-plugin-cms';
import { MongoDbStorage }from '@botbuildercommunity/storage-mongodb';

dotenv.config();

console.log(process.env.PORT);

let storage = undefined;
let mongoStorage = undefined;
if (
  process.env.MONGO_URI &&
  process.env.MONGO_DATABASE_NAME &&
  process.env.MONGO_COLLECTION_NAME
) {
  storage = mongoStorage = new MongoDbStorage(
    process.env.MONGO_URI,
    process.env.MONGO_DATABASE_NAME,
    process.env.MONGO_COLLECTION_NAME
  );
}


const adapter = new WebAdapter();
const controller = new Botkit({
    webhook_uri: '/api/messages',
    adapter: adapter,
    storage
});

if (process.env.CMS_URI && process.env.CMS_TOKEN) {
    controller.usePlugin(new BotkitCMSHelper({
        uri: process.env.CMS_URI,
        token: process.env.CMS_TOKEN,
    }));
}

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {

    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + '/features');

    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {
        controller.on('message,direct_message', async (bot, message) => {
            let results = false;
            results = await controller.plugins.cms.testTrigger(bot, message);

            if (results !== false) {
                // do not continue middleware!
                return false;
            }
        });
    }

});

