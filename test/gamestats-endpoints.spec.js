const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Game Stats Endpoints', function () {
  let db

  const testUsers = helpers.makeUsersArray()
  const [testUser] = testUsers
  const testStats = helpers.makeStatsArray(testUser)

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  /**
   * @description Endpoints for a language owned by a user
   **/
  describe(`Endpoints protected by user`, () => {
    const gameStatsSpecificEndpoint = [
      {
        title: `GET /api/stats`,
        path: `/api/stats`,
        method: supertest(app).get
      },
      {
        title: `POST /api/stats`,
        path: `/api/stats`,
        method: supertest(app).post
      },
    ]

    gameStatsSpecificEndpoint.forEach(endpoint => {
      describe(endpoint.title, () => {
        beforeEach('insert users and stats', () => {
          return helpers.seedUsersStats(
            db,
            testUsers,
            testStats,
          )
        })

        it(`responds with 404 if user doesn't have any stats`, () => {
          return endpoint.method(endpoint.path)
            .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
            .send({})
            .expect(404, {
              error: `You don't have any stats`,
            })
        })
      })
    })
  })

  /**
   * @description Get languages for a user
   **/
  describe(`GET /api/stats`, () => {
    const [usersStats] = testStats.filter(
      stats => stats.user_id === testUser.id
    )

    beforeEach('insert users and stats', () => {
      return helpers.seedUsersStats(
        db,
        testUsers,
        testStats,
      )
    })

    it(`responds with 200 and user's stats`, () => {
      return supertest(app)
        .get(`/api/stats`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect({
            id: usersStats.id,
            game_wins: usersStats.game_wins,
            game_losses: usersStats.game_losses,
            games_played: usersStats.games_played,
            shots_hit: usersStats.shots_hit,
            shots_missed: usersStats.shots_missed,
            carrier_destroyed: usersStats.carrier_destroyed,
            battleship_destroyed: usersStats.battleship_destroyed,
            destroyer_destroyed: usersStats.destroyer_destroyed,
            submarine_destroyed: usersStats.submarine_destroyed,
            patrolboat_destroyed: usersStats.patrolboat_destroyed,
            user_id: testUser.id,
        })
    })
  })


  /**
   * @description Submit a new guess for the language
   **/
  describe(`POST /api/stats`, () => {
    beforeEach('insert users and stats', () => {
      return helpers.seedUsersStats(
        db,
        testUsers,
        testStats,
      )
    })

    const requiredFields = [
        'game_wins', 
        'game_losses', 
        'games_played', 
        'shots_hit', 
        'shots_missed',
        'carrier_destroyed',
        'battleship_destroyed',
        'destroyer_destroyed',
        'submarine_destroyed',
        'patrolboat_destroyed', 
        'user_id'
    ]

    requiredFields.forEach(field => {
      const updatedStats = {
        game_wins: 3,
        game_losses: 5,
        games_played: 10,
        shots_hit: 50,
        shots_missed: 24,
        carrier_destroyed: 10,
        battleship_destroyed: 8,
        destroyer_destroyed: 1,
        submarine_destroyed: 4,
        patrolboat_destroyed: 3,
        user_id: testUser.id
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete updatedStats[field]

        return supertest(app)
          .post('/api/stats')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(updatedStats)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })

  })
})
