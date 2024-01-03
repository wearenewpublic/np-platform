

function clusterWithKMeans(embeddingMap, k, maxIterations = 100, tolerance = 1e-4) {
    const embeddings = Object.values(embeddingMap);    
    console.log('embeddings', embeddings);
    const centroids = initializeCentroids(embeddings, k);
    let previousCentroids;

    var clusters;

    for (let i = 0; i < maxIterations; i++) {
        console.log('iteration', i);
        clusters = createClusters(embeddings, centroids);
        
        previousCentroids = centroids.slice();
        updateCentroids(embeddings, clusters, centroids);
        
        if (hasConverged(previousCentroids, centroids, tolerance)) {
            break;
        }
    }

    const clusterToMessages = clusters.map(cluster =>
        cluster.map(embeddingIndex => Object.keys(embeddingMap)[embeddingIndex])
    );
    const messageToCluster = invertClusterMap(clusters, Object.keys(embeddingMap));

    return {centroids, clusters, clusterToMessages, messageToCluster};
}

exports.clusterWithKMeans = clusterWithKMeans;


function getRandomClusterIndices(clusters, count) {
    var result = [];
    for (cluster in clusters) {
        var picked = [];
        const clusterIndices = clusters[cluster];
        const usedIndices = new Set();
        for (let i = 0; i < count && i < clusterIndices.length - 1 ; i++) {
            var index = Math.floor(Math.random() * clusterIndices.length);
            while (usedIndices.has(index)) {
                index = Math.floor(Math.random() * clusterIndices.length);
            }
            usedIndices.add(index);
            picked.push(clusterIndices[index]);
        }
        result.push(picked);
    }
    return result;
}
exports.getRandomClusterIndices = getRandomClusterIndices;


function invertClusterMap(clusters, keys) {
    var result = {};
    for (cluster in clusters) {
        const clusterIndices = clusters[cluster];
        for (var i = 0; i < clusterIndices.length; i++) {
            result[keys[clusterIndices[i]]] = cluster;
        }
    }
    return result;
}
exports.invertClusterMap = invertClusterMap;


function initializeCentroids(embeddings, k) {
    const centroids = [];
    const usedIndices = new Set();
    
    while (centroids.length < k) {
        const index = Math.floor(Math.random() * embeddings.length);
        
        if (!usedIndices.has(index)) {
            usedIndices.add(index);
            centroids.push(embeddings[index].slice());
        }
    }
    
    return centroids;
}

function createClusters(embeddings, centroids) {
    const clusters = Array.from({ length: centroids.length }, () => []);
    
    embeddings.forEach((embedding, embeddingIndex) => {
        let bestIndex = 0;
        let minDistance = Infinity;
        
        centroids.forEach((centroid, index) => {
            const distance = euclideanDistance(embedding, centroid);
            if (distance < minDistance) {
                bestIndex = index;
                minDistance = distance;
            }
        });
        
        clusters[bestIndex].push(embeddingIndex);
    });
    
    return clusters;
}

function weightedSumEmbeddings(embeddingA, embeddingB, weight) {
    const result = [];
    for (let i = 0; i < embeddingA.length; i++) {
        result[i] = ((1-weight) * embeddingA[i]) + (weight * embeddingB[i]);
    }
    return result;
}


function addContextToShortMessageEmbeddings({embeddings, messages}) {
    const sortedMessageKeys = Object.keys(messages || {}).sort((a, b) => messages[a].ts - messages[b].ts);
    const mergedEmbeddings = {};
    var prevEmbedding = null;
    sortedMessageKeys.forEach(messageKey => {
        const embedding = embeddings[messageKey];
        if (!embedding) return;
        const text = messages[messageKey]?.text;
        const specialText = text.includes('has joined the channel') || text.includes('has left the channel') || text.includes('was added to the channel') || text.includes('was removed from the channel');
        const shouldMerge = prevEmbedding && (specialText || text.length < 100);
        const mergedEmbedding = shouldMerge ? weightedSumEmbeddings(prevEmbedding, embedding, 0.5) : embedding;
        if (embedding) {
            mergedEmbeddings[messageKey] = mergedEmbedding;            
        }
        prevEmbedding = embedding;
    })
    return mergedEmbeddings;
}
exports.addContextToShortMessageEmbeddings = addContextToShortMessageEmbeddings;

function updateCentroids(embeddings, clusters, centroids) {
    clusters.forEach((clusterIndices, index) => {
        if (clusterIndices.length === 0) return;
        
        const newCentroid = Array(embeddings[0].length).fill(0);
        
        clusterIndices.forEach(embeddingIndex => {
            const embedding = embeddings[embeddingIndex];
            for (let i = 0; i < embedding.length; i++) {
                newCentroid[i] += embedding[i];
            }
        });
        
        for (let i = 0; i < newCentroid.length; i++) {
            newCentroid[i] /= clusterIndices.length;
        }
        
        centroids[index] = newCentroid;
    });
}

function euclideanDistance(a, b) {
    let sum = 0;

    for (let i = 0; i < a.length; i++) {
        sum += Math.pow(a[i] - b[i], 2);
    }

    return Math.sqrt(sum);
}

function hasConverged(prevCentroids, centroids, tolerance) {
    let totalDistance = 0;

    for (let i = 0; i < prevCentroids.length; i++) {
        totalDistance += euclideanDistance(prevCentroids[i], centroids[i]);
    }

    return totalDistance < tolerance;
}


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
