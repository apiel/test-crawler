- remove pages from npm package

- switch Readme to README (use docsify ?)
- run in isolation, (docker? ....)

- handle errors
- should we `tail -f test-crawler-cli.log` with `run-screen` ?

toggle on/off `runProcess` from settings, set timeout from settings...
```tsx
if (runProcess) {
    exec(`PROCESS_TIMEOUT=60 test-crawler-cli 2> ${this.getLogFile()} &`);
}
```




- improve test-crawler bash > maybe switch to JS


- code preview
- pins: filter by url, viewport...
- plugin system


- settings page?
- need to generate folder if dont exist? maybe no need since using outputJSON instead to writeJSON...

- spider crawling with a limit of child path: (eg: limit 2)
    /     (found: a, b, c, d)
    /a    (found: 1, 2, 3, 4, 5)
    /a/1
    /a/2
    no /a/3
    /b    (found: 1, 2, 3)
    /b/1
    /b/2



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
- search input test, enter random text... save result, compare... but for generating the search might use the data in the result...
    - actually easier than form testing