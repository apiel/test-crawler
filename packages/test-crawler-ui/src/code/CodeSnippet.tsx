import React from 'react';
import Menu from 'antd/lib/menu';

export const codeSnippet = (setCode: (source: string) => void) => (
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
        <Menu.Item
            key="2"
            onClick={() => {
                setCode(
`module.exports = async function run(page, url, links) {
    return await page.evaluate((_links) => {
        return _links.map(
            link => link.replace('/?', '/iframe.html?')
        );
    }, links);
}`
                );
            }}
        >
            Storybook
        </Menu.Item>
        <Menu.Item
            key="22"
            onClick={() => {
                setCode(
`module.exports = async function run(page) {
    return await page.evaluate(() => {
        return Array.from(document.links).map(
            link => link.href.replace('/?', '/iframe.html?')
        );
    });
}`
                );
            }}
        >
            Storybook2
        </Menu.Item>
        <Menu.Item
            key="3"
            onClick={() => {
                setCode(
`// expect library from jest is installed by default
// but you can use any assertion tool of your choice
// just install it and use it here :D
const expect = require('expect');

module.exports = async function run(page) {
  await expect(page.title()).resolves.toMatch('React App');
  expect('a').toBe('b'); // fail
}`
                );
            }}
        >
            Expect assetion example
        </Menu.Item>
    </Menu>
);