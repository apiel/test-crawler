import React from 'react';
import Button from 'antd/lib/button';
import { Link } from 'react-router-dom';
import Typography from 'antd/lib/typography';
import Icon from 'antd/lib/icon';

import { useThisDoc } from '../doc/useDoc';
import { Info } from '../common/Info';
import { MAX_AGE } from '../auth/githubCookie';

export const UiTest = () => {
    useThisDoc(Doc);
    return (
        <>
            <Typography.Title level={3}>UI test</Typography.Title>
            <p>
                UI testing will give you the possibility to generate some scenario for a specific page.
                E2E testing can be very complicated, especially when it come to handle user interaction.
                Unlike other testing framework using some selector, test-crawler UI testing is using image 
                recognition. For example, with Puppeteer you would do something like <Typography.Text code>
                await page.waitForSelector('button:contains("Save")')</Typography.Text> with test-crawler 
                UI testing, you just ask to wait for <button>Save</button>.
            </p>
        </>
    );
}

const Doc = () => (
    <>
        <p>
            TBD.
        </p>
    </>
);
