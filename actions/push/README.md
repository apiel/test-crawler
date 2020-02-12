# apiel/test-crawler/actions/run

A Github action to run test-crawler in your CI to generate snapshot comparison of your website.

```
name: Example workflow for test-crawler run
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Run test-crawler
      uses: apiel/test-crawler/actions/run@master
        with:
          projectId: your_project_id
    - name: Commit changes
      uses: apiel/test-crawler/actions/push@master
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
```