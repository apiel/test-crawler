- doc doc doc
    - diff images different height

- run in isolation, (docker? ....)


- show crawling error?


- improve test-crawler bash > maybe switch to JS

- output crawler in a log file instead of nothing, then we can `tail -f` with `run-screen`
    - find a way to get output
    - give a way to run crawler from ui ? no need?

- code preview
- pins: filter by url, viewport...


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