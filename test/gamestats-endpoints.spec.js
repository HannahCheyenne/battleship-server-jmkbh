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
  describe.skip(`POST /api/stats`, () => {
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

    context.skip(`Given shot misses`, () => {


    })

    context.skip(`Given shot hits`, () => {



    })
  })
})
