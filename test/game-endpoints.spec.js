const { expect } = require('chai')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Game Endpoints', function () {
    let db

    const testUsers = helpers.makeUsersArray()
    const [testUser] = testUsers
    const testGameState = helpers.makeGameStateArray()

    before('make knex instance', () => {
        db = helpers.makeKnexInstance()
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))
    /**
     * @description Get game state
     **/
    describe(`GET /api/game/gamestate/:id`, () => {
        const [gameState] = testGameState

        beforeEach('insert users and stats', () => {
            return helpers.seedUsersGameState(
                db,
                testUsers,
                testGameState,
            )
        })

        it(`responds with 200 and game state`, () => {
            return supertest(app)
                .get(`/api/game/gamestate/1`)
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .expect(200)
                .expect({
                    // data is not deconstructed so expect entire object
                    gameState

                    //if deconstructed this is desired data
                    // id: gameState.id,
                    // p1_board: gameState.p1_board,
                    // p2_board: gameState.p2_board,
                    // p1_health: gameState.p1_health,
                    // p2_health: gameState.p2_health,
                    // player_turn: gameState.player_turn,
                    // active_game: gameState.active_game
                })
        })
    })


    /**
     * @description Submit a new guess for the language
     **/
    describe(`PATCH /api/game/gamestate/1`, () => {
        beforeEach('insert users and stats', () => {
            return helpers.seedUsersGameState(
                db,
                testUsers,
                testGameState,
            )
        })

        it(`responds with 200 and the updated data`, () => {
            const [gameState] = testGameState
            gameState.player_turn = false
            gameState.active_game = true
            gameState.p2_board[1][1] = 9

            const body = {
                x: 1,
                y: 1,
            }
            
            return supertest(app)
                .patch('/api/game/gamestate/1')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(body)
                .expect(200, {
                    gameState
                })
        })

    })

    describe(`POST /api/game/newgame`, () => {
        beforeEach('insert users and stats', () => {
            return helpers.seedUsersGameState(
                db,
                testUsers,
                testGameState,
            )
        })

        it(`responds with 200 and returns gameState with new ID`, () => {
            //AI BOARD WILL NEVER BE THE SAME
            return supertest(app)
                .post('/api/game/newgame')
                .set('Authorization', helpers.makeAuthHeader(testUser))
                .send(testGameState[0])
                .expect(200)
                .expect(res => {
                    expect(res.body.gameState).to.be.an('object')
                    expect(res.body.gameState).to.not.be.empty
                    expect(res.body.gameState).to.have.property('id', 2).to.be.a('number')
                    expect(res.body.gameState).to.have.property('p1_board').to.be.an('array')
                    expect(res.body.gameState).to.have.property('p2_board').to.be.an('array')
                    expect(res.body.gameState).to.have.property('p1_health').to.be.an('array')
                    expect(res.body.gameState).to.have.property('p2_health').to.be.an('array')
                    expect(res.body.gameState).to.have.property('player_turn').to.be.a('boolean')
                    expect(res.body.gameState).to.have.property('active_game').to.be.a('boolean')
                })
        })
    })

    describe(`PATCH /api/game/aimove/1`, () => {
        beforeEach('insert users and stats', () => {
            return helpers.seedUsersGameState(
                db,
                testUsers,
                testGameState,
            )
        })

        it(`responds with 200 and returns gamestate`, () => {
            return supertest(app)
            .post('/api/game/newgame')
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .send(testGameState[0])
            .expect(200)
            .expect(res => {
                expect(res.body.gameState).to.be.an('object')
                expect(res.body.gameState).to.not.be.empty
                expect(res.body.gameState).to.have.property('id', 2).to.be.a('number')
                expect(res.body.gameState).to.have.property('p1_board').to.be.an('array')
                expect(res.body.gameState).to.have.property('p2_board').to.be.an('array')
                expect(res.body.gameState).to.have.property('p1_health').to.be.an('array')
                expect(res.body.gameState).to.have.property('p2_health').to.be.an('array')
                expect(res.body.gameState).to.have.property('player_turn').to.be.a('boolean')
                expect(res.body.gameState).to.have.property('active_game').to.be.a('boolean')
            })
        })

    })
})
