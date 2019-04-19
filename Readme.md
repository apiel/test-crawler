# test-crawler

test-crawler is a tool to help you to make end to end testing, by crawling a website and making some snapshot comparison. Right now, it is mainly focus on visual regression testing but it will most likely support html comparison in the future.

![screenshot-pages](https://github.com/apiel/test-crawler/blob/master/screenshots/screenshot-pages.jpeg?raw=true)

----
Doc to be deprecated

## getting started

```
git clone https://github.com/apiel/test-crawler.git
cd test-crawler

npx lerna bootstrap

yarn start
```

Go to http://localhost:3000/

Then enter the url you want to make screenshots and click start. It will crawl the url and use all the link found in the pages.

![screenshot-start](https://github.com/apiel/test-crawler/blob/master/screenshots/screenshot-new.jpeg?raw=true)

## run in dev environment

```
# in root folder
npx lerna bootstrap

# go server folder
cd packages/server
yarn start:dev

# go in react app folder
cd packages/app
yarn start

# go in crawler folder (crawler doesn't have auto reload)
cd packages/crawler
yarn start

# eventually start the example website to crawl
cd packages/example
yarn start
```


----

New doc should be something like

## Getting started

```bash
yarn add test-crawler
test-crawler
```

## Cli

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
