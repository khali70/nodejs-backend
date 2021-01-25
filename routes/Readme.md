# comments route

## at `/`

### get

- get `req.query`
- populate `auther`
- res.json(comments)

### put

> user logged in

- create `req.body`
- `findbyId(commnt._id)`
- return `req.json(comment)`

### post

> user logged in

```js
res.end("PUT operation not supported on /comments/");
```

### delete

> - user logged in
> - user is admin

- remove all
- res.json(res from remove all)

## at `/:commentId`

### get

### put

### post

### delete
