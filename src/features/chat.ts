/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as  path from 'path';
import { Botkit } from 'botkit';

module.exports = function(controller: Botkit) {

    // make public/index.html available as localhost/index.html
    // by making the /public folder a static/public asset
    controller.publicFolder('/', path.join(__dirname,'../../','public'));

    console.log('Chat with me: http://localhost:' + (process.env.PORT || 3000));
}