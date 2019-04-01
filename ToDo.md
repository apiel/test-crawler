Move all this in github issues

- Need to make doc
- live update of crawler pages using Graphql stream

- viewport selectable
- options of urls from an enpoint instead of spider crawling
- way to run custom script on crawl per page
- ignore some zone

- spider crawling with a limit of child path: (eg: limit 2)
    /     (found: a, b, c, d)
    /a    (found: 1, 2, 3, 4, 5)
    /a/1
    /a/2
    no /a/3
    /b    (found: 1, 2, 3)
    /b/1
    /b/2
