- - export * from './Image';

- inject code base on url pattern
    - update doc
    - display related pins base on pattern
    - (code history?)

- code preview
    - code preview till specific line

- use html diff to improve visual comparison. automatically remove elements that changed and make screenshot, isolate element that change and make screenshot of them.
    - if we have possibility to reuse original page, with all CSS and so on -> then we can remove element as well on original page, so we can know from with height position page changed

- when limit selected, allow random page (shuffle, if limit is 2 instead to always pick up the first 2 pages, pick randomly eg. page 10 and page 22)
    - or maybe do something with code injection
    -> extract urls from beginning and pass them to code injection

- use single input for search and filtering
        https://2x.ant.design/components/select/#components-select-demo-select-users

- Url to crawl base on pattern

- when page was automatically pined, show info

- page detail

- plugin system

- think about AI!! random click?


toggle on/off `runProcess` from settings, set timeout from settings...
```tsx
if (runProcess) {
    exec(`PROCESS_TIMEOUT=60 test-crawler-cli 2> ${this.getLogFile()} &`);
}
```

- ctrl-s save code https://www.npmjs.com/package/react-hotkeys

- ~~improve test-crawler bash > maybe switch to JS~~




- diff images with different height algorithm

- HTML diff -> uglify HTML + linux diff (or diff lib)

- SSR version for react components?

- serverLess version using only github and travis (when loading the ui, github credential would be asked to get the a github token, then data would be saved by pushing commit to github)

### Test-crawler-input

- (form) input random value in field, submit and save result. Do this several time with different values, and saves everything. Re-do with the same value and check if there is the same result. If result change, trigger warning...
    - might give the possibility to reconize filed type
        - email
        - numeric
        - password
        - ...

### Test-crawler-search

- search input test, enter random text... save result, compare... but for generating the search might use the data in the result...
    - actually easier than form testing