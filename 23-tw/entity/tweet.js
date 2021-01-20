class Tweet {
    constructor(id, author, text, createdAt) {
        this.id = id;
        this.author = author;
        this.text = text;
        this.createdAt = createdAt;
    }

    toFeed() {
        return {
            id: this.id,
            author: this.author.login,
            text: this.text,
            createdAt: this.createdAt.toISOString(),
        };
    }

    toAMPQMessage() {
        return JSON.stringify({
            tweetId: Number(this.id),
        })
    }
}

module.exports = {
    Tweet,
}
