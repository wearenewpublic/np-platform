
// Constructor that does nothing. Used for sturctures that don't need a constructor.
const NullConstructor = {
    constructor: ({structureKey, instanceKey}) => {
        console.log('NullConstructor.constructor', {structureKey, instanceKey});        
    }
}
exports.NullConstructor = NullConstructor


