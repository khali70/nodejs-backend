# comments route

comment schema

```json
{
  "_id": "5f4e430ceec20757258bd68b",
  "rating": 5,
  "comment": "Imagine all the eatables, living in conFusion!",
  "author": "John Lemon",
  "dishId": "5f4e430ceec20757258bd68a",
  "createdAt": "2020-09-01T12:48:12.311Z",
  "updatedAt": "2020-09-01T12:48:12.311Z"
}
```

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

# dishes route

dish schema

```json
{
  "label": "Hot",
  "featured": true,
  "_id": "5f4e430ceec20757258bd68a",
  "name": "Uthappizza",
  "image": "images/uthappizza.png",
  "category": "mains",
  "price": 4.99,
  "description": "A unique combination of Indian Uthappamalia onion, Guntur chillies and Buffalo Paneer.",
  "createdAt": "2020-09-01T12:48:12.312Z",
  "updatedAt": "2020-09-01T12:48:12.312Z",
  "__v": 0
}
```

## at `/`

### get

- `find(req.query)` => by default {} but add the option for the client to narrow it down
- req.json(`dishes`)

### put

> - veirfyUser logedin
> - verifyAdmin

- [ ] vlidate the req.body data
- create(req.body)

### post

> veirfyUser is loggedin

- 403 => forbidden

### delete

> - veirfyUser is loggedin
> - verifyAdmin

- remove all dishes
- res.json(resp);

## `/:dishId`

### get

- findById(req.params.dishId)
- res.json(dish);

### put

> - veirfyUser is loggedin
> - verifyAdmin

- findByIdAndUpdate(dishId)
- res.json(dish)

### post

> veirfyUser is logged in

- 403 => forbidden

### delete

> - veirfyUser is loggedin
> - verifyAdmin

- findByIdAndRemove(dishId)
- res.json(res || dish); => i don't remmeber wich return from remove
- [ ] what is the res from findByIdAndRemove(dishId)

```js
Dishes.findByIdAndRemove(req.params.dishId).then((dish) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json(dish);
});
```
