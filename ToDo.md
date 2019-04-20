- viewport > mobile , rerun, different ID in crawler
- need to generate folder if dont exist -> use outputJson and outputFile everywhere

- FIX if different image height, diff is not working!!! Need to fix that
- improve test-crawler bash

- show data folder path somewhere in ui
- output crawler in a log file instead of nothing, then we can `tail -f` with `run-screen`
- give a way to run crawler from ui

- code preview
- pins: filter by url, viewport...

- spider crawling with a limit of child path: (eg: limit 2)
    /     (found: a, b, c, d)
    /a    (found: 1, 2, 3, 4, 5)
    /a/1
    /a/2
    no /a/3
    /b    (found: 1, 2, 3)
    /b/1
    /b/2



- HTML diff -> uglify HTML + linux diff (or diff lib)

- SSR version for react components?

- serverLess version using only github and travis (when loading the ui, github credential would be asked to get the a github token, then data would be saved by pushing commit to github)