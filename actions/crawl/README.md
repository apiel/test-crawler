# apiel/test-crawler/actions/crawl

A Github action to push result found from test-crawler.

```
name: Example workflow
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Run test-crawler
      uses: apiel/test-crawler/actions/crawl@master
      with:
        projectId: your_project_id
    - name: Commit changes
      uses: apiel/test-crawler/actions/push@master
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
```