# test-crawler

test-crawler is a tool to help you to make end to end testing, by crawling a website and making some snapshot comparison. Right now, it is mainly focus on visual regression testing but it will most likely support html comparison in the future.

## getting started

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
