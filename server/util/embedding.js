function sortEmbeddingsByDistance(messageKey, embedding, embeddings) {
    const distances = [];
    for (const key in embeddings) {
        if (key == messageKey) continue;
        const otherEmbedding = embeddings[key];
        const distance = getDistance(embedding, otherEmbedding);
        distances.push({key, distance});
    }
    distances.sort((a, b) => a.distance - b.distance);
    return distances;
}

exports.sortEmbeddingsByDistance = sortEmbeddingsByDistance;

function getDistance(embedding1, embedding2) {
    let distance = 0;
    for (let i = 0; i < embedding1?.length; i++) {
        distance += Math.pow(embedding1[i] - embedding2[i], 2);
    }
    return distance;
}

exports.getDistance = getDistance;
