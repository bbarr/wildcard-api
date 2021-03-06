!INLINE ./snippets/header.md --hide-source-path

!VAR COMPARISON How does RPC compare to GraphQL/REST?
!VAR MORE_POWER Which is more powerful, GraphQL or RPC?
!VAR TIGHT_COUPLING Doesn't RPC tightly couple frontend with backend?
!VAR SYNC_DEPLOY Should I deploy frontend and backend at the same time?
!VAR SYNC_DEV Should I develop frontend and backend hand-in-hand?
!VAR VERSIONING How can I do versioning with RPC?
!VAR STRUCTURE How should I structure my RPC endpoints?

&nbsp;

# RPC FAQ

!VAR|LINK COMPARISON
<br/>
!VAR|LINK MORE_POWER
<br/>
!VAR|LINK TIGHT_COUPLING
<br/>
!VAR|LINK SYNC_DEPLOY
<br/>
!VAR|LINK SYNC_DEV
<br/>
!VAR|LINK VERSIONING
<br/>
!VAR|LINK STRUCTURE

<br/>

### !VAR COMPARISON

Comparing RPC with REST/GraphQL is like comparing apples to oranges;
they have different goals.

With GraphQL/REST you create a *generic API*:
an API that aims to be able to fulfill a maximum number of data requirements;
enabling third party developers to build all kinds of applications on top of your data.
If your goal is to enable third party developers to access your data,
then you need a generic API and you'll have to use REST or GraphQL.

With RPC you create a *custom API*:
an API that fulfills the data requirements of your clients and your clients only.
If your goal is to retrieve and mutate data from your web and mobile clients,
then RPC offers a simpler and more powerful alternative.

