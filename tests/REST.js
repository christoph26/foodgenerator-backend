var supertest = require("supertest");
var expect = require('expect');
var assert = require('assert');

var SERVER_CONFIG = require("../config/config.js");

var api = supertest.agent("http://localhost:" + SERVER_CONFIG.app.port);


describe("basic rest operations tests",function(){


    it("should return a list of movies when calling get",function(done){

        //get
        api
            .get('/api/movies')
            .send()
            .expect("Content-type",/json/)
            .expect(200)
            .end(function(err,res){

                var data = JSON.parse(res.text);
                expect(data.length > 0).toBeTruthy();
                expect(data.some(function(m){ return (!!m.title && !!m.year) })).toBeTruthy();

                done();
            });
    });

    it("create a new movies when calling post",function(done){

        var randomTitle = Math.random().toString(36).substring(5) + "";
        var randomYear = 2000;


        //get
        api
            .post('/api/movies')
            .send({Movie:{ title: randomTitle, year: randomYear}})
            .expect(201)
            .end(function(err,res){

                var postRetRec = JSON.parse(res.text);

                assert.equal(postRetRec.title, randomTitle);
                assert.equal(postRetRec.year, randomYear);



                return api
                    .get('/api/movies/' + postRetRec._id)
                    .send()
                    .expect(200)
                    .end(function(err, res){
                        var jsonRes = JSON.parse(res.text);

                        for (i in Object.keys(jsonRes)) {
                            assert.equal(jsonRes[i], postRetRec[i]);
                        }
                        done();
                    });
            })

    });

});