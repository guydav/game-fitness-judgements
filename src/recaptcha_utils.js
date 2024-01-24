import axios from 'axios'

import appconfig from '@/config'
import useSmileStore from '@/stores/smiledata'


const smilestore = useSmileStore()

export async function checkRecaptcha(token) {
    // const requestOptions = {
    //     method: 'POST',
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //         secret: appconfig.recaptcha_secret_key,
    //         response: token,
    //         remoteip: smilestore.getBrowserFingerprint().ip
    //     })
    // }
    let captchaResponse = null;
    
    // 
    // 'https://verifyrecaptcha-eoptyjmqoa-uc.a.run.app'
    // await axios.post('http://127.0.0.1:5001/smile-db-test/us-central1/verifyRecaptcha', {
    await axios.post('https://verifyrecaptcha-eoptyjmqoa-uc.a.run.app', {
        token,
        ip: smilestore.getBrowserFingerprint().ip
    })
        .then(response => {
            captchaResponse = response.data;
        })
        .catch(error => {
            console.log(error)
        });
    
    return captchaResponse;
}

export default checkRecaptcha;
