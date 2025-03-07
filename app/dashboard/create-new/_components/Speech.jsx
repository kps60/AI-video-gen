
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import React, { useEffect, useState } from "react";

function App({ videoscript }) {
  const [voiceLoaded, setVoiceLoaded] = useState(false);
  const [text, setText] = useState(videoscript);

  // const url = 'https://emotional-text-to-speech.p.rapidapi.com/synth';
  const options = {
    method: 'POST',
    url: 'https://emotional-text-to-speech.p.rapidapi.com/synth',
    headers: {
      'x-rapidapi-key': '0a1cfba8c9mshdabe9735e9e48d9p1abc4djsne73e74e1c968',
      'x-rapidapi-host': 'emotional-text-to-speech.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    body: {
      format: 'mp3',
      data: [
        {
          type: 'text',
          lang: 'en',
          speaker: 'Elias',
          data: [
            {
              text: `${text}`,
              emotion: [4],
              pauseAfter: 300,
              pauseBefore: 300
            }
          ]
        }
      ]
    }
  };
  useEffect(() => {
    speakText()
  }, [])


  const speakText = async () => {
    // var text = document.getElementById("textarea")
    try {
      const res = await axios.request(options)
        .then(({ data }) => {
          console.log(data)
        }).catch((error) => {
          throw new Error(error)
        })
      // console.log(data)
      // const result = await response.json();
      // console.log(result);
    } catch (error) {
      console.log(error);
      throw new Error(error)
    }
  };

  return (
    <div>
      <h1>ResponsiveVoice in React</h1>
      {/* <Textarea onChange={e => setText(e.target.value)} id="textarea" cols="30" rows="10" /> */}
      <button onClick={speakText} disabled={!voiceLoaded}>
        {voiceLoaded ? "Speak" : "Loading..."}
      </button>
    </div>
  );
}

export default App;