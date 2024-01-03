const fs = require('fs');
const keys = require('../keys');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: keys.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);


async function transcribeAudioAsync({audioFile}) {
    console.log('transcribeAudioAsync', audioFile);
    try{
        const resp = await openai.createTranscription(
            fs.createReadStream(audioFile),
            "whisper-1"
        );
        return {data: resp.data};
    } catch (error) {
        return {success: false, error: 'OpenAI call failed with error'}
    }
}


exports.apiFunctions = {
    transcribeAudio: transcribeAudioAsync,
}