We explain this in more depth at
[RPC vs REST/GraphQL](/docs/rpc-vs-rest-graphql.md#rpc-vs-restgraphql).

!INLINE ./snippets/section-footer.md #faq --hide-source-path



### !VAR MORE_POWER

Depends.

From the perspective of a third party,
GraphQL is more powerful.

From the perspective of your frontend development,
RPC is more powerful.

With Wildcard,
while developing your frontend,
everything the backend can do is only one JavaScript function away:

~~~js
// Your Node.js server

const {endpoints} = require('@wildcard-api/server');

endpoints.iHavePower = function() {
  // I can do everything the Node.js server can do
};
~~~
~~~js
// Your browser frontend

import {endpoints} from '@wildcard-api/client';

// The entire backend power is one JavaScript function away
endpoints.iHavePower();
~~~

The whole power of the backend is at your disposal while developing your frontend.
For example,
you can use any SQL/ORM you want to retrieve and mutate data.
That's more powerful than GraphQL.

The distinctive difference is that,
from the perspective of a third party,
your API is set in stone
whereas,
from the perspective of your frontend development,
you can modify your own API at will.

!INLINE ./snippets/section-footer.md #faq --hide-source-path



### !VAR TIGHT_COUPLING

Yes it does.
RPC indeed induces a tighter coupling between frontend and backend.
More precisely, RPC increases the need for synchronized frontend-backend deployements.

For example:

~~~js
// This API endpoint is tightly coupled to the frontend:
// it returns exactly and only what the landing page needs.
endpoints.getLandingPageData = async function() {
  const {user} = this;
  if( !user ){
    return {isNotLoggedIn: true};
  }
  const todos = await db.query('SELECT id, text FROM todos WHERE authorId = ${user.id};');
  return {user, todos};
};
~~~

If changes are made to the frontend that, for example, require the todo items' creation date,
then the SQL query of the `getLandingPageData` API endpoint needs to be changed from `SELECT id, text FROM` to `SELECT id, text, created_at FROM`.
This means that the API needs to be modified and re-deployed.

In general (and regardless whether you use RPC or REST/GraphQL),
it has nowadays become a best practice to
deploy backend and frontend at the same time,
which we talk about in the next querstion
!VAR|LINK SYNC_DEPLOY.

!INLINE ./snippets/section-footer.md #faq --hide-source-path



### !VAR SYNC_DEPLOY

Yes, we recommend synchronized deployements, that is to deploy frontend and backend at the same time.

If your backend is written with Node.js,
we recommend to put your frontend and backend code in the same repository.
(This technique is commonly called "monorepo". A monorepo is a repository that holds the codebase of many different components of a system, instead of having a multitude of repositories each holding the codebase of a single component.
Monorepos are increasingly popular; a monorepo makes it easier to perform changes across system components and removes the need to manage dependency between system components.)

A monorepo with synchronized frontend and backend deployment
is easy to acheive with Node.js.
For example with an Express server:

~~~js
// Node.js server
const express = require('express');
const server = express();

// We serve and deploy our frontend over our Node.js server:
server.use(express.static('/path/to/frontend/dist/'));
~~~

This ensures that frontend and backend are deployed synchronously.

!INLINE ./snippets/section-footer.md #faq --hide-source-path



### !VAR SYNC_DEV

You can, but you don't have to.

Although,
there are less and less engineers that only do frontend.
Most engineers that write browser-side JavaScript are also comfortable and eager
to write server-side JavaScript.
It makes sense to hire only Full-stack Engineers and develop frontend and backend hand-in-hand.

You can still have separation of concerns:
- Backend code that is tighly coupled to the frontend, which includes the API endpoints that run SQL/ORM queries on behalf of the frontend, is developed by the frontend team.
- The rest of the backend that is agnostic to the frontend is developed by the backend team.

The strict separation between browser-side code and server-side code makes less and less sense.
Most Frontend Engineers are nowadays Full-stack Engineers.
To a Full-stack Engineer, RPC is a boon:
it gives him the power to use any SQL/ORM query and any server-side tool he wants.

!INLINE ./snippets/section-footer.md #faq --hide-source-path



### !VAR VERSIONING

As explained in
!VAR|LINK SYNC_DEPLOY,
we recommend to deploy frontend and backend synchronously.
You then don't need
versioning: your backend always serves a single and the correct version of your API.

!INLINE ./snippets/section-footer.md #faq --hide-source-path



### !VAR STRUCTURE

RPC brings frontend and backend together in a seamless fashion.
RPC is agnostic to structure; how you structure your code is entirely up to you.

You may therefore ask yourself "How should I structure my endpoints?".

**The short answer**

Don't worry about it &mdash; you'll figure it out as you go.
(The structure of your code will be determined mostly by your business logic and only marginally by RPC.)

**The long answer**

For example, should one do this:

~~~js
// We have one generic mutation endpoint.
endpoints.updateTodo = async function({id, text, completed}) {
  const todo = await Todo.findOne({id});
  if( text!==undefined ) todo.text = text;
  if( completed!==undefined ) todo.completed = completed;
  await todo._save();
};
~~~

Or this:

~~~js
// We create a mutation endpoint for each action.
endpoints.updateTodoText = async function({id, text}) {
  await updateTodo({id, text});
};
endpoints.updateTodoCompleted = async function({id, completed}) {
  await updateTodo({id, completed});
};

async function updateTodo({id, text}) {
  const todo = await Todo.findOne({id});
  if( text!==undefined ) todo.text = text;
  if( completed!==undefined ) todo.completed = completed;
  await todo._save();
}
~~~

The answer is that it doesn't make a difference.
And that's the whole point:
your code structure will be determined more by your business logic and less by your RPC endpoints.

That said,
you can simply start to create
one endpoint per need:

~~~js
// We create endpoints for each page.

// Get data for https://example.com
endpoints.getLandingPageData = async function() {
  const todos = await Todo.find({userId: this.user.id, completed: false});

  return {
    user: {
      name: this.user.name,
    },
    todos,
  };
};
// Get data for https://example.com/account
endpoints.getUserAccountPageData = async function() {
  const {user} = this;
  return {
    user: {
      name: user.name,
      email: user.email,
      isPaidAccount: user.isPaidAccount,
      /* ... */
    }
  }
};

// We create endpoints for each user action:

endpoints.toggleTodoCompleted = async function(id) {
  const todo = Todo.findOne({id});
  todo.completed = !todo.completed;
  await todo._save();
};
endpoints.createNewTodo = async function (text) {
  const todo = new Todo({text});
  await todo._save();
  return todo.id;
};
endpoints.updateTodoText = async function({id, text}) {
  const todo = Todo.findOne({id});
  todo.text = text;
  await todo._save();
};
~~~

That is, each endpoint call will occur exactly once in the frontend code.

This works for most uses cases.
In doubt,
use your best judgement.

Bear in mind that, in general, it's best to create few structures and abstractions.
Too many structures are dangerously counter-productive.

To conclude,
how you strucutre your code has less to do with RPC and more to do with your business logic.
There are more crucial and interesting questions such as "How can I structure my code to isolate business logic in order to scale from 3 developers to 7 developers?".

!INLINE ./snippets/section-footer.md #faq --hide-source-path



