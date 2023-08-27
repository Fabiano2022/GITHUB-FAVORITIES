export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json()) //transformo os dados em json
        .then(({ login,name,public_repos,followers }) => ({
            login,
            name,
            public_repos,
            followers
        }))
}
}