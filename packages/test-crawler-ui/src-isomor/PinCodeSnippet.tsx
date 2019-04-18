import React from 'react';
import Menu from 'antd/lib/menu';

export const codeSnippet = (setCode: any) => (
    <Menu>
        <Menu.Item
            key="1"
            onClick={() => {
                setCode(
`module.exports = async function run(page) {
    await page.evaluate(() => {
        const div = document.createElement("div");
        div.innerHTML = "Test-crawler is awesome!";
        document.body.insertBefore(div, document.body.firstChild);
    });
}`
                );
            }}
        >
            Test-crawler is awesome
        </Menu.Item>
        <Menu.Item key="2">Storybook</Menu.Item>
    </Menu>
);