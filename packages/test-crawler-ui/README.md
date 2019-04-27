# test-crawler

**[>> Online documentation <<](https://apiel.github.io/test-crawler/)**

test-crawler is a tool for end to end testing, by crawling a website and making some snapshot comparison. Right now, it is mainly focus on visual regression testing but it will most likely support html comparison in the future.

![screenshot-pages](https://github.com/apiel/test-crawler/blob/master/screenshots/test-crawler.gif?raw=true)

## Getting started

> **Note:** you need to use the latest version of node, right now v11.10.1

```bash
yarn add test-crawler
npx test-crawler
```

Open url http://127.0.0.1:3005/
![screenshot-start](https://github.com/apiel/test-crawler/blob/master/screenshots/screenshot-new.png?raw=true)

There is two way to crawl pages:

- **Spider bot** crawling method will get all the links inside the page of the given URL
  and crawl the children. It will then continue do the same with the children till no new
  link is found. Be careful if you have big website, this is most likely not the right
  solution for you.

- **URLs list** crawling method will crawl a specific sets of URLs. In the URL input field
  you must provide an endpoint containing a list of URLs (a simple text format, with one URL
  per line). The crawler will crawl each of those URL only and will not try to find links in
  the page.

URLs list example:
```
http://127.0.0.1:3005/
http://127.0.0.1:3005/page1
http://127.0.0.1:3005/category/page33
```

> **Note:** to don't get false visual differences, you must run your test always on the same environment. Diffrent OS, different graphic card, ... might trigger visual differences in the snapshot, even if there was no changes. Prefer to always run your tests on the same machine.

## Pins

Pins are the references screenshot to make the comparison with. While crawling, the crawler is comparing page to pin. To create a pin go in the result page of your crawling result, each screenshot has some action buttons:

![screenshot-action-buttons](https://github.com/apiel/test-crawler/blob/master/screenshots/screenshot-action-btn.png?raw=true)

click on the button on the right with little pin icon.

You can then visualize all your pins:

![screenshot-pins](https://github.com/apiel/test-crawler/blob/master/screenshots/screenshot-pins.png?raw=true)

## Crawling result

![screenshot-diff](https://github.com/apiel/test-crawler/blob/master/screenshots/screenshot-diff.png?raw=true)

On the result page, you will see many screenshot with eventually some differences found. A difference is represented by a yellow rectangle. By clicking on the rectangle, popup 3 buttons giving you the possibility to report this difference (rectangle will became red) or validate this difference (rectangle will became green). You can as well validate this difference "for ever", then this area of the pages will always reconize this zone as valid place for changes.

> **Note:** comparing page that are growing is very difficult (different height). For the moment this result to weird behaviors when comparing 2 screenshots of different size. To avoid this, use the code injection to remove the dynamic part of the page. Hopefully in the future, we will find better algarithm to reconize such changes.

## Inject code

![screenshot-code](https://github.com/apiel/test-crawler/blob/master/screenshots/screenshot-code.png?raw=true)

Inject some code in the crawler while parsing the page. This code will be executed just after the page finish loaded, before to make the screenshot and before extracting the links.

This can be useful to remove some dynamic part from a page, for example some comments on a blog pages or some reviews on prodcut page. You could also inject code to simulate user behavior, like clicking or editing an input fields.

Test-crawler is using [Puppeteer](https://www.npmjs.com/package/puppeteer) to crawl the page and make the screenshot. By injecting the code, you can use all the functionnalities from Puppeteer.

To setup some code for a pin, click on the action button on the bottom right of a pin.

![screenshot-pin](https://github.com/apiel/test-crawler/blob/master/screenshots/screenshot-pin.png?raw=true)

In the editor, you need to export a function that will get as params the page currently opened by Puppeteer.

```js
module.exports = async function run(page) {
// your code
}
```

You can then use this `page` variable to manipulate the page. Following is an example that will insert "Test-crawler is awesome!" on the top of the page:

```js
module.exports = async function run(page) {
    await page.evaluate(() => {
        const div = document.createElement("div");
        div.innerHTML = "Test-crawler is awesome!";
        document.body.insertBefore(div, document.body.firstChild);
    });
}
```

## Storybook

You can use code injection to crawl storybooks. Say test-crawler to crawl your storybook url http://127.0.0.1:6006/ and then inject some code to extract the urls of the stories and transform them to there iframe version. The code should be something like that:

```js
module.exports = async function run(page) {
    await page.evaluate(() => {
        hrefs = Array.from(document.links).map(
            link => link.href.replace('/?', '/iframe.html?')
        );

        document.body.innerHTML = hrefs.map(
            href => `<a href="${href}">${href}</a>`
        ).join('<br />');
    });
}
```

You can find this code by clicking the button `Code snippet` of the code editor.

> **Note:** feel free to make some pull request to propose some new code snippet.

## Cli

You can run test directly from the cli. This can be useful for continuous integration test.

```bash
test-crawler-cli ./preset.json
```

Preset file should look like:

```json
{
    "crawlerInput": {
        "url": "http://localhost:3003/",
        "method": "spiderbot",
        "viewport": {
            "width": 800,
            "height": 600
        }
    }
}
```

## Continuous integration Travis

As mentioned before, to don't get false visual differences, you must run your test always on the same environment. Travis CI is a hosted, distributed continuous integration service, that would allow you
to run your visual regression test, with the same environment between each build. It is also easy
to integrate with your git repository like GitHub.

The workflow would be the following:
- changes are pushed to repository
- Travis detect new commit and trigger a build
- app is launched on the container
- Travis run test-crawler-cli to check for difference
- if difference, build fail and Travis push diff to the repository
- pull diff locally and run test-crawler to see the diff

`.travis.yml` example:
```yml
language: node_js

node_js:
  - 'node'

branches:
  only:
  - master

install:
  - git config --global user.email "build@travis-ci.com"
  - git config --global user.name "Travis CI"
  # we should be able to take this from env var
  - GH_REPO="github.com/your_user_name/the_repo.git"

script:
  - yarn
  - yarn start > /dev/null &
  - sleep 15 # wait that the server run
  - yarn test:crawler:cli

# only push change if found diff
after_failure:
  - git checkout ${TRAVIS_BRANCH}
  - git add -A .
  - git commit -m "travis commit, test-crawler [ci skip]" # [ci skip] to don't trigger another build
  - git status
  - git pull
  - git push "https://${GITHUB_TOKEN}@${GH_REPO}" ${TRAVIS_BRANCH} > /dev/null 2>&1 # should always escape output, for security issue, else token could be visible
```
To set GITHUB_TOKEN environment variable look at https://docs.travis-ci.com/user/deployment/pages/

in `package.json` add the following scripts:
```json
  "scripts": {
    "start": "...",
    "test:crawler": "PAGES_FOLDER=./test-crawler test-crawler",
    "test:crawler:cli": "PROCESS_TIMEOUT=10 PAGES_FOLDER=./test-crawler test-crawler-cli test-crawler.preset.json"
  }
```
> **Note:** For `test-crawler-cli` and preset, see previous section.
