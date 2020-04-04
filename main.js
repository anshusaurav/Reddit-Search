async function showTopic(topicName) {
    let posts;
    // read our JSON
    let response = await fetch(`https://api.reddit.com/r/${topicName}`);
    posts = await response.json();
    return posts;
  }
  