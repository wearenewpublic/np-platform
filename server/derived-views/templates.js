
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

function triggerOnGlobalWrite(useStructureKey, globalKey, triggerFunction) {
    return {
        input: {
            structure: useStructureKey,
            triggerGlobal: globalKey,
        },
        trigger: triggerFunction
    }
}
exports.triggerOnGlobalWrite = triggerOnGlobalWrite;