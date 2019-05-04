import React from 'react';
import Typography from 'antd/lib/typography';

import { Info } from '../common/Info';

const { Paragraph, Text } = Typography;

export const PinCodeInfo = () => (
    <Info>
        <Paragraph>
            Inject some code in the crawler while parsing the page. This code will
            be executed just after the page finish loaded, before to make the screenshot and
            before extracting the links. You need to export a function that will take as
                                first parameter the <Text code>page</Text> coming from Puppeteer.
                            </Paragraph>
        <Paragraph>
            <Text code>module.exports = async (page) => ...some code</Text>
        </Paragraph>
    </Info>
);
