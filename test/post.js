let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index')

//Assertion styles
chai.should();

chai.use(chaiHttp);

describe('Testing all buzz APIs', ()=> {
    //Test Get routes
    describe("GET /api/posts", ()=>{
        it("it should return all the posts", (done) => {
            chai.request(server)
                .get("/api/posts")
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eq(7);
                done();
                })
        });

        it("it should not return all the posts", (done) => {
            chai.request(server)
                .get("/api/post")     //not correct URI
                .end((err, res)=>{
                    res.should.have.status(404);
                done();
                })
        })
    });

    //Test Get (By Id) route
    describe("GET /api/posts/:id", ()=>{
        it("it should return the post by id", (done) => {
            const postId = 1;
            chai.request(server)
                .get("/api/posts/" + postId)
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('postData');
                    res.body.should.have.property('Category');
                    res.body.should.have.property('createdAt');
                    res.body.should.have.property('id').eq(1);
                done();
                });
        });

        it("it should not return the post by id", (done) => {
            const postId = 123;
            chai.request(server)
                .get("/api/posts/" + postId)
                .end((err, res)=>{
                    res.should.have.status(404);
                    res.text.should.be.eq("Post Doesn't exits with provided ID")
                done();
                });
        });
    });

    //Test post route
    describe("POST /api/posts/", ()=>{
        it("it should ADD a new Post", (done) => {
            const post = {
                postData: "Post 8",
                Category: "IT",
                createdAt: Date.now(),
            }
            chai.request(server)
                .post("/api/posts")
                .send(post)
                .end((err, res)=>{
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eq(8); 
                    res.body.should.have.property('postData').eq("Post 8");
                    res.body.should.have.property('Category').eq("IT");
                done();
                });
        });

        it("it should not ADD a new Post without post data", (done) => {
            const post = {
                Category: "IT",
                createdAt: Date.now(),
            }
            chai.request(server)
                .post("/api/posts")
                .send(post)
                .end((err, res)=>{
                    res.should.have.status(400);
                    res.text.should.be.eq("Failed Validation")
                done();
                });
        });
    });

    //test put route
    describe("PUT /api/posts/:id", ()=>{
        it("it should Update a Post", (done) => {
            const taskId = 1;
            const post = {
                postData: "Post 1 changes",
                Category: "HR",
                createdAt: Date.now(),
            }
            chai.request(server)
                .put("/api/posts/" + taskId)
                .send(post)
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eq(1); 
                    res.body.should.have.property('postData').eq("Post 1 changes");
                    res.body.should.have.property('Category').eq("HR");
                done();
                });
        });

        it("it should not Update a Post wihout post data", (done) => {
            const taskId = 1;
            const post = {
                Category: "HR",
                createdAt: Date.now(),
            }
            chai.request(server)
                .put("/api/posts/" + taskId)
                .send(post)
                .end((err, res)=>{
                    res.should.have.status(400);
                    res.text.should.be.eq("Failed Validation")
                done();
                });
        });
    });

    //test patch route
    describe("PATCH /api/posts/:id", ()=>{
        it("it should patch exiting Post", (done) => {
            const taskId = 1;
            const post = {
                postData: "Post 1 changes",
                Category: "HR",
            }
            chai.request(server)
                .patch("/api/posts/" + taskId)
                .send(post)
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eq(1); 
                    res.body.should.have.property('postData').eq("Post 1 changes");
                    res.body.should.have.property('Category').eq("HR");
                done();
                });
        });

        it("it should not Update a Post without postData", (done) => {
            const taskId = 1;
            const post = {
                Category: "HR",
                createdAt: Date.now(),
            }
            chai.request(server)
                .patch("/api/posts/" + taskId)
                .send(post)
                .end((err, res)=>{
                    res.should.have.status(400);
                    res.text.should.be.eq("Failed Validation")
                done();
                });
        });
    });

    //test delete route
    describe("DELETE /api/posts/:id", ()=>{
        it("it should DELETE exiting Post", (done) => {
            const taskId = 1;
            chai.request(server)
                .delete("/api/posts/" + taskId)
                .end((err, res)=>{
                    res.should.have.status(200);
                done();
                });
        });
        it("it should not DELETE a Post that is not in the database", (done) => {
            const taskId = 112;
            chai.request(server)
                .delete("/api/posts/" + taskId)
                .end((err, res)=>{
                    res.should.have.status(404);
                    res.text.should.be.eq("Post Doesn't exits with provided ID")
                done();
                });
        });
    });

})