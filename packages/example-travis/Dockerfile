FROM node:current
RUN cd /home/node && git clone https://github.com/apiel/test-crawler.git
WORKDIR /home/node/test-crawler/packages/example-travis
RUN yarn
RUN (yarn start 2> yarn.start.log &) \
    && sleep 5 \
    && cat yarn.start.log \
    && yarn test:crawler:cli