Move all this in github issues

- Need to make doc
- live update of crawler pages using Graphql stream

- viewport selectable
- options of urls from an enpoint instead of spider crawling
- crawl from specific urls set
    - ~~use endpoint~~
    - Storybook URLs generator

- way to inject custom script in page while crawling
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
