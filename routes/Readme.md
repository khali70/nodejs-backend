# sections

- [sections](#sections)
- [comments route](#comments-route)
- [dishes route](#dishes-route)
- [fav route](#fav-route)
- [feedback route](#feedback-route)
- [promo route](#promo-route)
- [leadre route](#leadre-route)
- [cors](#cors)
- [uploadRoute](#uploadroute)
- [users](#users)
- [index.js](#indexjs)

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

## at `/` <!-- omit in toc -->

### get <!-- omit in toc -->

- get `req.query`
- populate `auther`
- res.json(comments)

### put <!-- omit in toc -->

> user logged in

- create `req.body`
- `findbyId(commnt._id)`
- return `req.json(comment)`

### post <!-- omit in toc -->

> user logged in

```js
res.end("PUT operation not supported on /comments/");
```

### delete <!-- omit in toc -->

> - user logged in
> - user is admin

- remove all
- res.json(res from remove all)

---

## at `/:commentId` <!-- omit in toc -->

### get <!-- omit in toc -->

- Comments.findById(req.params.`commentId`)
- res.json(`comment`)

### put <!-- omit in toc -->

> user logged in

- find comment
- if comment.`auther` is req.`user`.\_id
- req.body with the `user _id added`
- `findByIdAndUpdate`(commentId) => `req.body`
- res.json(`comment`)

### post <!-- omit in toc -->

> user logedin

- **403**=> forbiden

### delete <!-- omit in toc -->

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

## at `/` <!-- omit in toc -->

### get <!-- omit in toc -->

- `find(req.query)` => by default {} but add the option for the client to narrow it down
- req.json(`dishes`)

### put <!-- omit in toc -->

> - veirfyUser logedin
> - verifyAdmin

- [ ] vlidate the req.body data
- create(req.body)

### post <!-- omit in toc -->

> veirfyUser is loggedin

- 403 => forbidden

### delete <!-- omit in toc -->

> - veirfyUser is loggedin
> - verifyAdmin

- remove all dishes
- res.json(resp);

## at `/:dishId` <!-- omit in toc -->

### get <!-- omit in toc -->

- findById(req.params.dishId)
- res.json(dish);

### put <!-- omit in toc -->

> - veirfyUser is loggedin
> - verifyAdmin

- findByIdAndUpdate(dishId)
- res.json(dish)

### post <!-- omit in toc -->

> veirfyUser is logged in

- 403 => forbidden

### delete <!-- omit in toc -->

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

# fav route

still not finished yet so there's now schema

## at `/` <!-- omit in toc -->

### get <!-- omit in toc -->

> veirfyUser is logged in

- findOut(user.\_id)
- res.json(fav)

### put <!-- omit in toc -->

> veirfyUser

- res.statusCode = 403

### post <!-- omit in toc -->

> veirfyUser

- findOne({userid:user.\_id})
- no favoritse at all
  - create({userid:user.\_id,dishes:req.body.dishes})
  - res.json(fav);
- [there's favorets](#there's_favorets)
- loop all the dishes
- add none added one form the body
- save to the db
- `res.json(fav)`

#### there's favorets <!-- omit in toc -->

loop all the dishes in the req add none added one

```js
req.body.forEach((dishid) => {
  if (fav.dishes.indexOf(dishid) < 0) fav.dishes.push(dishid);
});
```

```js
/**
 * save to the db
 */
fav.save().then((fav) => {
  // find the dish
  Favorite.findById(fav._id)
    .populate("userid")
    .populate("dishes")
    .then((fav) => {
      if (fav == null) {
        let err = new Error("adding the dish falied");
        err.status = 404;
        throw err;
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(fav);
      }
    });
});
```

### delete <!-- omit in toc -->

> veirfyUser

- deleteMany({userid:req.user.\_id})
- res.json(fav);

---

---

# feedback route

## at `/` <!-- omit in toc -->

### post <!-- omit in toc -->

```js

* const feedback = {...req.body,userId:_id,firstname,lastname}

* create(feedback)

* res.json(feedback);
```

---

---

# promo route

- [ ] get promo schema

## at `/` <!-- omit in toc -->

### get <!-- omit in toc -->

- find(req.query)=> by default { } as all but user can narrow it down
- res.json(promo`s`);

### put <!-- omit in toc -->

> veirfyUser

- 403 => fobridden

### post <!-- omit in toc -->

> veirfyUser

- create(req.body)
- res.json(promo);

### delete <!-- omit in toc -->

> veirfyUser

- remove({})
- res.json(resp);

---

## at `/:promoId` <!-- omit in toc -->

### get <!-- omit in toc -->

- findById(promoId)
- res.json(promo)

### put <!-- omit in toc -->

> veirfyUser

- updatewith(req.body)
- res.json(promo);

### post <!-- omit in toc -->

> veirfyUser

- 403

### delete <!-- omit in toc -->

> veirfyUser

- findByIdAndRemove(promoId)
- res.json(promo);

---

---

# leadre route

- [ ] get leaders schema

## at `/` <!-- omit in toc -->

### get <!-- omit in toc -->

- find(req.query)
- res.json(leaders)

### put <!-- omit in toc -->

> veirfyUser

- 403

### post <!-- omit in toc -->

> veirfyUser

- create(req.body)
- json(leader)

### delete <!-- omit in toc -->

> veirfyUser

- remove({})

---

## at `/:leadreId` <!-- omit in toc -->

### get <!-- omit in toc -->

- findById(req.params.leaderId)
- res.json(leader)

### put <!-- omit in toc -->

> veirfyUser

- 403

### post <!-- omit in toc -->

> veirfyUser

- update(req.body)
- res.json(leader)

### delete <!-- omit in toc -->

> veirfyUser

- findByIdAndRemove(req.params.leaderId)
- res.json(leader)

---

---

# cors

it's short for `Cros-Origin Resource Sharing`

to add options we can use

```js
var corsOptions = {
  origin: "http://example.com",
  optionsSuccessStatus: 200, // some legacy browsers
};
// or for dynamic
const whitelist = ["http://example1.com", "http://example2.com"];
const filterOrigin = (origin, callback) => {
  if (whitelist.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
};
var corsOptions = {
  origin: filterOrigin,
};
```

for more see the [doc](https://www.npmjs.com/package/cors) from npm about [cors](https://www.npmjs.com/package/cors)

# uploadRoute

# users

# index.js
