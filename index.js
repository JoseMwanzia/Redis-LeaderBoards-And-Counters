const {createClient} = require('redis');
require('dotenv').config();

let client;
if (process.argv[2] === 'localhost') {
    // local setup
    client = createClient({ url: 'redis://localhost:6379'})
} else {
    // Remote setup
    client = createClient({
        url: process.env.UPSTASH_REDIS_URL,
        password: process.env.UPSTASH_REDIS_PASSWORD,
        tls: true
    })
}

// establish a connection
client.connect()

async function leaderBoardExample() {
    
    // add playes and scores.
    await client.zAdd('game-leaderboard', [
        {score: 150, value: 'Alice'},
        {score: 200, value: 'Bob'},
        {score: 180, value: 'Charlie'},
        {score: 250, value: 'Dave'},
        {score: 220, value: 'Eve'},
        {score: 50, value: 'Camie'},
    ])

    // Get top 3 players
    const topThreePlayers = await client.zRangeWithScores('game-leaderboard', 0, 2, { REV: true })
    console.log(`Top Three players:`,  topThreePlayers), '\n'

    // Get Charlie's Rank
    const charlieRank = await client.zRevRank('game-leaderboard', 'Charlie')
    console.log(`Charlie's Rank: ${charlieRank}`), '\n'

    // Update Charlie's score by 30
    await client.zIncrBy('game-leaderboard', 100, 'Charlie')
    const updatedPlayers = await client.zRangeWithScores('game-leaderboard', 0, 2, { REV: true })
    console.log(`Updated players Ranks:`, updatedPlayers);
    
    process.exit(0)
}
leaderBoardExample()


async function counterExample() {
    // increment page view count
    await client.incr('article:12345:views')

    // Get the current page view count
    const views = await client.get('article:12345:views')
    console.log(`Page Views:`, views), '\n'

    // Bulk increment likes
    await client.incrBy('article:12345:likes', 5)
    const likes = await client.get('article:12345:views')
    console.log(`Page Likes:`, likes);
}
counterExample()