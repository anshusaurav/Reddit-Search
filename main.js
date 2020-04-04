
async function showTopic(topicName) {
    let posts;
    let response = await fetch(`https://api.reddit.com/r/${topicName}`);
    posts = await response.json();
    return posts;
}
  