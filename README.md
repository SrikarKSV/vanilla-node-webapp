# Anonymous Confessions - A CRUD website written in vanilla NodeJS

The goals of the project:

- Understand how expressjs works under the hood
- Connect the small pieces that expressjs takes care of
- Imitate the functionality that some useful middlewares takes care of
- Study the source code of these middlewares to imitate their functionality

**NOT** the goals of the project:

- To create the entire functionality of expressjs
- To create every functionality from scratch
- To not use a single external package

## Todos:

- [x] Make a logger
- [x] Use pug and render error.stack if error or the html
- [x] Write error control, use EventEmitter
- [x] Learn to use headers to redirect users
- [x] Landing page which will have 5 most popular confessions in last 24 hours (Usage of aggregations)
- [x] Confession should be accompanied by title, date and beginning of confession
- [ ] Use javascript to give flashes
- [x] Confessions page with pagination
- [ ] Try authentication for moderator to delete or edit the confession
- [ ] Make two userW roles for staff - moderator and admin
- [ ] Only admin can make new staff accounts
- [ ] Moderator can mark and edit confessions but not delete
- [ ] Admin can view the marked confessions and delete them
- [ ] Profile page for staff with titles they edited and marked
