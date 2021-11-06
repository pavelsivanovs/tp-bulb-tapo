import * as tapo from 'tp-link-tapo-connect';
import chalk from 'chalk';

import { exit } from 'process';

export const changeColours = async () => {
    const EMAIL = process.env.TAPO_EMAIL;
    const PASSWORD = process.env.TAPO_PASSWORD;
    const IP_ADDRESS = process.env.TAPO_IP_ADDRESS;

    const error = chalk.bold.red;
    const success = chalk.bold.green;

    const cloudToken = await tapo.cloudLogin(EMAIL, PASSWORD).catch(
        err => {
            console.log(error('Could not retrieve the cloud token with this creds:'), EMAIL, PASSWORD);
            exit(1);
        }
    );
    
    const devices = await tapo.listDevicesByType(cloudToken, 'SMART.TAPOBULB').catch(
        err => {
            console.log(error('Could not retrieve the list of devices, exiting'), err);
            exit(1);
        } 
    );

    console.log(success('The device found:'), devices[0].alias);

    // const bulbToken = await tapo.loginDevice(EMAIL, PASSWORD, devices[0]);
    const bulbToken = await tapo.loginDeviceByIp(EMAIL, PASSWORD, IP_ADDRESS).catch(
        err => {
            console.log(error('Could not retrieve the bulb token, exiting'), err);
            exit(1);
        }
    );

    console.log('Changing bulb colour to random values!');
    console.log(chalk.grey('======================================='));

    while (true) {
        const colourHex = Math.floor(Math.random() * 16777215).toString(16);
        const colourHexPadded = ('000000' + colourHex).slice(-6);

        const colour = chalk.inverse.hex(colourHexPadded);

        tapo.setColour(bulbToken, '#' + colourHexPadded).then(
            () => console.log('Changed colour to', colour('#' + colourHexPadded))
        ).catch(e => {
            console.log(error('Could not change the colour to', colour('#' + colourHexPadded), e));
        });

        await new Promise(resolve => setTimeout(resolve, 500));
    }
};

export default changeColours;
