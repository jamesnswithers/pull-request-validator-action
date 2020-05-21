# Pull Request Validator GitHub Action

This is a [Github Action](https://github.com/features/actions) that can validate the title of a pull request.
It can be used to block merges targeting protected branches when the Pull Request title does not match a required format.

```
name: Pull Request Validation Workflow
 
 on:
   pull_request:
     branches:
       - master
     types: ['opened', 'edited', 'reopened', 'synchronize']
 
 jobs:
   pull_request_validator:
     runs-on: ubuntu-latest
     steps:
       - uses: jamesnswithers/pull-request-validator-action@master
         with:
           github-token: ${{ secrets.GITHUB_TOKEN }}
```

Configuration file named pull-request-validator-config.yaml placed in the default branch.
```
checks:
  title-validator:
    matches:
      - ^bug-.*
      - ^enhancement-.*
    failure-message: |2
      Pull Request Validation Failed. The pull request title should follow the below case-sensitive patterns
      * `bug-An optional small summary title`
      * `enhancement-An optional small summary title`
      * `Revert "bug-An optional small summary title"`
      * `Revert "enhancement-An optional small summary title"`
```