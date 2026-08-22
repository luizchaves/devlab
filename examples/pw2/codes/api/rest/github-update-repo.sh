$ TOKEN=abc
$ curl -L \
   -X PATCH \
   -H "Accept: application/vnd.github+json" \
   -H "Authorization: Bearer ${TOKEN}" \
   -H "X-GitHub-Api-Version: 2022-11-28" \
   https://api.github.com/repos/luizchaves/github-repo-api \
   -d '{"name":"github-repo-api","description":"This is your first repo!","homepage":"https://github.com","private":false,"is_template":false}'
