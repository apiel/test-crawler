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