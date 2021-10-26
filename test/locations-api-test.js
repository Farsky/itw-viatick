process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Locations API', () => {
    describe('GET /locations', () => {
        it('should return all items', () => {
            chai.request(server)
                .get('/api/locations')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.above(0);
                });
        });
    });

    describe('GET /locations/active', () => {
        it('should return active items', () => {
            chai.request(server)
                .get('/api/locations/active')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.every(i => i.isOnFire.should.equal(false));
                });
        });
    });

    describe('POST /locations', () => {
        it('should create item', () => {
            chai.request(server)
                .post('/api/locations')
                .send({
                    locationId: 'Test01',
                })
                .end((err, res) => {
                    // Remove inserted item
                    chai.request(server)
                        .delete('/api/locations/Test01')
                        .end((err, res) => {
                            res.should.have.status(200);
                        });
                });
        });
    });

    describe('PUT /locations/:id/:isOnFire', () => {
        it('should update item', () => {
            chai.request(server)
                .put('/api/locations/5f9ac59cdc2bb20e9b000058/false')
                .end((err, res) => {
                    res.should.have.status(200);
                });
        });
    });

    describe('DELETE /locations/:id', () => {
        it('should delete item', () => {
            chai.request(server)
                .post('/api/locations')
                .send({
                    locationId: 'Test02',
                })
                .end((err, res) => {
                    chai.request(server)
                        .delete('/api/locations/Test02')
                        .end((err, res) => {
                            res.should.have.status(200);
                        });
                });
        });
    });
});