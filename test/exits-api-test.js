process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Exits API', () => {
	describe('GET /exits', () => {
		it('should return all items', () => {
			chai.request(server)
				.get('/api/exits')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.above(0);
				});
		});
	});

	describe('GET /exits/active', () => {
		it('should return active items', () => {
			chai.request(server)
				.get('/api/exits/active')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.every(i => i.isDisabled.should.equal(false));
				});
		});
	});

	describe('PUT /exits/:id/:isActive', () => {
		it('should update item', () => {
			chai.request(server)
				.put('/api/exits/1/true')
				.end((err, res) => {
					res.should.have.status(200);
				});
		});
	});
});