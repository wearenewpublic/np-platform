
function triggerOnObjectWrite(structureKey, objectType, triggerFunction) {
    return {
        input: {
            structure: structureKey,
            triggerType: objectType,
        },
        trigger: triggerFunction
    }
}
exports.triggerOnObjectWrite = triggerOnObjectWrite;
