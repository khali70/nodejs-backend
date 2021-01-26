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

---

## at `/:commentId`

### get

- Comments.findById(req.params.`commentId`)
- res.json(`comment`)

### put

> user logged in

- find comment
- if comment.`auther` is req.`user`.\_id
- req.body with the `user _id added`
- `findByIdAndUpdate`(commentId) => `req.body`
- res.json(`comment`)

### post

> user logedin

- **403**=> forbiden

### delete

> user logedin

- find comment
- comment.user is user
- delete comment
- res.josn(resp)

---

---
