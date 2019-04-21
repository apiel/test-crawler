# test-crawler

test-crawler is a tool for end to end testing, by crawling a website and making some snapshot comparison. Right now, it is mainly focus on visual regression testing but it will most likely support html comparison in the future.

![screenshot-pages](https://github.com/apiel/test-crawler/blob/master/screenshots/screenshot-pages.jpeg?raw=true)

## Getting started

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

## Cli

You can also run some test directly from the cli. This can be useful for continuous integration test.

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
