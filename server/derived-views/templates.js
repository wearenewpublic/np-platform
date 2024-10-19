
function triggerOnObjectWrite(structureKey, objectType, triggerFunction) {
    return {
        input: {
            structure: structureKey,
            triggerType: objectType,
        },
        trigger: triggerFunction
    }
}
export {triggerOnObjectWrite};
